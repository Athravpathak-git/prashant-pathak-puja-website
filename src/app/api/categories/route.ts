import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { sanitizeString } from '@/lib/security';
import { logAudit } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const res = await query('SELECT * FROM service_categories ORDER BY sort_order ASC, id ASC');
    return NextResponse.json({ categories: res.rows });
  } catch (err: any) {
    console.error('[CATEGORIES-GET]', err);
    return NextResponse.json({ error: 'वर्गवारी लोड करताना त्रुटी. / Internal error.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const body = await req.json();
    const name_mr = sanitizeString(body.name_mr);
    const name_en = sanitizeString(body.name_en);
    let slug = sanitizeString(body.slug || body.name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-'));

    if (!name_mr || !name_en) {
      return NextResponse.json({ error: 'नावे आवश्यक आहेत. / Names required.' }, { status: 400 });
    }

    const sort_order = body.sort_order ? Number(body.sort_order) : 0;
    const is_active = body.is_active !== undefined ? Boolean(body.is_active) : true;

    const res = await query(`
      INSERT INTO service_categories (name_mr, name_en, slug, sort_order, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [name_mr, name_en, slug, sort_order, is_active]);

    await logAudit('CREATE_CATEGORY', 'service_categories', res.rows[0].id, { name_mr, name_en }, req, auth.admin);

    return NextResponse.json({ success: true, category: res.rows[0] });
  } catch (err: any) {
    console.error('[CATEGORIES-POST]', err);
    return NextResponse.json({ error: 'वर्गवारी जोडताना त्रुटी. / Internal error.' }, { status: 500 });
  }
}
