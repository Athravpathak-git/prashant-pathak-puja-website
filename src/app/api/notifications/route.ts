import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const res = await query('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50');
    const unreadCountRes = await query('SELECT COUNT(*) FROM notifications WHERE is_read = FALSE');
    return NextResponse.json({
      notifications: res.rows,
      unreadCount: Number(unreadCountRes.rows[0].count),
    });
  } catch (err: any) {
    console.error('[NOTIFICATIONS-GET]', err);
    return NextResponse.json({ error: 'सूचना लोड करताना त्रुटी.' }, { status: 500 });
  }
}

// Mark all read
export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    await query('UPDATE notifications SET is_read = TRUE');
    return NextResponse.json({ success: true, message: 'सर्व सूचना वाचल्या म्हणून चिन्हांकित केल्या.' });
  } catch (err: any) {
    console.error('[NOTIFICATIONS-PATCH]', err);
    return NextResponse.json({ error: 'अद्यतनित करताना त्रुटी.' }, { status: 500 });
  }
}
