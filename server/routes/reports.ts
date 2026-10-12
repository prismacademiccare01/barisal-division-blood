import { Router } from 'express';
import { db } from '../db/database.js';
import { AuthenticatedRequest, requireAuth, requireAdmin, logAudit } from '../middleware/auth.js';

const router = Router();

// POST /api/v1/reports - Submit a report
router.post('/', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const { reported_type, reported_id, reason } = req.body;
    if (!reported_type || !reported_id || !reason) {
      return res.status(400).json({
        success: false,
        message: 'অভিযোগের কারণ এবং সংশ্লিষ্ট তথ্য আবশ্যক',
      });
    }

    const result = db.prepare(`
      INSERT INTO reports (reporter_id, reported_type, reported_id, reason, status)
      VALUES (?, ?, ?, ?, 'pending')
    `).run(req.user!.id, reported_type, Number(reported_id), reason.trim());

    logAudit(req.user!.id, 'SUBMIT_REPORT', reported_type, Number(reported_id), { reason }, req.ip);

    return res.status(201).json({
      success: true,
      message: 'আপনার রিপোর্টটি সফলভাবে গ্রহণ করা হয়েছে। অ্যাডমিন টিম এটি পর্যালোচনা করবে।',
      data: { id: result.lastInsertRowid },
    });
  } catch (err: any) {
    console.error('[REPORTS] Error:', err);
    return res.status(500).json({
      success: false,
      message: 'রিপোর্ট পাঠাতে সমস্যা হয়েছে।',
    });
  }
});

// GET /api/v1/reports - Admin view reports
router.get('/', requireAdmin, (req, res) => {
  try {
    const reports = db.prepare(`
      SELECT r.*, u.name as reporter_name, u.phone as reporter_phone
      FROM reports r
      LEFT JOIN users u ON r.reporter_id = u.id
      ORDER BY
        CASE r.status WHEN 'pending' THEN 1 ELSE 2 END ASC,
        r.created_at DESC
    `).all();

    return res.json({
      success: true,
      data: reports,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'রিপোর্ট তালিকা লোড করতে সমস্যা হয়েছে।',
    });
  }
});

// PUT /api/v1/reports/:id/status - Admin resolve/dismiss report
router.put('/:id/status', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const id = Number(req.params.id);
    const { status, admin_notes } = req.body;

    db.prepare(`
      UPDATE reports
      SET status = ?, admin_notes = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(status, admin_notes || null, id);

    logAudit(req.user!.id, 'UPDATE_REPORT_STATUS', 'report', id, { status, admin_notes }, req.ip);

    return res.json({
      success: true,
      message: 'রিপোর্টের স্ট্যাটাস আপডেট করা হয়েছে।',
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'আপডেট ব্যর্থ হয়েছে।',
    });
  }
});

export default router;
