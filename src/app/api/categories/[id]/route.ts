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

    const name_mr = sanitizeString(body.name_mr);
    const name_en = sanitizeString(body.name_en);
    const slug = sanitizeString(body.slug);
    const sort_order = Number(body.sort_order || 0);
    const is_active = Boolean(body.is_active);

    const res = await query(`
      UPDATE service_categories SET
        name_mr = $1, name_en = $2, slug = $3, sort_order = $4, is_active = $5
      WHERE id = $6
      RETURNING *
    `, [name_mr, name_en, slug, sort_order, is_active, id]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'वर्गवारी सापडली नाही. / Not found.' }, { status: 404 });
    }

    await logAudit('UPDATE_CATEGORY', 'service_categories', id, { name_mr, name_en }, req, auth.admin);

    return NextResponse.json({ success: true, category: res.rows[0] });
  } catch (err: any) {
    console.error('[CATEGORY-PUT]', err);
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
    const res = await query('DELETE FROM service_categories WHERE id = $1 RETURNING id, name_mr', [id]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'वर्गवारी सापडली नाही. / Not found.' }, { status: 404 });
    }

    await logAudit('DELETE_CATEGORY', 'service_categories', id, { deleted: res.rows[0] }, req, auth.admin);

    return NextResponse.json({ success: true, message: 'वर्गवारी हटवली गेली. / Deleted successfully.' });
  } catch (err: any) {
    console.error('[CATEGORY-DELETE]', err);
    return NextResponse.json({ error: 'हटवताना त्रुटी. / Internal error.' }, { status: 500 });
  }
}
