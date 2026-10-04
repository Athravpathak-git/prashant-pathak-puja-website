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
    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'सेटिंग्ज सापडल्या नाहीत.' }, { status: 404 });
    }
    return NextResponse.json(
      { profile: res.rows[0] },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (err: any) {
    console.error('[PROFILE-GET]', err);
    return NextResponse.json({ error: 'प्रोफाईल लोड करताना त्रुटी.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const body = await req.json();

    // Fetch current settings to preserve any fields not provided in update
    const currentRes = await query('SELECT * FROM website_settings WHERE id = 1');
    const current = currentRes.rows[0] || {};

    const guruji_name_mr = body.guruji_name_mr !== undefined ? sanitizeString(body.guruji_name_mr) : current.guruji_name_mr;
    const guruji_name_en = body.guruji_name_en !== undefined ? sanitizeString(body.guruji_name_en) : current.guruji_name_en;
    const guruji_title_mr = body.guruji_title_mr !== undefined ? sanitizeString(body.guruji_title_mr) : current.guruji_title_mr;
    const guruji_title_en = body.guruji_title_en !== undefined ? sanitizeString(body.guruji_title_en) : current.guruji_title_en;
    const bio_mr = body.bio_mr !== undefined ? sanitizeString(body.bio_mr) : current.bio_mr;
    const bio_en = body.bio_en !== undefined ? sanitizeString(body.bio_en) : current.bio_en;
    const hero_image_url = body.hero_image_url !== undefined ? sanitizeString(body.hero_image_url) : (current.hero_image_url || '');
    const primary_photo_url = body.primary_photo_url !== undefined ? sanitizeString(body.primary_photo_url) : (current.primary_photo_url || '');
    const about_photo_url = body.about_photo_url !== undefined ? sanitizeString(body.about_photo_url) : (current.about_photo_url || '');
    const contact_location_mr = body.contact_location_mr !== undefined ? sanitizeString(body.contact_location_mr) : (current.contact_location_mr || 'नागपूर, महाराष्ट्र');
    const contact_location_en = body.contact_location_en !== undefined ? sanitizeString(body.contact_location_en) : (current.contact_location_en || 'Nagpur, Maharashtra');
    const whatsapp_username = body.whatsapp_username !== undefined ? sanitizeString(body.whatsapp_username) : (current.whatsapp_username || '@PrashantPathakGuruji');

    const res = await query(`
      UPDATE website_settings SET
        guruji_name_mr = $1, guruji_name_en = $2,
        guruji_title_mr = $3, guruji_title_en = $4,
        bio_mr = $5, bio_en = $6,
        hero_image_url = $7, primary_photo_url = $8, about_photo_url = $9,
        contact_location_mr = $10, contact_location_en = $11,
        whatsapp_username = $12, updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
      RETURNING *
    `, [
      guruji_name_mr, guruji_name_en,
      guruji_title_mr, guruji_title_en,
      bio_mr, bio_en,
      hero_image_url, primary_photo_url, about_photo_url,
      contact_location_mr, contact_location_en,
      whatsapp_username
    ]);

    await logAudit('UPDATE_GURUJI_PROFILE', 'website_settings', 1, { guruji_name_mr }, req, auth.admin);

    return NextResponse.json({ success: true, profile: res.rows[0] });
  } catch (err: any) {
    console.error('[PROFILE-PUT]', err);
    return NextResponse.json({ error: 'प्रोफाईल अद्यतनित करताना त्रुटी.' }, { status: 500 });
  }
}
