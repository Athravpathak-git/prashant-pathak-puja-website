# PROJECT REPORT 06: API SPECIFICATION & DOCUMENTATION

---

## 1. API Architecture Overview
The application exposes 34 distinct RESTful endpoints implemented via the Next.js App Router (`route.ts`). All routes return standard JSON responses, enforce strict parameter validation, implement database parameterization, and separate public read operations from administrative mutation controls.

---

## 2. Authentication APIs (`/api/auth/*`)

### 2.1 `POST /api/auth/login`
- **Purpose:** Authenticates administrative credentials and issues an HttpOnly JWT cookie.
- **Authentication:** Public (Rate limited: 5 attempts per 15 minutes per IP).
- **Request Body:**
  ```json
  { "username": "admin", "password": "Guruji@Puja2026!" }
  ```
- **Responses:**
  - `200 OK`: `{ "success": true, "user": { "id": 1, "username": "admin", "role": "admin" } }` with `Set-Cookie: pp_admin_token=...; HttpOnly; SameSite=Lax; Max-Age=604800`
  - `400 Bad Request`: `{ "error": "वापरकर्तानाव व पासवर्ड आवश्यक आहे." }`
  - `401 Unauthorized`: `{ "error": "अवैध क्रेडेंशियल्स." }`
  - `429 Too Many Requests`: `{ "error": "खूप जास्त अयशस्वी प्रयत्न..." }`
- **Database Interaction:** `SELECT * FROM admins WHERE username = $1 AND is_active = TRUE`.

### 2.2 `POST /api/auth/logout`
- **Purpose:** Clears the administrative session cookie.
- **Authentication:** Public / Admin.
- **Response:** `200 OK`: `{ "success": true, "message": "यशस्वीरित्या लॉगआउट झाले." }` with expired cookie.

### 2.3 `GET /api/auth/me`
- **Purpose:** Validates the current JWT cookie and returns authenticated admin profile.
- **Authentication:** Enforces `requireAdmin(req)`.
- **Response:** `200 OK`: `{ "authenticated": true, "user": { "id": 1, "username": "admin", ... } }`.
- **Database Interaction:** Verifies `id` and `is_active` against `admins` table.

### 2.4 `POST /api/auth/change-password`
- **Purpose:** Allows authenticated admin to update account password.
- **Authentication:** Enforces `requireAdmin(req)`.
- **Request Body:** `{ "currentPassword": "...", "newPassword": "..." }`
- **Validations:** Minimum 8 characters; verifies current password with bcrypt.
- **Database Interaction:** `UPDATE admins SET password_hash = $1 WHERE id = $2`.

---

## 3. Puja Booking APIs (`/api/bookings/*`)

### 3.1 `GET /api/bookings`
- **Purpose:** Lists and paginates devotee booking requests.
- **Authentication:** **Admin Only** (Public visitors are forbidden with 401).
- **Query Parameters:** `status` (Pending/Confirmed/Completed/Cancelled), `search` (name, ref, phone), `page` (default 1), `limit` (default 20, max 100).
- **Response:** `200 OK`: `{ "bookings": [...], "pagination": { "total": 12, "page": 1, "limit": 20, "totalPages": 1 } }`.
- **Database Interaction:** Parameterized `SELECT` and `COUNT` from `bookings`.

### 3.2 `POST /api/bookings`
- **Purpose:** Public submission of a new puja booking inquiry.
- **Authentication:** Public (Rate limited: 10 submits per hour per IP).
- **Request Body:**
  ```json
  {
    "full_name": "राजेश जोशी",
    "mobile": "+91 9822000000",
    "email": "rajesh@example.com",
    "service_id": 1,
    "service_name": "वास्तुशांती",
    "preferred_date": "2026-11-15",
    "preferred_time": "सकाळ (Morning)",
    "people_count": 4,
    "address": "फ्लॅट १०२, रामनगर",
    "area": "रामनगर",
    "city": "Nagpur",
    "pincode": "440010",
    "message": "नवीन वास्तूसाठी मुहूर्त हवा आहे"
  }
  ```
- **Responses:**
  - `200 OK`: `{ "success": true, "reference_no": "PUJA-2026-849201", "booking": {...} }`
  - `400 Bad Request`: Validation failure message (missing name, invalid phone, missing date).
  - `429 Too Many Requests`: Rate limit message.
- **Database Interaction:** Inserts row into `bookings`; inserts notification into `notifications`.

### 3.3 `GET /api/bookings/[id]`
- **Purpose:** Retrieves a single booking record by ID.
- **Authentication:** Admin Only.
- **Responses:** `200 OK` or `404 Not Found`.

### 3.4 `PUT /api/bookings/[id]`
- **Purpose:** Updates booking status (`Pending`, `Confirmed`, `Completed`, `Cancelled`) and administrative notes.
- **Authentication:** Admin Only.
- **Database Interaction:** `UPDATE bookings SET status = $1, admin_notes = $2 WHERE id = $3`; logs audit event.

### 3.5 `DELETE /api/bookings/[id]`
- **Purpose:** Deletes a booking record.
- **Authentication:** Admin Only.
- **Database Interaction:** `DELETE FROM bookings WHERE id = $1`; logs audit event.

---

## 4. Services & Categories APIs

### 4.1 `GET /api/services`
- **Purpose:** Public listing of active services, with optional category and featured filters.
- **Query Parameters:** `category` (slug or ID), `featured` (true/false), `all` (admin view including inactive).
- **Response:** `200 OK`: `{ "services": [...] }`.

### 4.2 `POST /api/services`
- **Purpose:** Admin creation of a new puja ceremony.
- **Authentication:** Admin Only.
- **Database Interaction:** `INSERT INTO services (...) VALUES (...)`.

### 4.3 `GET /api/services/[id]` & `PUT /api/services/[id]` & `DELETE /api/services/[id]`
- **Purpose:** Individual service retrieval (by numeric ID or slug), update, and deletion.

### 4.4 `GET /api/categories`, `POST /api/categories`, `PUT /api/categories/[id]`, `DELETE /api/categories/[id]`
- **Purpose:** Taxonomy management for service categories.

---

## 5. Media & Upload APIs

### 5.1 `POST /api/upload`
- **Purpose:** Binary file upload for ritual photos and Guruji portraits.
- **Authentication:** Admin Only (Rate limit: 60 uploads per hour).
- **Validations:** Maximum 10MB; magic-byte binary header inspection (`FF D8 FF` for JPEG, `89 50 4E 47` for PNG, `RIFF...WEBP` for WebP); path traversal prevention.
- **Response:** `200 OK`: `{ "success": true, "url": "/api/uploads/1790772019114_abc.jpg", "media": {...} }`.
- **Database Interaction:** Inserts record into `media`; writes file to `uploads/`.

### 5.2 `GET /api/uploads/[filename]`
- **Purpose:** Public static media serving with immutable caching headers.
- **Authentication:** Public.
- **Security:** Strict regex check `^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$` and directory prefix check preventing path traversal.
- **Headers:** `Content-Type: image/...`, `Cache-Control: public, max-age=31536000, immutable`, `X-Content-Type-Options: nosniff`.

### 5.3 `GET /api/media`, `DELETE /api/media/[id]`
- **Purpose:** Media library listing and file asset deletion.

---

## 6. Events, Gallery & Videos APIs

### 6.1 `GET /api/events`, `POST /api/events`, `PUT /api/events/[id]`, `DELETE /api/events/[id]`
- **Purpose:** Manages upcoming religious events and festival dates.

### 6.2 `GET /api/gallery`, `POST /api/gallery`, `PUT /api/gallery/[id]`, `DELETE /api/gallery/[id]`
- **Purpose:** Photo gallery listing and curation (featured toggle, category assignment, sort order).

### 6.3 `GET /api/videos`, `POST /api/videos`, `PUT /api/videos/[id]`, `DELETE /api/videos/[id]`
- **Purpose:** Embedded YouTube video links and descriptions.

---

## 7. Testimonials, Blog & FAQ APIs

### 7.1 `GET /api/testimonials`, `POST /api/testimonials`, `PUT /api/testimonials/[id]`, `DELETE /api/testimonials/[id]`
- **Purpose:** Public review submission (rate limited: 5/hr, creates pending approval) and admin moderation.

### 7.2 `GET /api/blog`, `GET /api/blog/[id]`, `POST /api/blog`, `PUT /api/blog/[id]`, `DELETE /api/blog/[id]`
- **Purpose:** Educational article management and retrieval.

### 7.3 `GET /api/faqs`, `POST /api/faqs`, `PUT /api/faqs/[id]`, `DELETE /api/faqs/[id]`
- **Purpose:** FAQs retrieval and CRUD.

---

## 8. Profile, Settings, Appearance & Layout APIs

### 8.1 `GET /api/profile` & `PUT /api/profile`
- **Purpose:** Retrieves and updates Guruji's official bio, title, contact location, and photo URLs.
- **Caching:** `export const dynamic = 'force-dynamic'`, `Cache-Control: no-store`.
- **Defensive Persistence:** PUT handler preserves existing photo URLs if not supplied in the request body, preventing inadvertent image deletion.

### 8.2 `GET /api/appearance`, `PUT /api/appearance`, `POST /api/appearance` (Reset)
- **Purpose:** Themes, color palette, and visual button style management.

### 8.3 `GET /api/homepage` & `PUT /api/homepage`
- **Purpose:** Reordering and toggling the visibility of 10 homepage sections.

### 8.4 `GET /api/settings` & `PUT /api/settings`
- **Purpose:** General website configurations.

---

## 9. System Administration & Utility APIs

### 9.1 `GET /api/notifications` & `PUT /api/notifications/[id]`
- **Purpose:** Retrieves unread in-app alerts and marks notifications as read.

### 9.2 `GET /api/audit-logs`
- **Purpose:** Chronological query of administrative activities with filtering by action, admin, or date.

### 9.3 `GET /api/whatsapp`
- **Purpose:** Server-side privacy redirect. Resolves private telephone number securely from `.env` and issues a `307 Temporary Redirect` to WhatsApp Web / App.

---
*API documentation audited against all 34 `route.ts` controllers in `src/app/api`.*
