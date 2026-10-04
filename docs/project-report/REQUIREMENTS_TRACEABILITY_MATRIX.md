# REQUIREMENTS TRACEABILITY MATRIX (RTM)

---

## 1. Traceability Architecture Overview
This Requirements Traceability Matrix establishes bidirectional mapping from system requirements (defined in SRS Report 02) to the functional modules, API controllers, database entities, automated verification tests, and operational status.

---

## 2. Functional Requirements Traceability Matrix

| Req ID | Requirement Summary | Functional Module | API Endpoint | Database Table | Verification Test | Status |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: |
| **FR-001** | Top Sacred Mantra Banner | Public Header | Direct SSR / Client | `website_settings` | `verify-mantra.mjs` | **Implemented** |
| **FR-002** | Bilingual Locale Toggle | `LanguageSwitcher` | Context / Cookies | `mr.json`, `en.json` | `test-workflow.mjs` | **Implemented** |
| **FR-003** | Service Catalog Display | `/services` | `GET /api/services` | `services`, `service_categories` | `test-workflow.mjs` | **Implemented** |
| **FR-004** | Service Filter & Search | `/services` | Client Filtering | `services` | Manual & UI Test | **Implemented** |
| **FR-005** | Samagri List Access | `/services/[id]` | `GET /api/services/[id]` | `services` | Manual UI Test | **Implemented** |
| **FR-006** | Festival & Muhurat Calendar| `/events` | `GET /api/events` | `events` | `next build` trace | **Implemented** |
| **FR-007** | Photo & Video Galleries | `/gallery`, `/videos` | `GET /api/gallery`, `GET /api/videos` | `gallery`, `videos` | `test-workflow.mjs` | **Implemented** |
| **FR-008** | Approved Testimonials | `/testimonials` | `GET /api/testimonials` | `testimonials` | `test-workflow.mjs` | **Implemented** |
| **FR-009** | Public Review Submission | `/testimonials` | `POST /api/testimonials` | `testimonials` | Manual API Test | **Implemented** |
| **FR-010** | Vedic Blog & Articles | `/blog`, `/blog/[id]` | `GET /api/blog` | `blog_posts` | `next build` trace | **Implemented** |
| **FR-011** | Interactive FAQ Accordion | `/faq` | `GET /api/faqs` | `faqs` | `verify-bugs-fixed.mjs` | **Implemented** |
| **FR-012** | Private WhatsApp Gateway | Header / Floating | `GET /api/whatsapp` | Server `.env` | `verify-all.mjs` | **Implemented** |
| **FR-013** | Puja Booking Submission | `/book-puja` | `POST /api/bookings` | `bookings` | `test-workflow.mjs` | **Implemented** |
| **FR-014** | Unique Booking Reference | `/book-puja` | `generateBookingReference` | `bookings(reference_no)` | `test-workflow.mjs` | **Implemented** |
| **FR-015** | In-App Admin Notification | Admin Dashboard | `POST /api/bookings` | `notifications` | `verify-all.mjs` | **Implemented** |
| **FR-016** | Booking Rate Limiting | Security Layer | `checkRateLimit` | In-Memory Map | Unit Assertion | **Implemented** |
| **FR-017** | Admin Bcrypt Authentication| `/admin/login` | `POST /api/auth/login` | `admins` | `test-workflow.mjs` | **Implemented** |
| **FR-018** | JWT Session Issuance | Auth Layer | `signToken`, `setAuthCookie` | Cookie `pp_admin_token` | `test-workflow.mjs` | **Implemented** |
| **FR-019** | Booking Status Lifecycle | `/admin/bookings` | `PUT /api/bookings/[id]` | `bookings`, `audit_logs` | `test-workflow.mjs` | **Implemented** |
| **FR-020** | Service & Category CRUD | `/admin/services` | `/api/services`, `/api/categories` | `services`, `service_categories`| `verify-all.mjs` | **Implemented** |
| **FR-021** | Image Upload & Crop | `/admin/profile` | `POST /api/upload`, `PUT /api/profile` | `media`, `website_settings` | `verify-bugs-fixed.mjs` | **Implemented** |
| **FR-022** | Event & Muhurat Publisher | `/admin/events` | `/api/events` | `events` | `next build` trace | **Implemented** |
| **FR-023** | Testimonial Moderation | `/admin/testimonials`| `PUT /api/testimonials/[id]` | `testimonials` | Manual UI Test | **Implemented** |
| **FR-024** | Homepage Section Reordering| `/admin/homepage` | `PUT /api/homepage` | `homepage_sections` | `verify-all.mjs` | **Implemented** |
| **FR-025** | Theme Appearance Editor | `/admin/appearance` | `/api/appearance` | `website_settings` | `next build` trace | **Implemented** |
| **FR-026** | Audit Trail Recording | Security Layer | `logAudit()` | `audit_logs` | `verify-all.mjs` | **Implemented** |

---

## 3. Non-Functional Requirements Traceability Matrix

| Req ID | Non-Functional Requirement | Architectural Module | Verification Mechanism | Validation Evidence | Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **NFR-001** | Database Isolation Assertion | `src/lib/db.ts` | Programmatic runtime check | `verify-all.mjs` | **Implemented** |
| **NFR-002** | SQL Injection Prevention | `src/lib/db.ts` | Parameterized SQL queries | Static code inspection | **Implemented** |
| **NFR-003** | XSS Script Tag Stripping | `src/lib/security.ts` | `sanitizeString()` regex | API unit testing | **Implemented** |
| **NFR-004** | Magic-Byte Upload Validation | `src/lib/security.ts` | `validateImageMagicBytes()` | `test-workflow.mjs` | **Implemented** |
| **NFR-005** | Path Traversal Protection | `src/app/api/upload` | Directory prefix verification | `test-workflow.mjs` | **Implemented** |
| **NFR-006** | Production Security Headers | `next.config.mjs` | HTTP response header audit | `next build` trace | **Implemented** |
| **NFR-007** | Server-Side Rendering Latency| `src/app/page.tsx` | Concurrent `Promise.all` | `verify-bugs-fixed.mjs` | **Implemented** |
| **NFR-008** | Static Media Caching | `src/app/api/uploads` | `Cache-Control: immutable` | HTTP response headers | **Implemented** |
| **NFR-009** | Connection Pool Management | `src/lib/db.ts` | pg Pooler (max 15 conns) | Pool configuration | **Implemented** |
| **NFR-010** | Cultural Color Palette | `tailwind.config.ts` | Custom theme extension | Visual style audit | **Implemented** |
| **NFR-011** | Responsive Viewport Layout | `Navbar.tsx` | Tailwind flexbox & breakpoints | Viewport testing (360px–1600px) | **Implemented** |

---
*Requirements Traceability Matrix verified against project deliverables.*
