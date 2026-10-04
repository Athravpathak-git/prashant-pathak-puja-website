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

    const res = await query(
      `SELECT * FROM blog_posts WHERE ${isNumeric ? 'id = $1' : 'slug = $1'}`,
      [isNumeric ? Number(idOrSlug) : idOrSlug]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'लेख सापडला नाही. / Post not found.' }, { status: 404 });
    }

    return NextResponse.json({ post: res.rows[0] });
  } catch (err: any) {
    console.error('[BLOG-GET-ID]', err);
    return NextResponse.json({ error: 'त्रुटी. / Internal error.' }, { status: 500 });
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

    const title_mr = sanitizeString(body.title_mr);
    const title_en = sanitizeString(body.title_en);
    const slug = sanitizeString(body.slug);
    const excerpt_mr = sanitizeString(body.excerpt_mr || '');
    const excerpt_en = sanitizeString(body.excerpt_en || '');
    const content_mr = sanitizeString(body.content_mr || '');
    const content_en = sanitizeString(body.content_en || '');
    const featured_image = sanitizeString(body.featured_image || '');
    const category = sanitizeString(body.category || '');
    const is_published = Boolean(body.is_published);

    const res = await query(`
      UPDATE blog_posts SET
        title_mr = $1, title_en = $2, slug = $3,
        excerpt_mr = $4, excerpt_en = $5, content_mr = $6, content_en = $7,
        featured_image = $8, category = $9, is_published = $10, updated_at = CURRENT_TIMESTAMP
      WHERE id = $11
      RETURNING *
    `, [title_mr, title_en, slug, excerpt_mr, excerpt_en, content_mr, content_en, featured_image, category, is_published, id]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'लेख सापडला नाही. / Not found.' }, { status: 404 });
    }

    await logAudit('UPDATE_BLOG_POST', 'blog_posts', id, { title_mr, slug }, req, auth.admin);

    return NextResponse.json({ success: true, post: res.rows[0] });
  } catch (err: any) {
    console.error('[BLOG-PUT]', err);
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
    const res = await query('DELETE FROM blog_posts WHERE id = $1 RETURNING id, title_mr', [id]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'लेख सापडला नाही. / Not found.' }, { status: 404 });
    }

    await logAudit('DELETE_BLOG_POST', 'blog_posts', id, { deleted: res.rows[0] }, req, auth.admin);

    return NextResponse.json({ success: true, message: 'लेख हटवला गेला. / Deleted successfully.' });
  } catch (err: any) {
    console.error('[BLOG-DELETE]', err);
    return NextResponse.json({ error: 'हटवताना त्रुटी. / Internal error.' }, { status: 500 });
  }
}
