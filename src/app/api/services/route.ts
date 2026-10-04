import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { sanitizeString } from '@/lib/security';
import { logAudit } from '@/lib/audit';

// Public & Admin list services
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const all = searchParams.get('all'); // If true, include inactive (admin only)

    let sql = `
      SELECT s.*, c.name_mr AS category_name_mr, c.name_en AS category_name_en, c.slug AS category_slug
      FROM services s
      LEFT JOIN service_categories c ON s.category_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (all !== 'true') {
      sql += ' AND s.is_active = TRUE';
    }

    if (category) {
      params.push(category);
      sql += ` AND (c.slug = $${params.length} OR s.category_id::text = $${params.length})`;
    }

    if (featured === 'true') {
      sql += ' AND s.is_featured = TRUE';
    }

    sql += ' ORDER BY s.sort_order ASC, s.id ASC';

    const res = await query(sql, params);
    return NextResponse.json({ services: res.rows });
  } catch (err: any) {
    console.error('[SERVICES-GET]', err);
    return NextResponse.json({ error: 'पूजा यादी लोड करताना त्रुटी आली. / Internal error.' }, { status: 500 });
  }
}

// Admin Add new puja / service
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const body = await req.json();
    const name_mr = sanitizeString(body.name_mr);
    const name_en = sanitizeString(body.name_en);
    let slug = sanitizeString(body.slug || body.name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    
    if (!slug) {
      slug = `puja-${Date.now()}`;
    }

    if (!name_mr || !name_en) {
      return NextResponse.json(
        { error: 'मराठी व इंग्रजी नाव आवश्यक आहे. / Marathi and English names are required.' },
        { status: 400 }
      );
    }

    const short_desc_mr = sanitizeString(body.short_desc_mr || '');
    const short_desc_en = sanitizeString(body.short_desc_en || '');
    const detailed_desc_mr = sanitizeString(body.detailed_desc_mr || short_desc_mr);
    const detailed_desc_en = sanitizeString(body.detailed_desc_en || short_desc_en);
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
    const is_active = body.is_active !== undefined ? Boolean(body.is_active) : true;
    const enable_booking = body.enable_booking !== undefined ? Boolean(body.enable_booking) : true;
    const enable_enquiry = body.enable_enquiry !== undefined ? Boolean(body.enable_enquiry) : true;
    const sort_order = body.sort_order ? Number(body.sort_order) : 0;
    const seo_title = sanitizeString(body.seo_title || name_en);
    const meta_desc = sanitizeString(body.meta_desc || short_desc_en);

    const res = await query(`
      INSERT INTO services (
        slug, name_mr, name_en, category_id,
        short_desc_mr, short_desc_en, detailed_desc_mr, detailed_desc_en,
        duration, price, price_label_mr, price_label_en,
        materials_mr, materials_en, procedure_mr, procedure_en,
        image_url, is_featured, is_active, enable_booking, enable_enquiry,
        sort_order, seo_title, meta_desc
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24
      ) RETURNING *
    `, [
      slug, name_mr, name_en, category_id,
      short_desc_mr, short_desc_en, detailed_desc_mr, detailed_desc_en,
      duration, price, price_label_mr, price_label_en,
      materials_mr, materials_en, procedure_mr, procedure_en,
      image_url, is_featured, is_active, enable_booking, enable_enquiry,
      sort_order, seo_title, meta_desc,
    ]);

    await logAudit('CREATE_SERVICE', 'services', res.rows[0].id, { name_mr, name_en, slug }, req, auth.admin);

    return NextResponse.json({ success: true, service: res.rows[0] });
  } catch (err: any) {
    console.error('[SERVICES-POST]', err);
    if (err.code === '23505') {
      return NextResponse.json({ error: 'हा Slug किंवा सेवा आधीच अस्तित्वात आहे. / Slug already exists.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'नवीन पूजा जोडताना त्रुटी आली. / Internal error.' }, { status: 500 });
  }
}
