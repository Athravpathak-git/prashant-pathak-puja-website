import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { sanitizeString } from '@/lib/security';
import { logAudit } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all');

    let sql = 'SELECT * FROM videos WHERE 1=1';
    if (all !== 'true') {
      sql += ' AND is_published = TRUE';
    }
    sql += ' ORDER BY sort_order ASC, created_at DESC';

    const res = await query(sql);
    return NextResponse.json({ videos: res.rows });
  } catch (err: any) {
    console.error('[VIDEOS-GET]', err);
    return NextResponse.json({ error: 'व्हिडीओ लोड करताना त्रुटी. / Internal error.' }, { status: 500 });
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
    const youtube_url = sanitizeString(body.youtube_url);
    const description_mr = sanitizeString(body.description_mr || '');
    const description_en = sanitizeString(body.description_en || '');
    const thumbnail_url = sanitizeString(body.thumbnail_url || '');
    const is_published = body.is_published !== undefined ? Boolean(body.is_published) : true;
    const sort_order = Number(body.sort_order || 0);

    if (!title_mr || !youtube_url) {
      return NextResponse.json({ error: 'शीर्षक व YouTube URL आवश्यक आहे.' }, { status: 400 });
    }

    const res = await query(`
      INSERT INTO videos (title_mr, title_en, youtube_url, description_mr, description_en, thumbnail_url, is_published, sort_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [title_mr, title_en || title_mr, youtube_url, description_mr, description_en, thumbnail_url, is_published, sort_order]);

    await logAudit('ADD_VIDEO', 'videos', res.rows[0].id, { title_mr, youtube_url }, req, auth.admin);

    return NextResponse.json({ success: true, video: res.rows[0] });
  } catch (err: any) {
    console.error('[VIDEOS-POST]', err);
    return NextResponse.json({ error: 'व्हिडीओ जोडताना त्रुटी. / Internal error.' }, { status: 500 });
  }
}
