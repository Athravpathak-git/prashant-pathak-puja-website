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
    const youtube_url = sanitizeString(body.youtube_url);
    const description_mr = sanitizeString(body.description_mr || '');
    const description_en = sanitizeString(body.description_en || '');
    const thumbnail_url = sanitizeString(body.thumbnail_url || '');
    const is_published = Boolean(body.is_published);
    const sort_order = Number(body.sort_order || 0);

    const res = await query(`
      UPDATE videos SET
        title_mr = $1, title_en = $2, youtube_url = $3,
        description_mr = $4, description_en = $5, thumbnail_url = $6,
        is_published = $7, sort_order = $8, updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *
    `, [title_mr, title_en, youtube_url, description_mr, description_en, thumbnail_url, is_published, sort_order, id]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'व्हिडीओ सापडला नाही. / Not found.' }, { status: 404 });
    }

    await logAudit('UPDATE_VIDEO', 'videos', id, { title_mr }, req, auth.admin);

    return NextResponse.json({ success: true, video: res.rows[0] });
  } catch (err: any) {
    console.error('[VIDEO-PUT]', err);
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
    const res = await query('DELETE FROM videos WHERE id = $1 RETURNING id, title_mr', [id]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'व्हिडीओ सापडला नाही. / Not found.' }, { status: 404 });
    }

    await logAudit('DELETE_VIDEO', 'videos', id, { deleted: res.rows[0] }, req, auth.admin);

    return NextResponse.json({ success: true, message: 'व्हिडीओ हटवला गेला. / Deleted successfully.' });
  } catch (err: any) {
    console.error('[VIDEO-DELETE]', err);
    return NextResponse.json({ error: 'हटवताना त्रुटी. / Internal error.' }, { status: 500 });
  }
}
