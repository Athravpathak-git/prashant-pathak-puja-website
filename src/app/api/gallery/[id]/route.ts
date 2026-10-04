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

    const title_mr = sanitizeString(body.title_mr || '');
    const title_en = sanitizeString(body.title_en || '');
    const image_url = sanitizeString(body.image_url || '');
    const category = sanitizeString(body.category || 'पूजा');
    const is_featured = Boolean(body.is_featured);
    const is_hidden = Boolean(body.is_hidden);
    const sort_order = Number(body.sort_order || 0);

    const res = await query(`
      UPDATE gallery SET
        title_mr = $1, title_en = $2, image_url = $3,
        category = $4, is_featured = $5, is_hidden = $6,
        sort_order = $7, updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `, [title_mr, title_en, image_url, category, is_featured, is_hidden, sort_order, id]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'फोटो सापडला नाही. / Not found.' }, { status: 404 });
    }

    await logAudit('UPDATE_GALLERY_IMAGE', 'gallery', id, { title_mr, title_en }, req, auth.admin);

    return NextResponse.json({ success: true, item: res.rows[0] });
  } catch (err: any) {
    console.error('[GALLERY-PUT]', err);
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
    const res = await query('DELETE FROM gallery WHERE id = $1 RETURNING id, title_mr, image_url', [id]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'फोटो सापडला नाही. / Not found.' }, { status: 404 });
    }

    await logAudit('DELETE_GALLERY_IMAGE', 'gallery', id, { deleted: res.rows[0] }, req, auth.admin);

    return NextResponse.json({ success: true, message: 'फोटो हटवला गेला. / Deleted successfully.' });
  } catch (err: any) {
    console.error('[GALLERY-DELETE]', err);
    return NextResponse.json({ error: 'हटवताना त्रुटी. / Internal error.' }, { status: 500 });
  }
}
