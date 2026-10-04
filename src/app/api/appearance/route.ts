import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { sanitizeString } from '@/lib/security';
import { logAudit } from '@/lib/audit';

const DEFAULT_THEME = {
  appearance_primary_color: '#E65100', // Saffron
  appearance_secondary_color: '#660F1A', // Deep Maroon
  appearance_accent_color: '#C5A059', // Muted Antique Gold
  appearance_background: '#FAF7F2', // Warm Ivory
  appearance_text: '#1F1D1D', // Charcoal
  appearance_button_style: 'rounded-md',
};

export async function GET(req: NextRequest) {
  try {
    const res = await query(`
      SELECT 
        appearance_primary_color, appearance_secondary_color,
        appearance_accent_color, appearance_background, appearance_text,
        appearance_button_style, logo_url, favicon_url
      FROM website_settings WHERE id = 1
    `);
    return NextResponse.json({ appearance: res.rows[0] || DEFAULT_THEME });
  } catch (err: any) {
    console.error('[APPEARANCE-GET]', err);
    return NextResponse.json({ error: 'रंगरूप लोड करताना त्रुटी.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const body = await req.json();

    const appearance_primary_color = sanitizeString(body.appearance_primary_color || DEFAULT_THEME.appearance_primary_color);
    const appearance_secondary_color = sanitizeString(body.appearance_secondary_color || DEFAULT_THEME.appearance_secondary_color);
    const appearance_accent_color = sanitizeString(body.appearance_accent_color || DEFAULT_THEME.appearance_accent_color);
    const appearance_background = sanitizeString(body.appearance_background || DEFAULT_THEME.appearance_background);
    const appearance_text = sanitizeString(body.appearance_text || DEFAULT_THEME.appearance_text);
    const appearance_button_style = sanitizeString(body.appearance_button_style || DEFAULT_THEME.appearance_button_style);
    const logo_url = sanitizeString(body.logo_url || '');
    const favicon_url = sanitizeString(body.favicon_url || '');

    const res = await query(`
      UPDATE website_settings SET
        appearance_primary_color = $1, appearance_secondary_color = $2,
        appearance_accent_color = $3, appearance_background = $4, appearance_text = $5,
        appearance_button_style = $6, logo_url = $7, favicon_url = $8,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
      RETURNING appearance_primary_color, appearance_secondary_color, appearance_accent_color, appearance_background, appearance_text, appearance_button_style, logo_url, favicon_url
    `, [
      appearance_primary_color, appearance_secondary_color,
      appearance_accent_color, appearance_background, appearance_text,
      appearance_button_style, logo_url, favicon_url
    ]);

    await logAudit('UPDATE_THEME', 'website_settings', 1, { appearance_primary_color }, req, auth.admin);

    return NextResponse.json({ success: true, appearance: res.rows[0] });
  } catch (err: any) {
    console.error('[APPEARANCE-PUT]', err);
    return NextResponse.json({ error: 'रंगरूप अद्यतनित करताना त्रुटी.' }, { status: 500 });
  }
}

// Reset to Default endpoint
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const res = await query(`
      UPDATE website_settings SET
        appearance_primary_color = $1, appearance_secondary_color = $2,
        appearance_accent_color = $3, appearance_background = $4, appearance_text = $5,
        appearance_button_style = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
      RETURNING appearance_primary_color, appearance_secondary_color, appearance_accent_color, appearance_background, appearance_text, appearance_button_style
    `, [
      DEFAULT_THEME.appearance_primary_color,
      DEFAULT_THEME.appearance_secondary_color,
      DEFAULT_THEME.appearance_accent_color,
      DEFAULT_THEME.appearance_background,
      DEFAULT_THEME.appearance_text,
      DEFAULT_THEME.appearance_button_style,
    ]);

    await logAudit('RESET_THEME_DEFAULT', 'website_settings', 1, {}, req, auth.admin);

    return NextResponse.json({ success: true, appearance: res.rows[0], message: 'थीम मूळ स्थितीत पूर्ववत करण्यात आली.' });
  } catch (err: any) {
    console.error('[APPEARANCE-RESET]', err);
    return NextResponse.json({ error: 'थीम पूर्ववत करताना त्रुटी.' }, { status: 500 });
  }
}
