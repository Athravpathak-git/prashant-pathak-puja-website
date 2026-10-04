import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { sanitizeString } from '@/lib/security';
import { logAudit } from '@/lib/audit';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const idOrSlug = params.id;
    const isNumeric = /^\d+$/.test(idOrSlug);

    const sql = `
      SELECT s.*, c.name_mr AS category_name_mr, c.name_en AS category_name_en, c.slug AS category_slug
      FROM services s
      LEFT JOIN service_categories c ON s.category_id = c.id
      WHERE ${isNumeric ? 's.id = $1' : 's.slug = $1'}
    `;

    const res = await query(sql, [isNumeric ? Number(idOrSlug) : idOrSlug]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'पूजा विधी सापडला नाही. / Service not found.' }, { status: 404 });
    }

    return NextResponse.json({ service: res.rows[0] });
  } catch (err: any) {
    console.error('[SERVICE-GET-ID]', err);
    return NextResponse.json({ error: 'त्रुटी आली. / Internal error.' }, { status: 500 });
  }
}

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
    const short_desc_mr = sanitizeString(body.short_desc_mr || '');
    const short_desc_en = sanitizeString(body.short_desc_en || '');
    const detailed_desc_mr = sanitizeString(body.detailed_desc_mr || '');
    const detailed_desc_en = sanitizeString(body.detailed_desc_en || '');
    const category_id = body.category_id ? Number(body.category_id) : null;
    const duration = sanitizeString(body.duration || '');
    const price = body.price ? Number(body.price) : null;
    const price_label_mr = sanitizeString(body.price_label_mr || 'शुल्कासाठी संपर्क करा');
    const price_label_en = sanitizeString(body.price_label_en || 'Contact for Dakshina / Fee');
    const materials_mr = sanitizeString(body.materials_mr || '');
    const materials_en = sanitizeString(body.materials_en || '');
    const procedure_mr = sanitizeString(body.procedure_mr || '');
    const procedure_en = sanitizeString(body.procedure_en || '');
    const image_url = sanitizeString(body.image_url || '');
    const is_featured = Boolean(body.is_featured);
    const is_active = Boolean(body.is_active);
    const enable_booking = Boolean(body.enable_booking);
    const enable_enquiry = Boolean(body.enable_enquiry);
    const sort_order = body.sort_order ? Number(body.sort_order) : 0;
    const seo_title = sanitizeString(body.seo_title || '');
    const meta_desc = sanitizeString(body.meta_desc || '');

    const res = await query(`
      UPDATE services SET
        name_mr = $1, name_en = $2, slug = $3,
        short_desc_mr = $4, short_desc_en = $5,
        detailed_desc_mr = $6, detailed_desc_en = $7,
        category_id = $8, duration = $9, price = $10,
        price_label_mr = $11, price_label_en = $12,
        materials_mr = $13, materials_en = $14,
        procedure_mr = $15, procedure_en = $16,
        image_url = $17, is_featured = $18, is_active = $19,
        enable_booking = $20, enable_enquiry = $21,
        sort_order = $22, seo_title = $23, meta_desc = $24,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $25
      RETURNING *
    `, [
      name_mr, name_en, slug,
      short_desc_mr, short_desc_en,
      detailed_desc_mr, detailed_desc_en,
      category_id, duration, price,
      price_label_mr, price_label_en,
      materials_mr, materials_en,
      procedure_mr, procedure_en,
      image_url, is_featured, is_active,
      enable_booking, enable_enquiry,
      sort_order, seo_title, meta_desc,
      id
    ]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'पूजा सापडली नाही. / Service not found.' }, { status: 404 });
    }

    await logAudit('UPDATE_SERVICE', 'services', id, { name_mr, name_en }, req, auth.admin);

    return NextResponse.json({ success: true, service: res.rows[0] });
  } catch (err: any) {
    console.error('[SERVICE-PUT]', err);
    return NextResponse.json({ error: 'पूजा माहिती अद्यतनित करताना त्रुटी आली. / Internal error.' }, { status: 500 });
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
    const res = await query('DELETE FROM services WHERE id = $1 RETURNING id, name_mr', [id]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'पूजा सापडली नाही. / Service not found.' }, { status: 404 });
    }

    await logAudit('DELETE_SERVICE', 'services', id, { deleted: res.rows[0] }, req, auth.admin);

    return NextResponse.json({ success: true, message: 'पूजा यशस्वीरित्या हटवली गेली. / Deleted successfully.' });
  } catch (err: any) {
    console.error('[SERVICE-DELETE]', err);
    return NextResponse.json({ error: 'हटवताना त्रुटी आली. / Internal error.' }, { status: 500 });
  }
}
