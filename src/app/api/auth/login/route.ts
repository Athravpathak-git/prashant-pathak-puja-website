import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { comparePassword, signToken, setAuthCookie } from '@/lib/auth';
import { checkRateLimit, sanitizeString } from '@/lib/security';
import { logAudit } from '@/lib/audit';

export async function POST(req: NextRequest) {
  // IP-level rate limit protection against distributed brute-force: 15 requests per 5 minutes per IP
  const rate = checkRateLimit(req, 'admin_login_ip', 15, 300);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: `खूप जास्त अयशस्वी प्रयत्न. कृपया ${rate.retryAfter || 60} सेकंदानंतर प्रयत्न करा. / Too many requests from this IP. Please wait.` },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const username = sanitizeString(body.username);
    const password = String(body.password || '');

    if (!username || !password) {
      return NextResponse.json(
        { error: 'वापरकर्तानाव व पासवर्ड आवश्यक आहे. / Username and password required.' },
        { status: 400 }
      );
    }

    // Query admin account with security tracking columns
    const res = await query(
      `SELECT id, username, email, full_name, password_hash, role, is_active, 
              COALESCE(failed_login_attempts, 0) AS failed_login_attempts, 
              locked_until, last_failed_at 
       FROM admins 
       WHERE username = $1 OR email = $1`,
      [username]
    );

    if (res.rows.length === 0) {
      await logAudit('LOGIN_FAILED', 'admin', null, { reason: 'User not found', attempted: username }, req);
      return NextResponse.json(
        { error: 'अवैध वापरकर्तानाव किंवा पासवर्ड. / Invalid username or password.' },
        { status: 401 }
      );
    }

    const user = res.rows[0];

    // Check account active state
    if (!user.is_active) {
      await logAudit('LOGIN_FAILED', 'admin', user.id, { reason: 'Account inactive' }, req);
      return NextResponse.json(
        { error: 'हे खाते निष्क्रिय आहे. / Account is deactivated.' },
        { status: 403 }
      );
    }

    // 48-HOUR STRICT ACCOUNT LOCKOUT POLICY ENFORCEMENT
    const now = new Date();
    if (user.locked_until) {
      const lockExpiry = new Date(user.locked_until);
      if (lockExpiry > now) {
        const remainingMs = lockExpiry.getTime() - now.getTime();
        const remainingHours = Math.ceil(remainingMs / (1000 * 60 * 60));
        await logAudit('LOGIN_ATTEMPT_WHILE_LOCKED', 'admin', user.id, {
          attempted: username,
          remainingHours,
          lockedUntil: lockExpiry.toISOString()
        }, req);

        return NextResponse.json(
          {
            error: `सलग ३ अयशस्वी प्रयत्नांमुळे हे खाते ४८ तासांसाठी लॉक (कुलूपबंद) आहे. लॉक समाप्ती: ${lockExpiry.toLocaleString('mr-IN')}. (Account locked for 48 hours).`,
            locked: true,
            lockedUntil: lockExpiry.toISOString(),
            remainingHours,
          },
          { status: 423 }
        );
      } else {
        // 48-Hour lock expired: automatically unlock and reset counter
        await query(
          'UPDATE admins SET failed_login_attempts = 0, locked_until = NULL, last_failed_at = NULL WHERE id = $1',
          [user.id]
        );
        user.failed_login_attempts = 0;
        user.locked_until = null;
      }
    }

    // Verify Password
    const isValid = await comparePassword(password, user.password_hash);

    if (!isValid) {
      const newAttempts = Number(user.failed_login_attempts || 0) + 1;

      if (newAttempts >= 3) {
        // Exactly 3 failed attempts: Lock for exactly 48 hours!
        const lockDurationMs = 48 * 60 * 60 * 1000; // 48 Hours
        const lockExpiry = new Date(Date.now() + lockDurationMs);

        await query(
          `UPDATE admins 
           SET failed_login_attempts = $1, 
               locked_until = $2, 
               last_failed_at = CURRENT_TIMESTAMP 
           WHERE id = $3`,
          [newAttempts, lockExpiry, user.id]
        );

        await logAudit('ACCOUNT_LOCKED_48H', 'admin', user.id, {
          reason: '3 failed login attempts',
          attempts: newAttempts,
          lockedUntil: lockExpiry.toISOString(),
          durationHours: 48
        }, req);

        return NextResponse.json(
          {
            error: 'सलग ३ वेळा चुकीचा पासवर्ड प्रविष्ट केल्यामुळे सुरक्षा नियमांनुसार हे खाते ४८ तासांसाठी कुलूपबंद (Locked) करण्यात आले आहे. / Account locked for 48 hours due to 3 failed login attempts.',
            locked: true,
            attempts: newAttempts,
            maxAttempts: 3,
            lockedUntil: lockExpiry.toISOString(),
          },
          { status: 423 }
        );
      } else {
        // Record failed attempt (attempt 1 or 2)
        await query(
          `UPDATE admins 
           SET failed_login_attempts = $1, 
               last_failed_at = CURRENT_TIMESTAMP 
           WHERE id = $2`,
          [newAttempts, user.id]
        );

        await logAudit('LOGIN_FAILED', 'admin', user.id, {
          reason: 'Wrong password',
          attempt: newAttempts,
          maxAttempts: 3
        }, req);

        const remaining = 3 - newAttempts;
        return NextResponse.json(
          {
            error: `अवैध पासवर्ड. अयशस्वी प्रयत्न: ${newAttempts}/3. (${remaining} प्रयत्नानंतर खाते ४८ तासांसाठी लॉक होईल). / Invalid password. Attempt ${newAttempts} of 3.`,
            attempts: newAttempts,
            maxAttempts: 3,
            remainingAttempts: remaining,
          },
          { status: 401 }
        );
      }
    }

    // Successful Login: Reset failed login count and clear locks
    await query(
      `UPDATE admins 
       SET failed_login_attempts = 0, 
           locked_until = NULL, 
           last_failed_at = NULL, 
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1`,
      [user.id]
    );

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: user.full_name,
    };

    const token = signToken(payload);

    await logAudit('LOGIN_SUCCESS', 'admin', user.id, { username: user.username }, req, payload);

    const response = NextResponse.json({
      success: true,
      user: payload,
    });

    setAuthCookie(response, token);
    return response;
  } catch (err: any) {
    console.error('[LOGIN-ERR]', err);
    return NextResponse.json({ error: 'लॉगिन करताना त्रुटी आली. / Internal server error.' }, { status: 500 });
  }
}
