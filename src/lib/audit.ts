import { query } from './db';
import { NextRequest } from 'next/server';
import { AdminPayload } from './auth';

export async function logAudit(
  action: string,
  entity: string,
  entityId: string | number | null,
  details: Record<string, any> = {},
  req?: NextRequest,
  admin?: AdminPayload | null
): Promise<void> {
  try {
    const ip = req
      ? req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
        req.headers.get('x-real-ip') ||
        '127.0.0.1'
      : '127.0.0.1';

    // Ensure sensitive fields are NEVER logged
    const safeDetails = { ...details };
    delete safeDetails.password;
    delete safeDetails.currentPassword;
    delete safeDetails.newPassword;
    delete safeDetails.confirmPassword;
    delete safeDetails.token;
    delete safeDetails.secret;
    delete safeDetails.password_hash;

    await query(`
      INSERT INTO audit_logs (admin_id, admin_username, action, entity, entity_id, details, ip_address)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      admin?.id || null,
      admin?.username || 'system',
      action,
      entity,
      entityId ? String(entityId) : null,
      JSON.stringify(safeDetails),
      ip,
    ]);
  } catch (err) {
    console.error('[AUDIT-LOG-FAIL]', err);
  }
}
