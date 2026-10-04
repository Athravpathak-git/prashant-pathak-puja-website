import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { sanitizeString } from '@/lib/security';
import { logAudit } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all');

    let sql = 'SELECT * FROM events WHERE 1=1';
    if (all !== 'true') {
      sql += ' AND is_published = TRUE';
    }
    sql += ' ORDER BY event_date ASC, sort_order ASC';

    const res = await query(sql);
    return NextResponse.json({ events: res.rows });
  } catch (err: any) {
    console.error('[EVENTS-GET]', err);
    return NextResponse.json({ error: 'कार्यक्रम लोड करताना त्रुटी. / Internal error.' }, { status: 500 });
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
    const description_mr = sanitizeString(body.description_mr || '');
    const description_en = sanitizeString(body.description_en || '');
    const event_date = sanitizeString(body.event_date);
    const event_time = sanitizeString(body.event_time || '');
    const location = sanitizeString(body.location || 'नागपूर (Nagpur)');
    const image_url = sanitizeString(body.image_url || '');
    const is_published = body.is_published !== undefined ? Boolean(body.is_published) : true;
    const sort_order = Number(body.sort_order || 0);

    if (!title_mr || !title_en || !event_date) {
      return NextResponse.json({ error: 'शीर्षक व तारीख आवश्यक आहे. / Title and date are required.' }, { status: 400 });
    }

    const res = await query(`
      INSERT INTO events (title_mr, title_en, description_mr, description_en, event_date, event_time, location, image_url, is_published, sort_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [title_mr, title_en, description_mr, description_en, event_date, event_time, location, image_url, is_published, sort_order]);

    await logAudit('CREATE_EVENT', 'events', res.rows[0].id, { title_mr, title_en, event_date }, req, auth.admin);

    return NextResponse.json({ success: true, event: res.rows[0] });
  } catch (err: any) {
    console.error('[EVENTS-POST]', err);
    return NextResponse.json({ error: 'कार्यक्रम जोडताना त्रुटी. / Internal error.' }, { status: 500 });
  }
}
