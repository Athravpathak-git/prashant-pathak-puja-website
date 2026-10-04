import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(req);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const id = Number(params.id);
    await query('UPDATE notifications SET is_read = TRUE WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[NOTIF-PATCH-ID]', err);
    return NextResponse.json({ error: 'त्रुटी.' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(req);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const id = Number(params.id);
    await query('DELETE FROM notifications WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[NOTIF-DELETE-ID]', err);
    return NextResponse.json({ error: 'हटवताना त्रुटी.' }, { status: 500 });
  }
}
