import { Router } from 'express';
import { db } from '../db/database.js';
import { AuthenticatedRequest, requireAuth, logAudit } from '../middleware/auth.js';

const router = Router();

// GET /api/v1/donors - Search & filter donors
router.get('/', (req: AuthenticatedRequest, res) => {
  try {
    const {
      blood_group,
      district,
      upazila,
      area,
      is_available,
      is_verified,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    let whereClauses: string[] = ["u.status = 'active'"];
    const params: any[] = [];

    if (blood_group && blood_group !== 'all') {
      whereClauses.push('d.blood_group = ?');
      params.push(blood_group);
    }

    if (district && district !== 'all') {
      whereClauses.push('d.district = ?');
      params.push(district);
    }

    if (upazila && upazila !== 'all') {
      whereClauses.push('d.upazila = ?');
      params.push(upazila);
    }

    if (area) {
      whereClauses.push('(d.area LIKE ? OR d.address LIKE ?)');
      params.push(`%${area}%`, `%${area}%`);
    }

    if (is_available !== undefined && is_available !== '') {
      whereClauses.push('d.is_available = ?');
      params.push(Number(is_available));
    }

    if (is_verified !== undefined && is_verified !== '') {
      whereClauses.push('d.is_verified = ?');
      params.push(Number(is_verified));
    }

    if (search) {
      whereClauses.push('(u.name LIKE ? OR d.upazila LIKE ? OR d.district LIKE ? OR d.area LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Total count
    const countRow = db.prepare(`
      SELECT COUNT(*) as total
      FROM donors d
      JOIN users u ON d.user_id = u.id
      ${whereSql}
    `).get(...params) as { total: number };

    // Query donors
    const donors = db.prepare(`
      SELECT d.id, d.user_id, u.name, u.avatar, d.blood_group, d.gender, d.age,
             d.district, d.upazila, d.area, d.last_donation_date, d.total_donations,
             d.is_available, d.is_verified,
             u.phone
      FROM donors d
      JOIN users u ON d.user_id = u.id
      ${whereSql}
      ORDER BY d.is_available DESC, d.is_verified DESC, d.total_donations DESC, d.id DESC
      LIMIT ? OFFSET ?
    `).all(...params, Number(limit), offset) as any[];

    // Privacy rule: If requester is not logged in, mask the middle digits of phone number for security
    const isLoggedIn = !!req.user;
    const sanitizedDonors = donors.map((d) => {
      let displayPhone = d.phone;
      if (!isLoggedIn && displayPhone) {
        displayPhone = displayPhone.slice(0, 3) + '••••' + displayPhone.slice(7);
      }
      return {
        ...d,
        phone: displayPhone,
        canDirectCall: isLoggedIn,
      };
    });

    return res.json({
      success: true,
      data: {
        donors: sanitizedDonors,
        pagination: {
          total: countRow.total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(countRow.total / Number(limit)),
        },
      },
    });
  } catch (err: any) {
    console.error('[DONORS] Search error:', err);
    return res.status(500).json({
      success: false,
      message: 'রক্তদাতা তালিকা লোড করতে সমস্যা হয়েছে।',
    });
  }
});

// GET /api/v1/donors/:id - Public Donor Profile
router.get('/:id', (req: AuthenticatedRequest, res) => {
  try {
    const donorId = Number(req.params.id);
    const donor = db.prepare(`
      SELECT d.id, d.user_id, u.name, u.avatar, d.blood_group, d.gender, d.age,
             d.district, d.upazila, d.area, d.address, d.last_donation_date,
             d.total_donations, d.is_available, d.is_verified, d.created_at,
             u.phone
      FROM donors d
      JOIN users u ON d.user_id = u.id
      WHERE d.id = ? AND u.status = 'active'
    `).get(donorId) as any;

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'রক্তদাতার প্রোফাইল খুঁজে পাওয়া যায়নি।',
      });
    }

    const isLoggedIn = !!req.user;
    let displayPhone = donor.phone;
    if (!isLoggedIn && displayPhone) {
      displayPhone = displayPhone.slice(0, 3) + '••••' + displayPhone.slice(7);
    }

    return res.json({
      success: true,
      data: {
        ...donor,
        phone: displayPhone,
        canDirectCall: isLoggedIn,
      },
    });
  } catch (err: any) {
    console.error('[DONORS] Profile error:', err);
    return res.status(500).json({
      success: false,
      message: 'প্রোফাইল লোড করতে ব্যর্থ হয়েছে।',
    });
  }
});

// PUT /api/v1/donors/profile - Update current user's donor profile
router.put('/profile', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const {
      name,
      blood_group,
      gender,
      age,
      district,
      upazila,
      area,
      address,
      last_donation_date,
      total_donations,
      is_available,
    } = req.body;

    if (name) {
      db.prepare('UPDATE users SET name = ?, updated_at = datetime(\'now\') WHERE id = ?').run(
        name.trim(),
        userId
      );
    }

    // Check if donor record exists
    const existingDonor = db.prepare('SELECT id FROM donors WHERE user_id = ?').get(userId) as any;

    if (existingDonor) {
      db.prepare(`
        UPDATE donors SET
          blood_group = COALESCE(?, blood_group),
          gender = COALESCE(?, gender),
          age = COALESCE(?, age),
          district = COALESCE(?, district),
          upazila = COALESCE(?, upazila),
          area = COALESCE(?, area),
          address = COALESCE(?, address),
          last_donation_date = COALESCE(?, last_donation_date),
          total_donations = COALESCE(?, total_donations),
          is_available = COALESCE(?, is_available),
          updated_at = datetime('now')
        WHERE user_id = ?
      `).run(
        blood_group,
        gender,
        age !== undefined ? Number(age) : null,
        district,
        upazila,
        area,
        address,
        last_donation_date,
        total_donations !== undefined ? Number(total_donations) : null,
        is_available !== undefined ? (is_available ? 1 : 0) : null,
        userId
      );
    } else {
      db.prepare(`
        INSERT INTO donors (
          user_id, blood_group, gender, age, district, upazila, area, address,
          last_donation_date, total_donations, is_available, is_verified
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
      `).run(
        userId,
        blood_group || 'O+',
        gender || 'male',
        age ? Number(age) : null,
        district || 'বরিশাল',
        upazila || 'বরিশাল সদর',
        area || null,
        address || null,
        last_donation_date || null,
        total_donations ? Number(total_donations) : 0,
        is_available ? 1 : 0
      );
    }

    logAudit(userId, 'DONOR_PROFILE_UPDATED', 'donor', existingDonor?.id || 0, req.body, req.ip);

    const updated = db.prepare(`
      SELECT d.*, u.name, u.phone, u.role
      FROM donors d
      JOIN users u ON d.user_id = u.id
      WHERE d.user_id = ?
    `).get(userId);

    return res.json({
      success: true,
      message: 'প্রোফাইল সফলভাবে আপডেট করা হয়েছে!',
      data: updated,
    });
  } catch (err: any) {
    console.error('[DONORS] Update profile error:', err);
    return res.status(500).json({
      success: false,
      message: 'প্রোফাইল আপডেট করতে সমস্যা হয়েছে।',
    });
  }
});

// POST /api/v1/donors/toggle-availability
router.post('/toggle-availability', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const donor = db.prepare('SELECT id, is_available FROM donors WHERE user_id = ?').get(userId) as any;
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'রক্তদাতা প্রোফাইল পাওয়া যায়নি।',
      });
    }

    const nextStatus = donor.is_available === 1 ? 0 : 1;
    db.prepare('UPDATE donors SET is_available = ?, updated_at = datetime(\'now\') WHERE id = ?').run(
      nextStatus,
      donor.id
    );

    return res.json({
      success: true,
      message: nextStatus === 1 ? 'আপনি রক্তদানের জন্য প্রস্তুত আছেন।' : 'আপাতত রক্তদানে অনিচ্ছুক করা হলো।',
      data: { is_available: nextStatus },
    });
  } catch (err: any) {
    console.error('[DONORS] Toggle availability error:', err);
    return res.status(500).json({
      success: false,
      message: 'স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে।',
    });
  }
});

export default router;
