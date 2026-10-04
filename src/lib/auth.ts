import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { query } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'prashant_pathak_guruji_super_secret_jwt_key_2026_nagpur_spiritual_puja';
const COOKIE_NAME = 'pp_admin_token';

export interface AdminPayload {
  id: number;
  username: string;
  email: string;
  role: string;
  fullName: string;
}

export async function hashPassword(plain: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function signToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload;
  } catch (err) {
    return null;
  }
}

export async function getAdminFromRequest(req?: NextRequest): Promise<AdminPayload | null> {
  let token: string | undefined;

  if (req) {
    token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
  } else {
    const cookieStore = cookies();
    token = cookieStore.get(COOKIE_NAME)?.value;
  }

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  // Verify that admin account exists and is active in database
  const res = await query(
    'SELECT id, username, email, full_name, role, is_active FROM admins WHERE id = $1',
    [payload.id]
  );

  if (res.rows.length === 0 || !res.rows[0].is_active) {
    return null;
  }

  return {
    id: res.rows[0].id,
    username: res.rows[0].username,
    email: res.rows[0].email,
    role: res.rows[0].role,
    fullName: res.rows[0].full_name,
  };
}

export async function requireAdmin(req?: NextRequest): Promise<{ admin: AdminPayload } | { error: NextResponse }> {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return {
      error: NextResponse.json(
        { error: 'अनधिकृत प्रवेश. कृपया लॉगिन करा. / Unauthorized. Please log in.' },
        { status: 401 }
      ),
    };
  }
  return { admin };
}

export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}
