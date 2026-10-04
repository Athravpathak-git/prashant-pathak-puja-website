import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { sanitizeString } from '@/lib/security';
import { logAudit } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const all = searchParams.get('all');

    let sql = 'SELECT * FROM gallery WHERE 1=1';
    const params: any[] = [];

    if (all !== 'true') {
      sql += ' AND is_hidden = FALSE';
    }

    if (category && category !== 'all' && category !== 'सर्व') {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }

    if (featured === 'true') {
      sql += ' AND is_featured = TRUE';
    }

    sql += ' ORDER BY sort_order ASC, created_at DESC';

    const res = await query(sql, params);
    return NextResponse.json({ gallery: res.rows });
  } catch (err: any) {
    console.error('[GALLERY-GET]', err);
    return NextResponse.json({ error: 'दालन लोड करताना त्रुटी. / Internal error.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const body = await req.json();
    const title_mr = sanitizeString(body.title_mr || '');
    const title_en = sanitizeString(body.title_en || '');
    const image_url = sanitizeString(body.image_url || '');
    const category = sanitizeString(body.category || 'पूजा');
    const is_featured = Boolean(body.is_featured);
    const is_hidden = Boolean(body.is_hidden);
    const sort_order = Number(body.sort_order || 0);

    if (!image_url) {
      return NextResponse.json({ error: 'प्रतिमा URL आवश्यक आहे. / Image URL required.' }, { status: 400 });
    }

    const res = await query(`
      INSERT INTO gallery (title_mr, title_en, image_url, category, is_featured, is_hidden, sort_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [title_mr, title_en, image_url, category, is_featured, is_hidden, sort_order]);

    await logAudit('ADD_GALLERY_IMAGE', 'gallery', res.rows[0].id, { title_mr, title_en, category }, req, auth.admin);

    return NextResponse.json({ success: true, item: res.rows[0] });
  } catch (err: any) {
    console.error('[GALLERY-POST]', err);
    return NextResponse.json({ error: 'फोटो जोडताना त्रुटी. / Internal error.' }, { status: 500 });
  }
}
