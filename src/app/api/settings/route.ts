import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { sanitizeString } from '@/lib/security';
import { logAudit } from '@/lib/audit';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const res = await query('SELECT * FROM website_settings WHERE id = 1');
    return NextResponse.json(
      { settings: res.rows[0] },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (err: any) {
    console.error('[SETTINGS-GET]', err);
    return NextResponse.json({ error: 'सेटिंग्ज लोड करताना त्रुटी.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const body = await req.json();

    const contact_location_mr = sanitizeString(body.contact_location_mr || 'नागपूर, महाराष्ट्र');
    const contact_location_en = sanitizeString(body.contact_location_en || 'Nagpur, Maharashtra');
    const whatsapp_username = sanitizeString(body.whatsapp_username || '@PrashantPathakGuruji');
    const logo_url = sanitizeString(body.logo_url || '');
    const favicon_url = sanitizeString(body.favicon_url || '');
    const guruji_name_mr = body.guruji_name_mr ? sanitizeString(body.guruji_name_mr) : undefined;
    const guruji_name_en = body.guruji_name_en ? sanitizeString(body.guruji_name_en) : undefined;

    let res;
    if (guruji_name_mr && guruji_name_en) {
      res = await query(`
        UPDATE website_settings SET
          contact_location_mr = $1, contact_location_en = $2,
          whatsapp_username = $3, logo_url = $4, favicon_url = $5,
          guruji_name_mr = $6, guruji_name_en = $7,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
        RETURNING *
      `, [contact_location_mr, contact_location_en, whatsapp_username, logo_url, favicon_url, guruji_name_mr, guruji_name_en]);
    } else {
      res = await query(`
        UPDATE website_settings SET
          contact_location_mr = $1, contact_location_en = $2,
          whatsapp_username = $3, logo_url = $4, favicon_url = $5,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
        RETURNING *
      `, [contact_location_mr, contact_location_en, whatsapp_username, logo_url, favicon_url]);
    }

    await logAudit('UPDATE_SETTINGS', 'website_settings', 1, { contact_location_mr, whatsapp_username }, req, auth.admin);

    return NextResponse.json({ success: true, settings: res.rows[0] });
  } catch (err: any) {
    console.error('[SETTINGS-PUT]', err);
    return NextResponse.json({ error: 'सेटिंग्ज अद्यतनित करताना त्रुटी.' }, { status: 500 });
  }
}
