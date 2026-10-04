# PROJECT REPORT 05: FUNCTIONAL MODULE DOCUMENTATION

---

## 1. Module Architecture Overview
The application functions as two integrated subsystems: the **Public Devotional Portal** (13 modules) serving Yajamans and devotees, and the **Administrative CMS Portal** (14 modules) serving Guruji and authorized operators. Every module operates with bilingual Marathi/English support and parameterized database interactions.

---

## 2. Public Devotional Portal Modules

### 2.1 Home Module (`/`)
- **Purpose:** Primary digital sanctuary establishing Guruji's identity, displaying the sacred mantra `|| श्री गणेशाय नमः || ❖ || श्री त्र्यंबकेश्वराय नमः ||`, featuring major pujas, introducing Guruji, and providing instant booking access.
- **Users:** Public devotees, patrons, event hosts.
- **Inputs:** Dynamic query parameters (language cookie `pp_language`).
- **Processing:** Server-Side Rendering (`page.tsx`) queries `website_settings`, `services`, `events`, `testimonials`, `faqs`. Hydrates `HomePageClient.tsx`.
- **Outputs:** Fully rendered HTML hero section, puja grid, booking steps, Guruji portrait, and call-to-actions.
- **Validations:** Graceful fallback if database values are null; fallback avatar displays if no photo is configured.
- **DB Interaction:** Reads `website_settings`, `services`, `events`, `gallery`, `testimonials`, `faqs`.
- **APIs Involved:** Direct SSR queries + `/api/profile` client synchronization.
- **Security:** Strict SSR sanitization; no customer PII exposed.
- **Status:** **Implemented**

### 2.2 About Module (`/about`)
- **Purpose:** Explains Guruji's Vedic background, scriptural lineage, Shastrokta principles, and service areas.
- **Users:** Devotees seeking scriptural authenticity and background.
- **Inputs:** Language state.
- **Processing:** Server Component fetches `website_settings` row 1 and delivers hydrated `AboutClient.tsx`.
- **Outputs:** Responsive portrait of Guruji, bio text, core principles cards (Scriptural Sanctity, Host Satisfaction, Astrological Precision).
- **Validations:** Fallback portrait if image URL missing.
- **DB Interaction:** `website_settings`.
- **APIs Involved:** Direct SSR query + `/api/profile`.
- **Security:** Static content delivery without user mutations.
- **Status:** **Implemented**

### 2.3 Services & Details Module (`/services`, `/services/[id]`)
- **Purpose:** Categorized catalog of Vedic rituals with comprehensive details, duration, procedure overview, and Samagri requirements.
- **Users:** Devotees planning specific ceremonies.
- **Inputs:** Category filter slug, keyword search term, service ID.
- **Processing:** Client-side real-time filtering across Marathi and English titles; dynamic slug-based route rendering for detail view.
- **Outputs:** Responsive card grid, duration badges, detailed descriptions, and booking button linking directly to `/book-puja?service=<id>`.
- **Validations:** Numeric ID validation; inactive services hidden from public.
- **DB Interaction:** Reads `services` joined with `service_categories`.
- **APIs Involved:** `GET /api/services`, `GET /api/services/[id]`, `GET /api/categories`.
- **Security:** SQL injection prevention via parameterized queries.
- **Status:** **Implemented**

### 2.4 Puja Booking Module (`/book-puja`)
- **Purpose:** Captures structured booking requests and transmits them to Guruji's administrative panel.
- **Users:** Yajamans / Devotees requesting rituals.
- **Inputs:** Name, mobile, email, preferred date, preferred time, people count, address, area, city, pincode, message.
- **Processing:** Rate limit evaluated (10/hr); inputs sanitized via `sanitizeString()`; algorithmic generation of `PUJA-YYYY-XXXXXX` reference; database insert into `bookings` and `notifications`.
- **Outputs:** Confirmation card displaying booking reference number and next-step instructions.
- **Validations:** Name $\ge 2$ chars, mobile regex `^[0-9+ -]{8,15}$`, date presence, address $\ge 5$ chars.
- **DB Interaction:** Writes to `bookings` and `notifications`.
- **APIs Involved:** `POST /api/bookings`.
- **Security:** In-memory IP rate limiting, XSS sanitization, anti-spam validation.
- **Status:** **Implemented**

### 2.5 Events & Calendar Module (`/events`)
- **Purpose:** Chronological listing of upcoming religious festivals, Ekadashi, Pradosh, and special Anushthans.
- **Users:** Devotees tracking auspicious Hindu dates.
- **Inputs:** Language preference.
- **Processing:** Fetches published events ordered by `event_date ASC`.
- **Outputs:** Event cards with date badge, time, venue, and description.
- **DB Interaction:** Reads `events`.
- **APIs Involved:** `GET /api/events`.
- **Security:** Read-only access to published records (`is_published = TRUE`).
- **Status:** **Implemented**

### 2.6 Multimedia Galleries Module (`/gallery`, `/videos`)
- **Purpose:** Curated display of high-resolution ritual photographs and embedded YouTube videos.
- **Users:** Devotees viewing previous pujas and video recitations.
- **Inputs:** Category filter tab, image click for lightbox expansion.
- **Processing:** Filter gallery items; render responsive grid; open zero-dependency modal lightbox on image click.
- **Outputs:** Image grid, lightbox view, responsive iframe video embeds.
- **DB Interaction:** Reads `gallery`, `videos`.
- **APIs Involved:** `GET /api/gallery`, `GET /api/videos`.
- **Security:** Hidden images (`is_hidden = TRUE`) filtered out.
- **Status:** **Implemented**

### 2.7 Devotee Feedback Module (`/testimonials`)
- **Purpose:** Displays authentic devotee feedback and accepts new review submissions.
- **Users:** Devotees reading reviews or submitting their own experience.
- **Inputs:** Devotee name, location, rating (1-5), comments.
- **Processing:** Rate limit checked (5/hr); sanitized; inserted with `is_approved = FALSE` (or `TRUE` if submitted via admin).
- **Outputs:** List of approved reviews; submission success notification.
- **DB Interaction:** Reads approved records; inserts into `testimonials`.
- **APIs Involved:** `GET /api/testimonials`, `POST /api/testimonials`.
- **Security:** Public submissions require admin approval prior to appearing on the website.
- **Status:** **Implemented**

### 2.8 Vedic Blog & Articles Module (`/blog`, `/blog/[id]`)
- **Purpose:** Educational repository of Vedic articles on Vastu Shanti, Griha Pravesh, Nakshatras, and rituals.
- **Users:** Devotees seeking scriptural knowledge.
- **Inputs:** Article slug or ID.
- **Processing:** Queries `blog_posts` by slug/ID and renders rich text formatting.
- **Outputs:** Blog listing with excerpts; comprehensive article view.
- **DB Interaction:** Reads `blog_posts`.
- **APIs Involved:** `GET /api/blog`, `GET /api/blog/[id]`.
- **Security:** Read-only public access to published posts.
- **Status:** **Implemented**

### 2.9 FAQs Module (`/faq`)
- **Purpose:** Answers common devotee questions regarding booking lead times, Samagri, Gotra, and travel outside Nagpur.
- **Users:** Inquiring devotees.
- **Inputs:** Category tab selection; accordion toggle clicks.
- **Processing:** Group FAQs by category; toggle open/closed accordion state.
- **Outputs:** Expandable question/answer cards.
- **DB Interaction:** Reads `faqs`.
- **APIs Involved:** `GET /api/faqs`.
- **Status:** **Implemented**

### 2.10 Contact & WhatsApp Gateway Module (`/contact`, `/api/whatsapp`)
- **Purpose:** Location information, contact form, and secure WhatsApp redirection.
- **Users:** Devotees wishing to communicate directly with Guruji.
- **Inputs:** Optional inquiry text query parameter `?text=...`.
- **Processing:** Server reads private phone number from `.env` and issues a `307 Temporary Redirect` to `https://wa.me/<phone>` without exposing the phone number to client HTML.
- **Outputs:** HTTP 307 redirect directly launching the user's WhatsApp application.
- **DB Interaction:** Reads `website_settings` for contact location.
- **APIs Involved:** `GET /api/whatsapp`.
- **Security:** Total privacy protection for Guruji's personal contact number.
- **Status:** **Implemented**

---

## 3. Administrative CMS Portal Modules

### 3.1 Admin Authentication Module (`/admin/login`, `/api/auth/*`)
- **Purpose:** Secure gatekeeper authenticating administrators.
- **Users:** Guruji and authorized assistants.
- **Inputs:** Username, password.
- **Processing:** Rate-limited (5/15 min); bcrypt verification; JWT generation; sets HttpOnly cookie `pp_admin_token`.
- **Outputs:** Session cookie; redirect to `/admin`.
- **DB Interaction:** `admins` table.
- **APIs Involved:** `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`.
- **Status:** **Implemented**

### 3.2 Admin Dashboard (`/admin`)
- **Purpose:** High-level operational overview displaying quick statistics (total bookings, pending inquiries, services, gallery items) and quick action shortcuts.
- **Status:** **Implemented**

### 3.3 Booking Lifecycle Management (`/admin/bookings`)
- **Purpose:** Complete review, search, status updating, and administrative annotation of devotee bookings.
- **Processing:** Filter by status (`Pending`, `Confirmed`, `Completed`, `Cancelled`); paginate results; record audit trail on status change.
- **DB Interaction:** `bookings`, `audit_logs`.
- **APIs Involved:** `GET /api/bookings`, `PUT /api/bookings/[id]`, `DELETE /api/bookings/[id]`.
- **Status:** **Implemented**

### 3.4 Service & Category Management (`/admin/services`, `/admin/categories`)
- **Purpose:** Create, edit, reorder, and toggle visibility of Vedic rituals and categories.
- **DB Interaction:** `services`, `service_categories`, `audit_logs`.
- **Status:** **Implemented**

### 3.5 Media Library & Interactive Crop (`/admin/media`, `/admin/profile`)
- **Purpose:** File upload management, magic-byte inspection, and portrait cropping for hero and about page images.
- **Processing:** Multi-part file upload, random safe name generation, interactive canvas zoom/crop (`react-easy-crop`), instant database update.
- **DB Interaction:** `media`, `website_settings`.
- **APIs Involved:** `POST /api/upload`, `GET /api/media`, `PUT /api/profile`.
- **Status:** **Implemented**

### 3.6 Event, Video, Testimonial, Blog & FAQ Managers
- **Purpose:** Full CRUD operations across religious events, video embeds, devotee reviews, blog posts, and FAQs.
- **Status:** **Implemented**

### 3.7 Appearance & Homepage Layout Manager (`/admin/appearance`, `/admin/homepage`)
- **Purpose:** Configures theme colors (Saffron, Maroon, Gold, Ivory) and controls the display sequence and visibility of 10 homepage sections.
- **DB Interaction:** `website_settings`, `homepage_sections`.
- **Status:** **Implemented**

### 3.8 Notifications & Audit Logs (`/admin/notifications`, `/admin/audit-logs`)
- **Purpose:** Real-time alert list for new bookings and immutable chronological trail of administrative actions.
- **DB Interaction:** `notifications`, `audit_logs`.
- **Status:** **Implemented**

---
*Functional module documentation verified against source code in `src/app` and `src/components`.*
