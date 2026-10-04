import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, comparePassword, hashPassword } from '@/lib/auth';
import { query } from '@/lib/db';
import { logAudit } from '@/lib/audit';

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const body = await req.json();
    const currentPassword = String(body.currentPassword || '');
    const newPassword = String(body.newPassword || '');
    const confirmPassword = String(body.confirmPassword || '');

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: 'सर्व फील्ड भरणे आवश्यक आहे. / All fields are required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'नवीन पासवर्ड किमान ८ अक्षरांचा असावा. / New password must be at least 8 characters.' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'नवीन पासवर्ड आणि खात्री जुळत नाही. / Passwords do not match.' },
        { status: 400 }
      );
    }

    // Get current hash
    const res = await query('SELECT password_hash FROM admins WHERE id = $1', [auth.admin.id]);
    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'वापरकर्ता सापडला नाही. / User not found.' }, { status: 404 });
    }

    const isMatch = await comparePassword(currentPassword, res.rows[0].password_hash);
    if (!isMatch) {
      await logAudit('PASSWORD_CHANGE_FAILED', 'admin', auth.admin.id, { reason: 'Incorrect current password' }, req, auth.admin);
      return NextResponse.json(
        { error: 'सध्याचा पासवर्ड चुकीचा आहे. / Incorrect current password.' },
        { status: 400 }
      );
    }

    const newHash = await hashPassword(newPassword);
    await query('UPDATE admins SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [
      newHash,
      auth.admin.id,
    ]);

    await logAudit('PASSWORD_CHANGED', 'admin', auth.admin.id, {}, req, auth.admin);

    return NextResponse.json({
      success: true,
      message: 'पासवर्ड यशस्वीरित्या बदलला गेला. / Password updated successfully.',
    });
  } catch (err: any) {
    console.error('[PASSWORD-ERR]', err);
    return NextResponse.json({ error: 'पासवर्ड बदलताना त्रुटी आली. / Internal error.' }, { status: 500 });
  }
}
