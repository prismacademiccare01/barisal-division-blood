import { Router } from 'express';
import { db } from '../db/database.js';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/v1/notifications - User's notifications
router.get('/', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const notifications = db.prepare(`
      SELECT * FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 50
    `).all(userId);

    const unreadCount = db.prepare(`
      SELECT COUNT(*) as count FROM notifications
      WHERE user_id = ? AND is_read = 0
    `).get(userId) as { count: number };

    return res.json({
      success: true,
      data: {
        notifications,
        unreadCount: unreadCount.count,
      },
    });
  } catch (err: any) {
    console.error('[NOTIF] Fetch error:', err);
    return res.status(500).json({
      success: false,
      message: 'বিজ্ঞপ্তি লোড করতে সমস্যা হয়েছে।',
    });
  }
});

// POST /api/v1/notifications/:id/read - Mark as read
router.post('/:id/read', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const id = Number(req.params.id);
    db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?').run(id, req.user!.id);
    return res.json({ success: true, message: 'পঠিত হিসেবে চিহ্নিত করা হয়েছে।' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'ব্যর্থ হয়েছে।' });
  }
});

// POST /api/v1/notifications/read-all - Mark all as read
router.post('/read-all', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?').run(req.user!.id);
    return res.json({ success: true, message: 'সবগুলো বিজ্ঞপ্তি পঠিত হিসেবে চিহ্নিত করা হয়েছে।' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'ব্যর্থ হয়েছে।' });
  }
});

// POST /api/v1/notifications/subscribe-push - Future-ready push subscription
router.post('/subscribe-push', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const { endpoint, keys } = req.body;
    if (!endpoint) {
      return res.status(400).json({ success: false, message: 'Endpoint required' });
    }

    db.prepare(`
      INSERT INTO push_subscriptions (user_id, endpoint, keys_json)
      VALUES (?, ?, ?)
      ON CONFLICT(endpoint) DO UPDATE SET user_id = excluded.user_id, keys_json = excluded.keys_json
    `).run(req.user!.id, endpoint, JSON.stringify(keys || {}));

    return res.json({ success: true, message: 'Push subscription saved' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to subscribe' });
  }
});

export default router;
