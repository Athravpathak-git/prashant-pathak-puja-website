import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { sanitizeString } from '@/lib/security';
import { logAudit } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all');

    let sql = 'SELECT * FROM blog_posts WHERE 1=1';
    if (all !== 'true') {
      sql += ' AND is_published = TRUE';
    }
    sql += ' ORDER BY published_at DESC, id DESC';

    const res = await query(sql);
    return NextResponse.json({ posts: res.rows });
  } catch (err: any) {
    console.error('[BLOG-GET]', err);
    return NextResponse.json({ error: 'लेख लोड करताना त्रुटी. / Internal error.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const body = await req.json();
    const title_mr = sanitizeString(body.title_mr);
    const title_en = sanitizeString(body.title_en);
    let slug = sanitizeString(body.slug || body.title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    if (!slug) slug = `post-${Date.now()}`;

    const excerpt_mr = sanitizeString(body.excerpt_mr || '');
    const excerpt_en = sanitizeString(body.excerpt_en || '');
    const content_mr = sanitizeString(body.content_mr || '');
    const content_en = sanitizeString(body.content_en || '');
    const featured_image = sanitizeString(body.featured_image || '');
    const category = sanitizeString(body.category || 'धार्मिक माहिती');
    const is_published = body.is_published !== undefined ? Boolean(body.is_published) : true;

    if (!title_mr || !title_en) {
      return NextResponse.json({ error: 'शीर्षक आवश्यक आहे. / Title required.' }, { status: 400 });
    }

    const res = await query(`
      INSERT INTO blog_posts (slug, title_mr, title_en, excerpt_mr, excerpt_en, content_mr, content_en, featured_image, category, is_published)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [slug, title_mr, title_en, excerpt_mr, excerpt_en, content_mr, content_en, featured_image, category, is_published]);

    await logAudit('CREATE_BLOG_POST', 'blog_posts', res.rows[0].id, { title_mr, slug }, req, auth.admin);

    return NextResponse.json({ success: true, post: res.rows[0] });
  } catch (err: any) {
    console.error('[BLOG-POST]', err);
    if (err.code === '23505') {
      return NextResponse.json({ error: 'हा Slug आधीच अस्तित्वात आहे. / Slug already exists.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'लेख जोडताना त्रुटी. / Internal error.' }, { status: 500 });
  }
}
