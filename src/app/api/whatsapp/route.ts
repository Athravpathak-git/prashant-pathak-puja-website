import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import {
  decryptWhatsAppContact,
  buildWhatsAppDirectUrl,
} from '@/lib/whatsappSecurity';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text') || searchParams.get('msg') || '';

  try {
    // 1. Fetch current settings from database
    const res = await query(`
      SELECT 
        whatsapp_contact_type, 
        whatsapp_country_code, 
        whatsapp_encrypted_value, 
        whatsapp_is_enabled,
        whatsapp_username
      FROM website_settings 
      WHERE id = 1
    `);

    const row = res.rows[0];

    // Check if WhatsApp action is disabled
    if (row && row.whatsapp_is_enabled === false) {
      return new NextResponse(
        `<!DOCTYPE html>
<html lang="mr">
<head>
  <meta charset="utf-8">
  <title>WhatsApp चॅट तात्पुरते बंद आहे</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: system-ui, sans-serif; background: #FAF7F2; color: #321116; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
    .card { background: white; padding: 32px; border-radius: 16px; border: 1px solid #D8B96A; max-width: 420px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    h2 { margin-top: 0; color: #5A1720; font-size: 1.25rem; }
    p { font-size: 0.9rem; line-height: 1.5; color: #555; }
    a { display: inline-block; margin-top: 16px; padding: 10px 20px; background: #5A1720; color: #FAF7F0; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 0.85rem; }
  </style>
</head>
<body>
  <div class="card">
    <h2>व्हॉट्सॲप थेट चॅट सध्या उपलब्ध नाही</h2>
    <p>गुरुजींशी संपर्कासाठी कृपया मुख्य संकेतस्थळावरील संपर्क फॉर्म वापरा किंवा थोड्या वेळाने पुन्हा प्रयत्न करा.</p>
    <a href="/contact">संपर्क पानावर जा</a>
  </div>
</body>
</html>`,
        {
          status: 403,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          },
        }
      );
    }

    let contactType: 'mobile' | 'username' = (row?.whatsapp_contact_type as 'mobile' | 'username') || 'mobile';
    let countryCode = row?.whatsapp_country_code || '91';
    let decryptedValue = '';

    if (row?.whatsapp_encrypted_value) {
      decryptedValue = decryptWhatsAppContact(row.whatsapp_encrypted_value);
    }

    // Fallback if encrypted value not yet set in database
    if (!decryptedValue) {
      const envPhone = (process.env.WHATSAPP_PHONE || process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '').replace(/[^0-9]/g, '');
      if (envPhone) {
        contactType = 'mobile';
        decryptedValue = envPhone;
        countryCode = '';
      } else if (row?.whatsapp_username) {
        contactType = 'username';
        decryptedValue = row.whatsapp_username.replace(/^@+/, '');
      }
    }

    // If still no destination available, gracefully advise user
    if (!decryptedValue) {
      return NextResponse.redirect(new URL('/contact', req.url), 302);
    }

    // Build the official direct chat URL
    const destination = buildWhatsAppDirectUrl(contactType, decryptedValue, countryCode, text || undefined);

    if (!destination) {
      return NextResponse.redirect(new URL('/contact', req.url), 302);
    }

    // Server-side redirect directly into WhatsApp without exposing recipient on public client HTML
    return NextResponse.redirect(destination, 307);
  } catch (err: any) {
    console.error('[WHATSAPP-REDIRECT-ERROR]', err.message);
    return NextResponse.redirect(new URL('/contact', req.url), 302);
  }
}
