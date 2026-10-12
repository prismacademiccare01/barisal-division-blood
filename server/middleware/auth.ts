import { Request, Response, NextFunction } from 'express';
import { db } from '../db/database.js';

export interface AuthenticatedUser {
  id: number;
  phone: string;
  name: string;
  role: string;
  status: string;
  avatar?: string;
  donor_id?: number;
  blood_group?: string;
  admin_level?: string;
  admin_permissions?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
  sessionToken?: string;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : (req.cookies?.session_token || null);

  if (!token) {
    return next();
  }

  try {
    const sessionRow = db.prepare(`
      SELECT s.token, s.expires_at, u.id, u.phone, u.name, u.role, u.status, u.avatar,
             d.id as donor_id, d.blood_group,
             a.level as admin_level, a.permissions as admin_permissions
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN donors d ON d.user_id = u.id
      LEFT JOIN admins a ON a.user_id = u.id
      WHERE s.token = ? AND datetime(s.expires_at) > datetime('now')
    `).get(token) as any;

    if (sessionRow && sessionRow.status === 'active') {
      req.user = {
        id: sessionRow.id,
        phone: sessionRow.phone,
        name: sessionRow.name,
        role: sessionRow.role,
        status: sessionRow.status,
        avatar: sessionRow.avatar,
        donor_id: sessionRow.donor_id,
        blood_group: sessionRow.blood_group,
        admin_level: sessionRow.admin_level,
        admin_permissions: sessionRow.admin_permissions,
      };
      req.sessionToken = token;
    }
  } catch (err) {
    console.error('[AUTH] Session verification error:', err);
  }

  next();
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'অনুগ্রহ করে প্রথমে লগইন করুন (Authentication required)',
    });
  }
  next();
}

export function requireRole(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'লগইন আবশ্যক',
      });
    }

    if (!allowedRoles.includes(req.user.role) && req.user.role !== 'super_admin' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'এই অ্যাকশনের জন্য পর্যাপ্ত অনুমতি নেই (Forbidden)',
      });
    }

    next();
  };
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'super_admin')) {
    return res.status(403).json({
      success: false,
      message: 'শুধুমাত্র অ্যাডমিনদের জন্য উন্মুক্ত (Admin access required)',
    });
  }
  next();
}

export function requireSuperAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'শুধুমাত্র সুপার অ্যাডমিনের জন্য অনুমোদিত (Super Admin access required)',
    });
  }
  next();
}

export function logAudit(userId: number | null, action: string, targetType?: string, targetId?: number, details?: any, ip?: string) {
  try {
    db.prepare(`
      INSERT INTO audit_logs (user_id, action, target_type, target_id, details_json, ip)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      action,
      targetType || null,
      targetId || null,
      details ? JSON.stringify(details) : null,
      ip || null
    );
  } catch (err) {
    console.error('[AUDIT] Failed to record audit log:', err);
  }
}
