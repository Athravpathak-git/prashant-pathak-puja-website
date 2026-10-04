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

    const question_mr = sanitizeString(body.question_mr);
    const question_en = sanitizeString(body.question_en);
    const answer_mr = sanitizeString(body.answer_mr);
    const answer_en = sanitizeString(body.answer_en);
    const category = sanitizeString(body.category || 'सामान्य');
    const sort_order = Number(body.sort_order || 0);
    const is_published = Boolean(body.is_published);

    const res = await query(`
      UPDATE faqs SET
        question_mr = $1, question_en = $2, answer_mr = $3, answer_en = $4,
        category = $5, sort_order = $6, is_published = $7, updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `, [question_mr, question_en, answer_mr, answer_en, category, sort_order, is_published, id]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'प्रश्न सापडला नाही. / Not found.' }, { status: 404 });
    }

    await logAudit('UPDATE_FAQ', 'faqs', id, { question_mr }, req, auth.admin);

    return NextResponse.json({ success: true, faq: res.rows[0] });
  } catch (err: any) {
    console.error('[FAQ-PUT]', err);
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
    const res = await query('DELETE FROM faqs WHERE id = $1 RETURNING id, question_mr', [id]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'प्रश्न सापडला नाही. / Not found.' }, { status: 404 });
    }

    await logAudit('DELETE_FAQ', 'faqs', id, { deleted: res.rows[0] }, req, auth.admin);

    return NextResponse.json({ success: true, message: 'प्रश्न हटवला गेला. / Deleted successfully.' });
  } catch (err: any) {
    console.error('[FAQ-DELETE]', err);
    return NextResponse.json({ error: 'हटवताना त्रुटी. / Internal error.' }, { status: 500 });
  }
}
