import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import {
  encryptWhatsAppContact,
  decryptWhatsAppContact,
  validateWhatsAppContact,
} from '@/lib/whatsappSecurity';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET: Retrieve current WhatsApp settings (Admin only)
 * Decrypts contact value for authorized administrator editing.
 */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const res = await query(`
      SELECT 
        whatsapp_contact_type, 
        whatsapp_country_code, 
        whatsapp_encrypted_value, 
        whatsapp_is_enabled 
      FROM website_settings 
      WHERE id = 1
    `);

    const row = res.rows[0];
    let decryptedValue = '';
    if (row?.whatsapp_encrypted_value) {
      decryptedValue = decryptWhatsAppContact(row.whatsapp_encrypted_value);
    }

    return NextResponse.json({
      contact_type: row?.whatsapp_contact_type || 'mobile',
      country_code: row?.whatsapp_country_code || '91',
      contact_value: decryptedValue,
      is_enabled: row?.whatsapp_is_enabled !== false,
      is_configured: Boolean(decryptedValue),
    });
  } catch (err: any) {
    console.error('[ADMIN-WHATSAPP-GET-ERR]', err.message);
    return NextResponse.json(
      { error: 'व्हॉट्सॲप सेटिंग्ज लोड करताना त्रुटी आली.' },
      { status: 500 }
    );
  }
}

/**
 * PUT: Update WhatsApp settings (Admin only)
 * Encrypts contact value at rest using AES-256-GCM authenticated encryption.
 */
export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const body = await req.json();
    const contactType = body.contact_type === 'username' ? 'username' : 'mobile';
    const countryCode = typeof body.country_code === 'string' ? body.country_code : '91';
    const rawContactValue = typeof body.contact_value === 'string' ? body.contact_value.trim() : '';
    const isEnabled = Boolean(body.is_enabled);

    // Validate if a contact value was provided
    if (rawContactValue.length === 0) {
      return NextResponse.json(
        {
          error:
            contactType === 'mobile'
              ? 'कृपया वैध मोबाईल क्रमांक प्रविष्ट करा. / Please enter a valid mobile number.'
              : 'कृपया वैध व्हॉट्सॲप युझरनेम प्रविष्ट करा. / Please enter a valid WhatsApp username.',
        },
        { status: 400 }
      );
    }

    // Official validation
    const validation = validateWhatsAppContact(contactType, rawContactValue, countryCode);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Encrypt at rest with AES-256-GCM
    const encryptedValue = encryptWhatsAppContact(validation.cleanValue);

    // Save to database
    await query(
      `
      UPDATE website_settings SET
        whatsapp_contact_type = $1,
        whatsapp_country_code = $2,
        whatsapp_encrypted_value = $3,
        whatsapp_is_enabled = $4,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `,
      [contactType, validation.cleanCountryCode, encryptedValue, isEnabled]
    );

    // Log administrative audit action without exposing contact details in log payload
    await logAudit(
      'UPDATE_WHATSAPP_SETTINGS',
      'website_settings',
      1,
      { contact_type: contactType, is_enabled: isEnabled },
      req,
      auth.admin
    );

    return NextResponse.json({
      success: true,
      message: 'व्हॉट्सॲप थेट चॅट सेटिंग्ज यशस्वीरित्या सुरक्षितपणे जतन केल्या.',
    });
  } catch (err: any) {
    console.error('[ADMIN-WHATSAPP-PUT-ERR]', err.message);
    return NextResponse.json(
      { error: 'व्हॉट्सॲप सेटिंग्ज जतन करताना त्रुटी आली.' },
      { status: 500 }
    );
  }
}
