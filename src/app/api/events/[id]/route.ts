import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { sanitizeString } from '@/lib/security';
import { logAudit } from '@/lib/audit';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(req);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const id = Number(params.id);
    const body = await req.json();

    const title_mr = sanitizeString(body.title_mr);
    const title_en = sanitizeString(body.title_en);
    const description_mr = sanitizeString(body.description_mr || '');
    const description_en = sanitizeString(body.description_en || '');
    const event_date = sanitizeString(body.event_date);
    const event_time = sanitizeString(body.event_time || '');
    const location = sanitizeString(body.location || '');
    const image_url = sanitizeString(body.image_url || '');
    const is_published = Boolean(body.is_published);
    const sort_order = Number(body.sort_order || 0);

    const res = await query(`
      UPDATE events SET
        title_mr = $1, title_en = $2, description_mr = $3, description_en = $4,
        event_date = $5, event_time = $6, location = $7, image_url = $8,
        is_published = $9, sort_order = $10, updated_at = CURRENT_TIMESTAMP
      WHERE id = $11
      RETURNING *
    `, [title_mr, title_en, description_mr, description_en, event_date, event_time, location, image_url, is_published, sort_order, id]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'कार्यक्रम सापडला नाही. / Not found.' }, { status: 404 });
    }

    await logAudit('UPDATE_EVENT', 'events', id, { title_mr, title_en }, req, auth.admin);

    return NextResponse.json({ success: true, event: res.rows[0] });
  } catch (err: any) {
    console.error('[EVENT-PUT]', err);
    return NextResponse.json({ error: 'अद्यतनित करताना त्रुटी. / Internal error.' }, { status: 500 });
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
    const res = await query('DELETE FROM events WHERE id = $1 RETURNING id, title_mr', [id]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'कार्यक्रम सापडला नाही. / Not found.' }, { status: 404 });
    }

    await logAudit('DELETE_EVENT', 'events', id, { deleted: res.rows[0] }, req, auth.admin);

    return NextResponse.json({ success: true, message: 'कार्यक्रम हटवला गेला. / Deleted successfully.' });
  } catch (err: any) {
    console.error('[EVENT-DELETE]', err);
    return NextResponse.json({ error: 'हटवताना त्रुटी. / Internal error.' }, { status: 500 });
  }
}
