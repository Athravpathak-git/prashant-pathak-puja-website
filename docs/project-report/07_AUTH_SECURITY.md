# PROJECT REPORT 07: AUTHENTICATION, AUTHORIZATION & SECURITY ARCHITECTURE

---

## 1. Security Architecture Overview
The security framework of the **Vedmurti Prashant Shriprasad Pathak (Guruji) Website** is implemented with defense-in-depth principles spanning network headers, cryptographic hashing, stateless token management, in-memory rate limiting, binary signature inspection, and database query parameterization.

---

## 2. Implemented Security Controls

### 2.1 Cryptographic Password Hashing
- **Algorithm:** **bcrypt** via the `bcryptjs` library.
- **Salt Generation:** 10 rounds of cryptographic salting (`bcrypt.genSalt(10)`).
- **Storage:** Stored in the `password_hash` column of the `admins` table. Plaintext passwords are never stored, logged, or serialized into JSON responses.

### 2.2 Token-Based Authentication & Session Management
- **Mechanism:** Signed **JSON Web Tokens (JWT)** generated via `jsonwebtoken`.
- **Payload:** Contains `id`, `username`, `email`, `role`, and `fullName`.
- **Secret Key:** Injected via `JWT_SECRET` environment variable with a fallback development signature.
- **Token Expiry:** 7 days (`expiresIn: '7d'`).
- **Transport & Storage:** Delivered via an **HttpOnly** cookie named `pp_admin_token`:
  - `httpOnly: true` (Prevents client-side JavaScript access via `document.cookie`, mitigating XSS credential theft).
  - `sameSite: 'lax'` (Provides baseline Cross-Site Request Forgery [CSRF] mitigation during cross-origin navigations).
  - `secure: process.env.NODE_ENV === 'production'` (Enforces HTTPS transport in production).
  - `path: '/'` (Covers entire application space).
  - `maxAge: 604800` (7 days).

### 2.3 Authentication Guard & Route Protection (`requireAdmin`)
Administrative route handlers enforce protection via `requireAdmin(req)` in `src/lib/auth.ts`:
```typescript
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
```
If the token is missing, expired, tampered with, or if the associated admin account has been deactivated in PostgreSQL (`is_active = FALSE`), access is immediately halted with `HTTP 401 Unauthorized`.

### 2.4 SQL Injection Defense
The application completely eliminates string concatenation in database interactions. Every query executed via `src/lib/db.ts` uses parameterized placeholders:
```typescript
// Verified Parameterized Execution
const res = await query('SELECT * FROM bookings WHERE status = $1 AND id = $2', [status, id]);
```
Parameter arrays are passed directly to PostgreSQL's query engine for compilation and execution, rendering SQL injection vectors inert.

### 2.5 Cross-Site Scripting (XSS) Sanitization
User-supplied inputs across booking forms, reviews, and admin updates are passed through `sanitizeString()` in `src/lib/security.ts`:
- Strips all `<...>` HTML tags.
- Removes `javascript:` URI schemes.
- Strips `data:text/html` payloads.
- Removes inline event handlers (`onclick=`, `onload=`, `onerror=`).

### 2.6 Binary Magic-Byte File Upload Validation
To prevent malicious executable uploads disguised with image extensions (e.g., `payload.php.jpg`), the upload handler in `src/lib/security.ts` inspects the initial byte headers:
- **JPEG:** Verifies leading bytes `0xFF 0xD8 0xFF`.
- **PNG:** Verifies 8-byte signature `0x89 0x50 0x4E 0x47 0x0D 0x0A 0x1A 0x0A`.
- **WebP:** Verifies `RIFF` header at offset 0 and `WEBP` header at offset 8.
If magic bytes do not match these strict signatures, the upload is rejected with `HTTP 400 Bad Request`.

### 2.7 Path Traversal Mitigation
1. **Uploads:** Files are written using randomly generated filenames (`Date.now() + 16 random bytes + safeExt`). Path resolution enforces `targetPath.startsWith(UPLOAD_DIR)`.
2. **Serving:** The file delivery handler `/api/uploads/[filename]` matches filenames against `^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$` and verifies that the canonical path resides strictly within the `uploads/` directory.

### 2.8 In-Memory Rate Limiting
A thread-safe in-memory rate limiting mechanism (`checkRateLimit`) tracks IP activity with automatic 60-second garbage collection:
- **Admin Login:** 5 attempts / 15 minutes.
- **Booking Submissions:** 10 requests / 1 hour.
- **Devotee Testimonials:** 5 submissions / 1 hour.
- **Media Uploads:** 60 uploads / 1 hour.
Excess requests are rejected with `HTTP 429 Too Many Requests` and include a `retryAfter` calculation.

### 2.9 HTTP Security Headers
Configured in `next.config.mjs` for all application routes:
- `X-Content-Type-Options: nosniff` (Prevents MIME-sniffing).
- `X-Frame-Options: DENY` (Prevents clickjacking framing).
- `X-XSS-Protection: 1; mode=block` (Enforces browser XSS filtering).
- `Referrer-Policy: strict-origin-when-cross-origin` (Protects query string exposure).
- `Permissions-Policy: camera=(), microphone=(), geolocation=()` (Disables unnecessary device APIs).

### 2.10 Audit Trail Subsystem
All state-modifying administrative actions call `logAudit()` in `src/lib/audit.ts`. Audit entries record:
- `admin_id`, `admin_username`, `action`, `entity`, `entity_id`, `details`, `ip_address`, `created_at`.
- **Sensitive Data Strip:** Passwords, password hashes, secrets, and session tokens are strictly deleted from the `details` JSON payload prior to insertion into the `audit_logs` table.

### 2.11 Privacy Protection for Client Contact Information
Guruji's personal contact telephone number is maintained exclusively on the server in `.env`. It is never delivered to client bundles, HTML source, or API responses. Devotees interact with `@PrashantPathakGuruji` through a protected server redirect (`/api/whatsapp`).

---

## 3. Recommended / Future Security Improvements
The following items are identified for future phases:
1. **Distributed Rate Limiting:** Transition the in-memory rate limiter to Redis or PostgreSQL backing if multi-instance clustering or horizontal autoscaling is deployed.
2. **Multi-Factor Authentication (MFA):** Implementation of Time-based One-Time Password (TOTP) for Guruji's administrative login.
3. **Automated Session Invalidation Table Integration:** Active enforcement of token revocations against the existing `admin_sessions` table upon administrative logout or password change.
4. **Cloud Object Storage with Presigned URLs:** Transitioning the local file system `uploads/` directory to S3-compatible private object storage for distributed deployments.

---
*Auth & Security documentation audited against actual implementation files.*
