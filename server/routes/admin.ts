import { Router } from 'express';
import { db } from '../db/database.js';
import {
  AuthenticatedRequest,
  requireAdmin,
  requireSuperAdmin,
  logAudit,
} from '../middleware/auth.js';

const router = Router();

// Apply requireAdmin to all routes in this router
router.use(requireAdmin);

// 1. Dashboard Stats & Analytics
router.get('/stats', (req, res) => {
  try {
    const totalDonors = db.prepare('SELECT COUNT(*) as count FROM donors').get() as { count: number };
    const activeDonors = db.prepare('SELECT COUNT(*) as count FROM donors WHERE is_available = 1').get() as { count: number };
    const verifiedDonors = db.prepare('SELECT COUNT(*) as count FROM donors WHERE is_verified = 1').get() as { count: number };
    const totalRequests = db.prepare('SELECT COUNT(*) as count FROM blood_requests').get() as { count: number };
    const emergencyRequests = db.prepare("SELECT COUNT(*) as count FROM blood_requests WHERE emergency_level IN ('critical', 'urgent')").get() as { count: number };
    const fulfilledRequests = db.prepare("SELECT COUNT(*) as count FROM blood_requests WHERE status = 'fulfilled'").get() as { count: number };
    const totalHospitals = db.prepare('SELECT COUNT(*) as count FROM hospitals').get() as { count: number };
    const pendingReports = db.prepare("SELECT COUNT(*) as count FROM reports WHERE status = 'pending'").get() as { count: number };
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };

    // Blood group distribution
    const bloodGroupDist = db.prepare(`
      SELECT blood_group, COUNT(*) as count
      FROM donors
      GROUP BY blood_group
      ORDER BY count DESC
    `).all();

    // District distribution
    const districtDist = db.prepare(`
      SELECT district, COUNT(*) as count
      FROM donors
      GROUP BY district
      ORDER BY count DESC
    `).all();

    // Request status breakdown
    const requestStatusDist = db.prepare(`
      SELECT status, COUNT(*) as count
      FROM blood_requests
      GROUP BY status
    `).all();

    // Recent 10 audit logs
    const recentAuditLogs = db.prepare(`
      SELECT a.*, u.name as user_name
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
      LIMIT 10
    `).all();

    return res.json({
      success: true,
      data: {
        summary: {
          totalDonors: totalDonors.count,
          activeDonors: activeDonors.count,
          verifiedDonors: verifiedDonors.count,
          totalRequests: totalRequests.count,
          emergencyRequests: emergencyRequests.count,
          fulfilledRequests: fulfilledRequests.count,
          totalHospitals: totalHospitals.count,
          pendingReports: pendingReports.count,
          totalUsers: totalUsers.count,
        },
        bloodGroupDist,
        districtDist,
        requestStatusDist,
        recentAuditLogs,
      },
    });
  } catch (err: any) {
    console.error('[ADMIN] Stats error:', err);
    return res.status(500).json({
      success: false,
      message: 'পরিসংখ্যান লোড করতে সমস্যা হয়েছে।',
    });
  }
});

// 2. Donor Management: List all donors with admin controls
router.get('/donors', (req, res) => {
  try {
    const { search, district, blood_group, is_verified, page = 1, limit = 50 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    let where: string[] = ['1=1'];
    const params: any[] = [];

    if (search) {
      where.push('(u.name LIKE ? OR u.phone LIKE ? OR d.upazila LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (district && district !== 'all') {
      where.push('d.district = ?');
      params.push(district);
    }
    if (blood_group && blood_group !== 'all') {
      where.push('d.blood_group = ?');
      params.push(blood_group);
    }
    if (is_verified !== undefined && is_verified !== '') {
      where.push('d.is_verified = ?');
      params.push(Number(is_verified));
    }

    const whereStr = where.join(' AND ');

    const countRow = db.prepare(`
      SELECT COUNT(*) as count
      FROM donors d
      JOIN users u ON d.user_id = u.id
      WHERE ${whereStr}
    `).get(...params) as { count: number };

    const donors = db.prepare(`
      SELECT d.*, u.name, u.phone, u.status as user_status, u.role
      FROM donors d
      JOIN users u ON d.user_id = u.id
      WHERE ${whereStr}
      ORDER BY d.id DESC
      LIMIT ? OFFSET ?
    `).all(...params, Number(limit), offset);

    return res.json({
      success: true,
      data: {
        donors,
        total: countRow.count,
        page: Number(page),
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'রক্তদাতা তালিকা লোড ব্যর্থ হয়েছে।' });
  }
});

// Verify / Unverify Donor
router.put('/donors/:id/verify', (req: AuthenticatedRequest, res) => {
  try {
    const donorId = Number(req.params.id);
    const { is_verified, verification_notes } = req.body;

    db.prepare(`
      UPDATE donors
      SET is_verified = ?, verification_notes = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(is_verified ? 1 : 0, verification_notes || null, donorId);

    const donor = db.prepare('SELECT user_id FROM donors WHERE id = ?').get(donorId) as any;
    if (donor) {
      db.prepare(`
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (?, 'রক্তদাতা যাচাইকরণ সফল!', 'অভিনন্দন! আপনার রক্তদাতা প্রোফাইলটি অ্যাডমিন টিম কর্তৃক যাচাই (Verified) করা হয়েছে।', 'system')
      `).run(donor.user_id);
    }

    logAudit(req.user!.id, 'VERIFY_DONOR', 'donor', donorId, { is_verified }, req.ip);

    return res.json({
      success: true,
      message: is_verified ? 'রক্তদাতা ভেরিফাই করা হয়েছে।' : 'ভেরিফিকেশন প্রত্যাহার করা হয়েছে।',
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'আপডেট ব্যর্থ হয়েছে।' });
  }
});

// Suspend / Activate Donor's User Account
router.put('/users/:id/status', (req: AuthenticatedRequest, res) => {
  try {
    const userId = Number(req.params.id);
    const { status } = req.body; // 'active' or 'suspended'

    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'অবৈধ স্ট্যাটাস' });
    }

    db.prepare("UPDATE users SET status = ?, updated_at = datetime('now') WHERE id = ?").run(status, userId);

    // Invalidate sessions if suspended
    if (status === 'suspended') {
      db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);
    }

    logAudit(req.user!.id, 'UPDATE_USER_STATUS', 'user', userId, { status }, req.ip);

    return res.json({
      success: true,
      message: `ব্যবহারকারীর স্ট্যাটাস '${status}' করা হয়েছে।`,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'আপডেট ব্যর্থ হয়েছে।' });
  }
});

// Delete Donor
router.delete('/donors/:id', requireSuperAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const donorId = Number(req.params.id);
    const donor = db.prepare('SELECT user_id FROM donors WHERE id = ?').get(donorId) as any;
    if (donor) {
      db.prepare('DELETE FROM donors WHERE id = ?').run(donorId);
      logAudit(req.user!.id, 'DELETE_DONOR', 'donor', donorId, null, req.ip);
    }
    return res.json({ success: true, message: 'রক্তদাতা মুছে ফেলা হয়েছে।' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'মুছে ফেলতে ব্যর্থ হয়েছে।' });
  }
});

// 3. Broadcast Notification to all or target donors
router.post('/broadcast', (req: AuthenticatedRequest, res) => {
  try {
    const { title, message, target_group = 'all' } = req.body;
    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'শিরোনাম ও বার্তা আবশ্যক' });
    }

    const broadcastInsert = db.prepare(`
      INSERT INTO broadcasts (admin_id, title, message, target_group)
      VALUES (?, ?, ?, ?)
    `).run(req.user!.id, title.trim(), message.trim(), target_group);

    // Distribute notification to users
    let usersQuery = 'SELECT id FROM users WHERE status = "active"';
    if (target_group.startsWith('blood_group_')) {
      const bg = target_group.replace('blood_group_', '');
      usersQuery = `SELECT u.id FROM users u JOIN donors d ON d.user_id = u.id WHERE d.blood_group = '${bg}' AND u.status = 'active'`;
    } else if (target_group === 'donors') {
      usersQuery = 'SELECT u.id FROM users u JOIN donors d ON d.user_id = u.id WHERE u.status = "active"';
    }

    const targetUsers = db.prepare(usersQuery).all() as { id: number }[];
    for (const u of targetUsers) {
      db.prepare(`
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (?, ?, ?, 'broadcast')
      `).run(u.id, title.trim(), message.trim());
    }

    logAudit(req.user!.id, 'SEND_BROADCAST', 'broadcast', Number(broadcastInsert.lastInsertRowid), { target_group, recipients: targetUsers.length }, req.ip);

    return res.json({
      success: true,
      message: `${targetUsers.length} জন ব্যবহারকারীকে সফলভাবে ব্রডকাস্ট পাঠানো হয়েছে।`,
    });
  } catch (err: any) {
    console.error('[ADMIN] Broadcast error:', err);
    return res.status(500).json({ success: false, message: 'ব্রডকাস্ট পাঠাতে সমস্যা হয়েছে।' });
  }
});

// 4. Activity Logs / Audit Logs
router.get('/audit-logs', (req, res) => {
  try {
    const logs = db.prepare(`
      SELECT a.*, u.name as user_name, u.phone as user_phone
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
      LIMIT 100
    `).all();

    return res.json({
      success: true,
      data: logs,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'লগ লোড করতে সমস্যা হয়েছে।' });
  }
});

// 5. Strict Disciplinary Action on Donor / User
router.post('/donors/:id/strict-action', (req: AuthenticatedRequest, res) => {
  try {
    const donorId = Number(req.params.id);
    const { action, reason = '', warning_level = 'strict' } = req.body;
    // Supported actions: 'ban', 'unban', 'warn', 'verify', 'unverify', 'delete'

    const donor = db.prepare(`
      SELECT d.*, u.id as user_id, u.phone, u.name, u.status as user_status
      FROM donors d
      JOIN users u ON d.user_id = u.id
      WHERE d.id = ?
    `).get(donorId) as any;

    if (!donor) {
      return res.status(404).json({ success: false, message: 'রক্তদাতা খুঁজে পাওয়া যায়নি।' });
    }

    const userId = donor.user_id;

    if (action === 'ban') {
      // 1. Suspend user account immediately
      db.prepare("UPDATE users SET status = 'suspended', updated_at = datetime('now') WHERE id = ?").run(userId);
      // 2. Invalidate all active sessions
      db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);
      // 3. Mark donor as unavailable
      db.prepare('UPDATE donors SET is_available = 0, is_verified = 0 WHERE id = ?').run(donorId);
      // 4. Record into blacklist records
      db.prepare(`
        INSERT INTO blacklist_records (phone, user_id, reason, admin_id, banned_at, is_active)
        VALUES (?, ?, ?, ?, datetime('now'), 1)
      `).run(donor.phone, userId, reason || 'শৃঙ্খলা ভঙ্গ ও অসদাচরণের দায়ে অ্যাডমিন কর্তৃক নিষিদ্ধ', req.user!.id);

      logAudit(req.user!.id, 'STRICT_BAN_USER', 'donor', donorId, { userId, phone: donor.phone, reason }, req.ip);

      return res.json({
        success: true,
        message: `ব্যবহারকারী '${donor.name}' কে সফলভাবে স্থায়ীভাবে ব্যান ও নিষিদ্ধ করা হয়েছে।`,
      });
    }

    if (action === 'unban') {
      db.prepare("UPDATE users SET status = 'active', updated_at = datetime('now') WHERE id = ?").run(userId);
      db.prepare("UPDATE blacklist_records SET is_active = 0 WHERE user_id = ? OR phone = ?").run(userId, donor.phone);

      logAudit(req.user!.id, 'STRICT_UNBAN_USER', 'donor', donorId, { userId, reason }, req.ip);

      return res.json({
        success: true,
        message: `ব্যবহারকারী '${donor.name}' এর নিষেধাজ্ঞা প্রত্যাহার ও অ্যাকাউন্ট সক্রিয় করা হয়েছে।`,
      });
    }

    if (action === 'warn') {
      const warnMsg = reason || 'সতর্কবার্তা: আপনার অ্যাকাউন্টের বিরুদ্ধে অসদাচরণ বা নীতিমালার পরিপন্থী অভিযোগ পাওয়া গেছে। অবিলম্বে সতর্ক হোন!';
      db.prepare(`
        INSERT INTO user_warnings (user_id, admin_id, warning_level, message, created_at)
        VALUES (?, ?, ?, ?, datetime('now'))
      `).run(userId, req.user!.id, warning_level, warnMsg);

      db.prepare(`
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (?, '⚠️ প্রশাসনিক কঠোর সতর্কবার্তা!', ?, 'system')
      `).run(userId, warnMsg);

      logAudit(req.user!.id, 'ISSUE_STRICT_WARNING', 'donor', donorId, { userId, warning_level, reason: warnMsg }, req.ip);

      return res.json({
        success: true,
        message: `'${donor.name}' কে কঠোর সতর্কবার্তা প্রেরণ করা হয়েছে।`,
      });
    }

    if (action === 'verify') {
      db.prepare("UPDATE donors SET is_verified = 1, updated_at = datetime('now') WHERE id = ?").run(donorId);
      db.prepare(`
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (?, '🎉 ভেরিফাইড রক্তদাতা ব্যাজ!', 'অভিনন্দন! আপনার রক্তদাতা প্রোফাইলটি অ্যাডমিন টিম কর্তৃক আনুষ্ঠানিকভাবে ভেরিফাই করা হয়েছে।', 'system')
      `).run(userId);

      logAudit(req.user!.id, 'VERIFY_DONOR_BADGE', 'donor', donorId, {}, req.ip);
      return res.json({ success: true, message: 'রক্তদাতাকে ভেরিফাইড ব্যাজ প্রদান করা হয়েছে।' });
    }

    if (action === 'unverify') {
      db.prepare("UPDATE donors SET is_verified = 0, updated_at = datetime('now') WHERE id = ?").run(donorId);
      logAudit(req.user!.id, 'REVOKE_DONOR_BADGE', 'donor', donorId, {}, req.ip);
      return res.json({ success: true, message: 'ভেরিফাইড ব্যাজ বাতিল করা হয়েছে।' });
    }

    if (action === 'delete') {
      db.prepare('DELETE FROM donors WHERE id = ?').run(donorId);
      logAudit(req.user!.id, 'DELETE_DONOR_PROFILE', 'donor', donorId, { name: donor.name }, req.ip);
      return res.json({ success: true, message: 'রক্তদাতার প্রোফাইল স্থায়ীভাবে মুছে ফেলা হয়েছে।' });
    }

    return res.status(400).json({ success: false, message: 'অজানা অ্যাকশন।' });
  } catch (err: any) {
    console.error('[ADMIN] Strict action error:', err);
    return res.status(500).json({ success: false, message: 'কঠোর ব্যবস্থা গ্রহণে সমস্যা হয়েছে।' });
  }
});

// 6. Blood Requests Management & Strict Actions
router.get('/requests', (req, res) => {
  try {
    const { status, emergency_level, search } = req.query;
    let where = ['1=1'];
    const params: any[] = [];

    if (status && status !== 'all') {
      where.push('r.status = ?');
      params.push(status);
    }
    if (emergency_level && emergency_level !== 'all') {
      where.push('r.emergency_level = ?');
      params.push(emergency_level);
    }
    if (search) {
      where.push('(r.patient_name LIKE ? OR r.hospital_name LIKE ? OR r.contact_number LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const requests = db.prepare(`
      SELECT r.*, u.name as requester_name, u.phone as requester_phone
      FROM blood_requests r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE ${where.join(' AND ')}
      ORDER BY r.id DESC
      LIMIT 100
    `).all(...params);

    return res.json({ success: true, data: requests });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'অনুরোধ তালিকা লোড ব্যর্থ হয়েছে।' });
  }
});

router.post('/requests/:id/strict-action', (req: AuthenticatedRequest, res) => {
  try {
    const reqId = Number(req.params.id);
    const { action, reason = '', new_status } = req.body;

    const bloodReq = db.prepare('SELECT * FROM blood_requests WHERE id = ?').get(reqId) as any;
    if (!bloodReq) {
      return res.status(404).json({ success: false, message: 'অনুরোধ খুঁজে পাওয়া যায়নি।' });
    }

    if (action === 'fraud_takedown') {
      db.prepare("UPDATE blood_requests SET status = 'cancelled', updated_at = datetime('now') WHERE id = ?").run(reqId);
      logAudit(req.user!.id, 'FRAUD_REQUEST_TAKEDOWN', 'request', reqId, { reason, patient: bloodReq.patient_name }, req.ip);

      return res.json({
        success: true,
        message: 'ভুয়া/স্প্যাম রক্তের আবেদন অবিলম্বে বাতিল ও বন্ধ করা হয়েছে।',
      });
    }

    if (action === 'emergency_siren') {
      db.prepare("UPDATE blood_requests SET emergency_level = 'critical', updated_at = datetime('now') WHERE id = ?").run(reqId);

      // Distribute red emergency alert to matching donors
      const donors = db.prepare(`
        SELECT u.id FROM donors d
        JOIN users u ON d.user_id = u.id
        WHERE d.blood_group = ? AND d.is_available = 1 AND u.status = 'active'
      `).all(bloodReq.blood_group) as { id: number }[];

      for (const d of donors) {
        db.prepare(`
          INSERT INTO notifications (user_id, title, message, type)
          VALUES (?, '🚨 অতি-জরুরি রক্তের রেড অ্যালার্ট!', ?, 'emergency')
        `).run(d.id, `${bloodReq.patient_name} এর জন্য জরুরি ${bloodReq.blood_group} রক্ত প্রয়োজন (${bloodReq.hospital_name})। দ্রুত যোগাযোগ করুন: ${bloodReq.contact_number}`);
      }

      logAudit(req.user!.id, 'TRIGGER_EMERGENCY_SIREN', 'request', reqId, { donorsAlerted: donors.length }, req.ip);

      return res.json({
        success: true,
        message: `জরুরি রেড সাইরেন পুশ সফল! ${donors.length} জন ${bloodReq.blood_group} রক্তদাতাকে তাৎক্ষণিক নোটিফিকেশন পাঠানো হয়েছে।`,
      });
    }

    if (action === 'status_update' && new_status) {
      db.prepare("UPDATE blood_requests SET status = ?, updated_at = datetime('now') WHERE id = ?").run(new_status, reqId);
      logAudit(req.user!.id, 'UPDATE_REQUEST_STATUS', 'request', reqId, { new_status }, req.ip);
      return res.json({ success: true, message: `স্ট্যাটাস '${new_status}' করা হয়েছে।` });
    }

    if (action === 'delete') {
      db.prepare('DELETE FROM blood_requests WHERE id = ?').run(reqId);
      logAudit(req.user!.id, 'DELETE_REQUEST', 'request', reqId, null, req.ip);
      return res.json({ success: true, message: 'রক্তের অনুরোধ ডাটাবেস থেকে মুছে ফেলা হয়েছে।' });
    }

    return res.status(400).json({ success: false, message: 'অবৈধ অনুরোধ।' });
  } catch (err: any) {
    console.error('[ADMIN] Request action error:', err);
    return res.status(500).json({ success: false, message: 'অ্যাকশন সম্পন্ন করতে সমস্যা হয়েছে।' });
  }
});

// 7. Hospitals & Blood Stocks Management
router.get('/hospitals', (req, res) => {
  try {
    const hospitals = db.prepare('SELECT * FROM hospitals ORDER BY id ASC').all();
    return res.json({ success: true, data: hospitals });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'হাসপাতাল তালিকা লোড ব্যর্থ হয়েছে।' });
  }
});

router.post('/hospitals', (req: AuthenticatedRequest, res) => {
  try {
    const { name, address, district, upazila, phone, emergency_contact, has_blood_bank = 1 } = req.body;
    if (!name || !district || !phone) {
      return res.status(400).json({ success: false, message: 'হাসপাতালের নাম, জেলা ও ফোন আবশ্যক।' });
    }

    const ins = db.prepare(`
      INSERT INTO hospitals (name, address, district, upazila, phone, emergency_contact, has_blood_bank)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(name.trim(), address || null, district, upazila || null, phone.trim(), emergency_contact || null, has_blood_bank ? 1 : 0);

    const hospitalId = Number(ins.lastInsertRowid);

    // Initialize 8 blood groups stocks
    const groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    for (const bg of groups) {
      db.prepare(`
        INSERT OR IGNORE INTO blood_stocks (hospital_id, blood_group, units_available, updated_at)
        VALUES (?, ?, 0, datetime('now'))
      `).run(hospitalId, bg);
    }

    logAudit(req.user!.id, 'CREATE_HOSPITAL', 'hospital', hospitalId, { name }, req.ip);

    return res.status(201).json({ success: true, message: 'নতুন হাসপাতাল/ব্লাড ব্যাংক সফলভাবে যুক্ত হয়েছে।' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'হাসপাতাল যুক্ত করতে সমস্যা হয়েছে।' });
  }
});

router.put('/hospitals/:id/stocks', (req: AuthenticatedRequest, res) => {
  try {
    const hospitalId = Number(req.params.id);
    const { stocks } = req.body; // e.g. { 'A+': 12, 'O+': 20, ... }

    if (!stocks || typeof stocks !== 'object') {
      return res.status(400).json({ success: false, message: 'স্টক ডাটা সঠিক নয়।' });
    }

    for (const [bg, units] of Object.entries(stocks)) {
      db.prepare(`
        INSERT INTO blood_stocks (hospital_id, blood_group, units_available, updated_at)
        VALUES (?, ?, ?, datetime('now'))
        ON CONFLICT(hospital_id, blood_group) DO UPDATE SET
          units_available = ?,
          updated_at = datetime('now')
      `).run(hospitalId, bg, Number(units) || 0, Number(units) || 0);
    }

    logAudit(req.user!.id, 'UPDATE_BLOOD_STOCK', 'hospital', hospitalId, { stocks }, req.ip);

    return res.json({ success: true, message: 'হাসপাতালের রক্তের মজুত/স্টক সফলভাবে হালনাগাদ করা হয়েছে।' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'স্টক আপডেট ব্যর্থ হয়েছে।' });
  }
});

router.delete('/hospitals/:id', requireSuperAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const hospitalId = Number(req.params.id);
    db.prepare('DELETE FROM hospitals WHERE id = ?').run(hospitalId);
    db.prepare('DELETE FROM blood_stocks WHERE hospital_id = ?').run(hospitalId);
    logAudit(req.user!.id, 'DELETE_HOSPITAL', 'hospital', hospitalId, null, req.ip);
    return res.json({ success: true, message: 'হাসপাতাল মুছে ফেলা হয়েছে।' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'মুছে ফেলা ব্যর্থ হয়েছে।' });
  }
});

// 8. Reports & Complaints Handling
router.get('/reports', (req, res) => {
  try {
    const reports = db.prepare(`
      SELECT r.*, u.name as reporter_name, u.phone as reporter_phone
      FROM reports r
      LEFT JOIN users u ON r.reporter_id = u.id
      ORDER BY r.id DESC
      LIMIT 100
    `).all();
    return res.json({ success: true, data: reports });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'রিপোর্ট তালিকা লোড ব্যর্থ হয়েছে।' });
  }
});

router.post('/reports/:id/strict-action', (req: AuthenticatedRequest, res) => {
  try {
    const reportId = Number(req.params.id);
    const { action, admin_notes = '' } = req.body;
    // action: 'resolve', 'dismiss', 'ban_target'

    const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(reportId) as any;
    if (!report) {
      return res.status(404).json({ success: false, message: 'রিপোর্ট খুঁজে পাওয়া যায়নি।' });
    }

    if (action === 'ban_target') {
      if (report.reported_type === 'donor' || report.reported_type === 'user') {
        const userRow = report.reported_type === 'donor'
          ? db.prepare('SELECT user_id, phone FROM donors d JOIN users u ON d.user_id = u.id WHERE d.id = ?').get(report.reported_id) as any
          : db.prepare('SELECT id as user_id, phone FROM users WHERE id = ?').get(report.reported_id) as any;

        if (userRow) {
          db.prepare("UPDATE users SET status = 'suspended' WHERE id = ?").run(userRow.user_id);
          db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userRow.user_id);
          db.prepare(`
            INSERT INTO blacklist_records (phone, user_id, reason, admin_id, banned_at, is_active)
            VALUES (?, ?, ?, ?, datetime('now'), 1)
          `).run(userRow.phone, userRow.user_id, `রিপোর্টের ভিত্তিতে ব্যান: ${report.reason}`, req.user!.id);
        }
      }
      db.prepare("UPDATE reports SET status = 'resolved', admin_notes = ?, updated_at = datetime('now') WHERE id = ?")
        .run(`অভিযুক্তকে ব্যান করা হয়েছে। ${admin_notes}`, reportId);

      logAudit(req.user!.id, 'REPORT_STRICT_BAN', 'report', reportId, { reported_type: report.reported_type, target_id: report.reported_id }, req.ip);
      return res.json({ success: true, message: 'অভিযুক্তের বিরুদ্ধে কঠোর ব্যবস্থা হিসেবে অ্যাকাউন্ট ব্যান করা হয়েছে।' });
    }

    if (action === 'resolve') {
      db.prepare("UPDATE reports SET status = 'resolved', admin_notes = ?, updated_at = datetime('now') WHERE id = ?")
        .run(admin_notes || 'সমাধান করা হয়েছে', reportId);
      logAudit(req.user!.id, 'RESOLVE_REPORT', 'report', reportId, { admin_notes }, req.ip);
      return res.json({ success: true, message: 'রিপোর্টটি সমাধানকৃত হিসেবে চিহ্নিত হয়েছে।' });
    }

    if (action === 'dismiss') {
      db.prepare("UPDATE reports SET status = 'dismissed', admin_notes = ?, updated_at = datetime('now') WHERE id = ?")
        .run(admin_notes || 'বাতিল করা হয়েছে', reportId);
      logAudit(req.user!.id, 'DISMISS_REPORT', 'report', reportId, { admin_notes }, req.ip);
      return res.json({ success: true, message: 'রিপোর্টটি খারিজ করা হয়েছে।' });
    }

    return res.status(400).json({ success: false, message: 'অবৈধ অ্যাকশন।' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'রিপোর্ট নিষ্পত্তি ব্যর্থ হয়েছে।' });
  }
});

// 9. System Emergency Controls & Site Banner Config
router.get('/system-config', (req, res) => {
  try {
    const rows = db.prepare('SELECT key, value FROM admin_system_config').all() as Array<{ key: string; value: string }>;
    const config: Record<string, string> = {};
    rows.forEach((r) => {
      config[r.key] = r.value;
    });

    return res.json({
      success: true,
      data: {
        emergency_broadcast_active: config.emergency_broadcast_active === '1',
        emergency_broadcast_message: config.emergency_broadcast_message || '',
        emergency_broadcast_level: config.emergency_broadcast_level || 'critical',
        maintenance_mode: config.maintenance_mode === '1',
        first_setup_completed: config.first_setup_completed === '1',
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'কনফিগারেশন লোড ব্যর্থ হয়েছে।' });
  }
});

router.put('/system-config', (req: AuthenticatedRequest, res) => {
  try {
    const { emergency_broadcast_active, emergency_broadcast_message, emergency_broadcast_level, maintenance_mode } = req.body;

    const upsert = db.prepare(`
      INSERT INTO admin_system_config (key, value, updated_at)
      VALUES (?, ?, datetime('now'))
      ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = datetime('now')
    `);

    if (emergency_broadcast_active !== undefined) {
      const val = emergency_broadcast_active ? '1' : '0';
      upsert.run('emergency_broadcast_active', val, val);
    }
    if (emergency_broadcast_message !== undefined) {
      upsert.run('emergency_broadcast_message', String(emergency_broadcast_message), String(emergency_broadcast_message));
    }
    if (emergency_broadcast_level !== undefined) {
      upsert.run('emergency_broadcast_level', String(emergency_broadcast_level), String(emergency_broadcast_level));
    }
    if (maintenance_mode !== undefined) {
      const mVal = maintenance_mode ? '1' : '0';
      upsert.run('maintenance_mode', mVal, mVal);
    }

    logAudit(req.user!.id, 'UPDATE_SYSTEM_CONFIG', 'system_config', 0, req.body, req.ip);

    return res.json({ success: true, message: 'সিস্টেম কনফিগারেশন ও সাইট-ওয়াইড অ্যালার্ট আপডেট করা হয়েছে।' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'কনফিগারেশন আপডেট ব্যর্থ হয়েছে।' });
  }
});

// 10. Complete System Data Snapshot Export (এডমিন পোর্টালে সকল তথ্য সংরক্ষিত থাকবে)
router.get('/export-backup', (req: AuthenticatedRequest, res) => {
  try {
    const donors = db.prepare('SELECT d.*, u.name, u.phone, u.status FROM donors d JOIN users u ON d.user_id = u.id').all();
    const requests = db.prepare('SELECT * FROM blood_requests').all();
    const hospitals = db.prepare('SELECT * FROM hospitals').all();
    const stocks = db.prepare('SELECT * FROM blood_stocks').all();
    const reports = db.prepare('SELECT * FROM reports').all();
    const auditLogs = db.prepare('SELECT * FROM audit_logs ORDER BY id DESC LIMIT 200').all();
    const blacklists = db.prepare('SELECT * FROM blacklist_records').all();
    const configs = db.prepare('SELECT * FROM admin_system_config').all();

    logAudit(req.user!.id, 'EXPORT_SYSTEM_DATA_BACKUP', 'system', 0, {}, req.ip);

    return res.json({
      success: true,
      data: {
        exported_at: new Date().toISOString(),
        system_name: 'barishal-Blood Administration Engine',
        totals: {
          donors: donors.length,
          requests: requests.length,
          hospitals: hospitals.length,
          reports: reports.length,
          blacklisted: blacklists.length,
        },
        donors,
        requests,
        hospitals,
        stocks,
        reports,
        blacklists,
        configs,
        auditLogs,
      },
    });
  } catch (err: any) {
    console.error('[ADMIN] Export backup error:', err);
    return res.status(500).json({ success: false, message: 'ডাটা এক্সপোর্ট করতে সমস্যা হয়েছে।' });
  }
});

export default router;
