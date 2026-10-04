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

    const author_name_mr = sanitizeString(body.author_name_mr);
    const author_name_en = sanitizeString(body.author_name_en);
    const location_mr = sanitizeString(body.location_mr || '');
    const location_en = sanitizeString(body.location_en || '');
    const rating = Math.min(5, Math.max(1, Number(body.rating) || 5));
    const comment_mr = sanitizeString(body.comment_mr);
    const comment_en = sanitizeString(body.comment_en);
    const is_approved = Boolean(body.is_approved);

    const res = await query(`
      UPDATE testimonials SET
        author_name_mr = $1, author_name_en = $2, location_mr = $3, location_en = $4,
        rating = $5, comment_mr = $6, comment_en = $7, is_approved = $8,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *
    `, [author_name_mr, author_name_en, location_mr, location_en, rating, comment_mr, comment_en, is_approved, id]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'अभिप्राय सापडला नाही. / Not found.' }, { status: 404 });
    }

    await logAudit('UPDATE_TESTIMONIAL', 'testimonials', id, { author: author_name_mr, is_approved }, req, auth.admin);

    return NextResponse.json({ success: true, testimonial: res.rows[0] });
  } catch (err: any) {
    console.error('[TESTIMONIAL-PUT]', err);
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
    const res = await query('DELETE FROM testimonials WHERE id = $1 RETURNING id, author_name_mr', [id]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'अभिप्राय सापडला नाही. / Not found.' }, { status: 404 });
    }

    await logAudit('DELETE_TESTIMONIAL', 'testimonials', id, { deleted: res.rows[0] }, req, auth.admin);

    return NextResponse.json({ success: true, message: 'अभिप्राय हटवला गेला. / Deleted successfully.' });
  } catch (err: any) {
    console.error('[TESTIMONIAL-DELETE]', err);
    return NextResponse.json({ error: 'हटवताना त्रुटी. / Internal error.' }, { status: 500 });
  }
}
