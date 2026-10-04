import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { sanitizeString } from '@/lib/security';
import { logAudit } from '@/lib/audit';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const res = await query('SELECT * FROM homepage_sections ORDER BY sort_order ASC, id ASC');
    return NextResponse.json(
      { sections: res.rows },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (err: any) {
    console.error('[HOMEPAGE-GET]', err);
    return NextResponse.json({ error: 'विभाग लोड करताना त्रुटी.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const body = await req.json();
    const { sections } = body;

    if (!Array.isArray(sections)) {
      return NextResponse.json({ error: 'अवैध डेटा फॉरमॅट.' }, { status: 400 });
    }

    for (const sec of sections) {
      if (sec.id) {
        await query(`
          UPDATE homepage_sections SET
            title_mr = $1, title_en = $2,
            subtitle_mr = $3, subtitle_en = $4,
            is_enabled = $5, sort_order = $6,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $7
        `, [
          sanitizeString(sec.title_mr || ''),
          sanitizeString(sec.title_en || ''),
          sanitizeString(sec.subtitle_mr || ''),
          sanitizeString(sec.subtitle_en || ''),
          Boolean(sec.is_enabled),
          Number(sec.sort_order || 0),
          sec.id
        ]);
      }
    }

    await logAudit('UPDATE_HOMEPAGE_SECTIONS', 'homepage_sections', null, { count: sections.length }, req, auth.admin);

    const updated = await query('SELECT * FROM homepage_sections ORDER BY sort_order ASC, id ASC');
    return NextResponse.json({ success: true, sections: updated.rows });
  } catch (err: any) {
    console.error('[HOMEPAGE-PUT]', err);
    return NextResponse.json({ error: 'विभाग अद्यतनित करताना त्रुटी.' }, { status: 500 });
  }
}
