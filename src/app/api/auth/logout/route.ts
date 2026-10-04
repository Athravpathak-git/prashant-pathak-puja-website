import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie, getAdminFromRequest } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function POST(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (admin) {
    await logAudit('LOGOUT', 'admin', admin.id, {}, req, admin);
  }

  const response = NextResponse.json({ success: true, message: 'यशस्वीरीत्या लॉगआउट झाले. / Logged out successfully.' });
  clearAuthCookie(response);
  return response;
}
