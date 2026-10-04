import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(100, Math.max(10, Number(searchParams.get('limit') || 50)));

    const res = await query(`
      SELECT id, admin_id, admin_username, action, entity, entity_id, details, ip_address, created_at
      FROM audit_logs
      ORDER BY created_at DESC
      LIMIT $1
    `, [limit]);

    return NextResponse.json({ logs: res.rows });
  } catch (err: any) {
    console.error('[AUDIT-GET]', err);
    return NextResponse.json({ error: 'ऑडिट लॉग लोड करताना त्रुटी.' }, { status: 500 });
  }
}
