import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { sanitizeString } from '@/lib/security';
import { logAudit } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all');

    let sql = 'SELECT * FROM faqs WHERE 1=1';
    if (all !== 'true') {
      sql += ' AND is_published = TRUE';
    }
    sql += ' ORDER BY sort_order ASC, id ASC';

    const res = await query(sql);
    return NextResponse.json({ faqs: res.rows });
  } catch (err: any) {
    console.error('[FAQS-GET]', err);
    return NextResponse.json({ error: 'प्रश्नोत्तरे लोड करताना त्रुटी. / Internal error.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const body = await req.json();
    const question_mr = sanitizeString(body.question_mr);
    const question_en = sanitizeString(body.question_en || question_mr);
    const answer_mr = sanitizeString(body.answer_mr);
    const answer_en = sanitizeString(body.answer_en || answer_mr);
    const category = sanitizeString(body.category || 'सामान्य');
    const sort_order = Number(body.sort_order || 0);
    const is_published = body.is_published !== undefined ? Boolean(body.is_published) : true;

    if (!question_mr || !answer_mr) {
      return NextResponse.json({ error: 'प्रश्न व उत्तर आवश्यक आहे.' }, { status: 400 });
    }

    const res = await query(`
      INSERT INTO faqs (question_mr, question_en, answer_mr, answer_en, category, sort_order, is_published)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [question_mr, question_en, answer_mr, answer_en, category, sort_order, is_published]);

    await logAudit('CREATE_FAQ', 'faqs', res.rows[0].id, { question_mr }, req, auth.admin);

    return NextResponse.json({ success: true, faq: res.rows[0] });
  } catch (err: any) {
    console.error('[FAQS-POST]', err);
    return NextResponse.json({ error: 'प्रश्न जोडताना त्रुटी. / Internal error.' }, { status: 500 });
  }
}
