import { Router } from 'express';
import { db } from '../db/database.js';
import { AuthenticatedRequest, requireAuth, logAudit } from '../middleware/auth.js';

const router = Router();

// GET /api/v1/requests - List blood requests
router.get('/', (req: AuthenticatedRequest, res) => {
  try {
    const {
      status,
      blood_group,
      emergency_level,
      district,
      upazila,
      page = 1,
      limit = 20,
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    let whereClauses: string[] = [];
    const params: any[] = [];

    // Default to active or urgent unless specified
    if (status && status !== 'all') {
      whereClauses.push('r.status = ?');
      params.push(status);
    } else {
      whereClauses.push("r.status IN ('active', 'urgent')");
    }

    if (blood_group && blood_group !== 'all') {
      whereClauses.push('r.blood_group = ?');
      params.push(blood_group);
    }

    if (emergency_level && emergency_level !== 'all') {
      whereClauses.push('r.emergency_level = ?');
      params.push(emergency_level);
    }

    if (district && district !== 'all') {
      whereClauses.push('r.district = ?');
      params.push(district);
    }

    if (upazila && upazila !== 'all') {
      whereClauses.push('r.upazila = ?');
      params.push(upazila);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const countRow = db.prepare(`
      SELECT COUNT(*) as total FROM blood_requests r ${whereSql}
    `).get(...params) as { total: number };

    const requests = db.prepare(`
      SELECT r.*,
             (SELECT COUNT(*) FROM request_responses resp WHERE resp.request_id = r.id AND resp.status = 'accepted') as accepted_count,
             (SELECT COUNT(*) FROM request_responses resp WHERE resp.request_id = r.id) as total_responses
      FROM blood_requests r
      ${whereSql}
      ORDER BY
        CASE r.emergency_level
          WHEN 'critical' THEN 1
          WHEN 'urgent' THEN 2
          ELSE 3
        END ASC,
        r.needed_date ASC,
        r.id DESC
      LIMIT ? OFFSET ?
    `).all(...params, Number(limit), offset) as any[];

    // If current user is a donor, check if they already responded
    const userDonor = req.user ? db.prepare('SELECT id FROM donors WHERE user_id = ?').get(req.user.id) as any : null;
    let enriched = requests;
    if (userDonor) {
      enriched = requests.map((r) => {
        const resp = db.prepare('SELECT status, donor_message FROM request_responses WHERE request_id = ? AND donor_id = ?').get(r.id, userDonor.id) as any;
        return {
          ...r,
          my_response: resp ? resp.status : null,
          my_message: resp ? resp.donor_message : null,
        };
      });
    }

    return res.json({
      success: true,
      data: {
        requests: enriched,
        pagination: {
          total: countRow.total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(countRow.total / Number(limit)),
        },
      },
    });
  } catch (err: any) {
    console.error('[REQUESTS] Fetch error:', err);
    return res.status(500).json({
      success: false,
      message: 'রক্তের অনুরোধ লোড করতে ব্যর্থ হয়েছে।',
    });
  }
});

// GET /api/v1/requests/:id - Single blood request details with donor responses
router.get('/:id', (req: AuthenticatedRequest, res) => {
  try {
    const requestId = Number(req.params.id);
    const request = db.prepare(`
      SELECT r.*, u.name as requester_name
      FROM blood_requests r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.id = ?
    `).get(requestId) as any;

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'রক্তের অনুরোধটি খুঁজে পাওয়া যায়নি।',
      });
    }

    // Get responses for this request
    const responses = db.prepare(`
      SELECT resp.*, d.blood_group, d.district, d.upazila, d.is_verified, d.total_donations,
             u.name as donor_name, u.phone as donor_phone
      FROM request_responses resp
      JOIN donors d ON resp.donor_id = d.id
      JOIN users u ON d.user_id = u.id
      WHERE resp.request_id = ?
      ORDER BY resp.created_at DESC
    `).all(requestId);

    return res.json({
      success: true,
      data: {
        ...request,
        responses,
      },
    });
  } catch (err: any) {
    console.error('[REQUESTS] Details error:', err);
    return res.status(500).json({
      success: false,
      message: 'অনুরোধের বিস্তারিত লোড করা যায়নি।',
    });
  }
});

// POST /api/v1/requests - Create new Blood Request
router.post('/', async (req: AuthenticatedRequest, res) => {
  try {
    const {
      patient_name,
      blood_group,
      units_needed = 1,
      hospital_name,
      district = 'বরিশাল',
      upazila,
      location_details,
      needed_date,
      needed_time,
      contact_phone,
      emergency_level = 'urgent',
      case_info,
      additional_notes,
    } = req.body;

    if (!patient_name || !blood_group || !hospital_name || !contact_phone || !needed_date || !needed_time) {
      return res.status(400).json({
        success: false,
        message: 'রোগীর নাম, রক্তের গ্রুপ, হাসপাতাল, যোগাযোগের নম্বর এবং তারিখ-সময় আবশ্যক',
      });
    }

    const userId = req.user ? req.user.id : null;

    const result = db.prepare(`
      INSERT INTO blood_requests (
        user_id, patient_name, blood_group, units_needed, hospital_name,
        district, upazila, location_details, needed_date, needed_time,
        contact_phone, emergency_level, case_info, additional_notes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
    `).run(
      userId,
      patient_name.trim(),
      blood_group,
      Number(units_needed) || 1,
      hospital_name.trim(),
      district,
      upazila || 'বরিশাল সদর',
      location_details || null,
      needed_date,
      needed_time,
      contact_phone.trim(),
      emergency_level,
      case_info || null,
      additional_notes || null
    );

    const newRequestId = Number(result.lastInsertRowid);

    // Notify matching available donors in this district/upazila and blood group
    try {
      const matchingDonors = db.prepare(`
        SELECT d.user_id FROM donors d
        WHERE d.blood_group = ? AND d.is_available = 1 AND d.district = ?
        LIMIT 30
      `).all(blood_group, district) as { user_id: number }[];

      for (const donor of matchingDonors) {
        if (donor.user_id !== userId) {
          db.prepare(`
            INSERT INTO notifications (user_id, title, message, type, metadata_json)
            VALUES (?, ?, ?, ?, ?)
          `).run(
            donor.user_id,
            emergency_level === 'critical' ? 'জরুরি রক্তের অনুরোধ!' : 'নতুন রক্তের অনুরোধ',
            `${hospital_name}-এ ${patient_name}-এর জন্য ${blood_group} রক্ত প্রয়োজন।`,
            emergency_level === 'critical' ? 'emergency' : 'blood_request',
            JSON.stringify({ request_id: newRequestId, blood_group, hospital_name })
          );
        }
      }
    } catch (notifErr) {
      console.error('[NOTIF] Failed to push notifications to donors:', notifErr);
    }

    logAudit(userId, 'CREATE_BLOOD_REQUEST', 'blood_request', newRequestId, { blood_group, patient_name, hospital_name }, req.ip);

    return res.status(201).json({
      success: true,
      message: 'রক্তের অনুরোধ সফলভাবে পোস্ট করা হয়েছে!',
      data: { id: newRequestId },
    });
  } catch (err: any) {
    console.error('[REQUESTS] Create error:', err);
    return res.status(500).json({
      success: false,
      message: 'রক্তের অনুরোধ পোস্ট করতে সমস্যা হয়েছে।',
    });
  }
});

// POST /api/v1/requests/:id/respond - Donor responds to blood request
router.post('/:id/respond', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const requestId = Number(req.params.id);
    const { status = 'accepted', message = '' } = req.body;

    const donor = db.prepare('SELECT id, blood_group FROM donors WHERE user_id = ?').get(req.user!.id) as any;
    if (!donor) {
      return res.status(403).json({
        success: false,
        message: 'রক্তদানের প্রতিক্রিয়া জানাতে আপনার একটি রক্তদাতা প্রোফাইল থাকতে হবে।',
      });
    }

    const bloodReq = db.prepare('SELECT * FROM blood_requests WHERE id = ?').get(requestId) as any;
    if (!bloodReq) {
      return res.status(404).json({
        success: false,
        message: 'অনুরোধটি খুঁজে পাওয়া যায়নি।',
      });
    }

    // Upsert response to prevent duplicate responses
    const existing = db.prepare('SELECT id FROM request_responses WHERE request_id = ? AND donor_id = ?').get(requestId, donor.id) as any;

    if (existing) {
      db.prepare(`
        UPDATE request_responses
        SET status = ?, donor_message = ?, updated_at = datetime('now')
        WHERE id = ?
      `).run(status, message, existing.id);
    } else {
      db.prepare(`
        INSERT INTO request_responses (request_id, donor_id, status, donor_message)
        VALUES (?, ?, ?, ?)
      `).run(requestId, donor.id, status, message);
    }

    // Notify requester if registered user
    if (bloodReq.user_id) {
      const statusText = status === 'accepted' ? 'রক্তদানে সম্মতি জানিয়েছেন' : status === 'declined' ? 'অসম্মতি জানিয়েছেন' : 'পরে যোগাযোগ করতে চেয়েছেন';
      db.prepare(`
        INSERT INTO notifications (user_id, title, message, type, metadata_json)
        VALUES (?, 'রক্তদাতার প্রতিক্রিয়া!', ?, 'accepted', ?)
      `).run(
        bloodReq.user_id,
        `${req.user!.name} (${donor.blood_group}) আপনার অনুরোধে ${statusText}।`,
        JSON.stringify({ request_id: requestId, donor_id: donor.id, status })
      );
    }

    logAudit(req.user!.id, 'DONOR_RESPOND_REQUEST', 'blood_request', requestId, { status }, req.ip);

    return res.json({
      success: true,
      message: 'আপনার প্রতিক্রিয়া সফলভাবে সংরক্ষিত হয়েছে। ধন্যবাদ!',
    });
  } catch (err: any) {
    console.error('[REQUESTS] Respond error:', err);
    return res.status(500).json({
      success: false,
      message: 'প্রতিক্রিয়া পাঠাতে সমস্যা হয়েছে।',
    });
  }
});

// POST /api/v1/requests/:id/status - Update request status (fulfilled / cancelled)
router.post('/:id/status', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const requestId = Number(req.params.id);
    const { status } = req.body;

    if (!['active', 'fulfilled', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'অবৈধ স্ট্যাটাস',
      });
    }

    const bloodReq = db.prepare('SELECT * FROM blood_requests WHERE id = ?').get(requestId) as any;
    if (!bloodReq) {
      return res.status(404).json({
        success: false,
        message: 'অনুরোধটি খুঁজে পাওয়া যায়নি।',
      });
    }

    // Only owner or admin can update status
    const isOwner = bloodReq.user_id === req.user!.id;
    const isAdmin = req.user!.role === 'admin' || req.user!.role === 'super_admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'এই অনুরোধ পরিবর্তনের অনুমতি নেই।',
      });
    }

    db.prepare(`
      UPDATE blood_requests SET status = ?, updated_at = datetime('now') WHERE id = ?
    `).run(status, requestId);

    logAudit(req.user!.id, 'UPDATE_REQUEST_STATUS', 'blood_request', requestId, { newStatus: status }, req.ip);

    return res.json({
      success: true,
      message: 'স্ট্যাটাস সফলভাবে পরিবর্তিত হয়েছে।',
      data: { status },
    });
  } catch (err: any) {
    console.error('[REQUESTS] Status update error:', err);
    return res.status(500).json({
      success: false,
      message: 'স্ট্যাটাস আপডেট ব্যর্থ হয়েছে।',
    });
  }
});

export default router;
