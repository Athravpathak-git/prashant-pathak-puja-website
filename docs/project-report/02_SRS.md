# PROJECT REPORT 02: SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

---

## 1. Introduction
This Software Requirements Specification (SRS) establishes the formal functional and non-functional requirements for the **Vedmurti Prashant Shriprasad Pathak (Guruji) — Puja & Religious Services Website** (`prashant_pathak_guruji_website`). It serves as an authoritative baseline for academic review, system evaluation, and technical auditing.

---

## 2. Purpose
The purpose of this software system is to provide an authentic, culturally respectful, and functionally robust bilingual digital gateway for religious and Vedic puja services in Nagpur, Maharashtra. The system facilitates devotee education, structured puja inquiry and booking, festival calendar tracking, and centralized administrative management of website content and devotee inquiries.

---

## 3. Scope
The software system encompasses:
- Public client web pages for devotees and patrons across desktop and mobile devices.
- A private, secure administrative back-office for content and booking lifecycle management.
- A RESTful API layer delivering dynamic data operations with strict parameter sanitization.
- A dedicated PostgreSQL database schema with enforced isolation checks.

---

## 4. Definitions, Acronyms, and Abbreviations
- **Purohit / Guruji:** A traditional Hindu Vedic scholar and spiritual guide conducting Shastrokta ceremonies.
- **Yajaman:** The host, family head, or devotee commissioning the religious ceremony.
- **Muhurat:** An astrologically auspicious time window calculated according to Panchang principles.
- **Samagri:** The inventory of sacred items, herbs, and materials required for a specific ritual.
- **Shastrokta:** Strictly conducted in compliance with sacred Hindu scriptures (Dharmasindhu, Nirnayasindhu).
- **JWT:** JSON Web Token used for stateless, cryptographically signed administrative session management.
- **RBAC:** Role-Based Access Control enforcing administrative privileges.
- **SSR / CSR:** Server-Side Rendering / Client-Side Rendering in Next.js 14.

---

## 5. Stakeholders
1. **Primary Sponsor / Purohit:** वे.मु. प्रशांत पाठक (Guruji).
2. **Administrative Operators:** Guruji and designated administrative assistants.
3. **End Users / Yajamans:** Devotees residing in Nagpur, Vidarbha, and broader Maharashtra.
4. **Academic & Technical Evaluators:** Software engineering auditors and examiners.

---

## 6. User Classes and Characteristics
- **UC-1: Anonymous Public Visitor (Devotee):** Unauthenticated public user accessing information, browsing services, viewing photo/video galleries, reading articles, and submitting booking requests.
- **UC-2: System Administrator (Guruji / Admin):** Authenticated user possessing full CRUD authorization across bookings, services, categories, media, events, testimonials, articles, FAQs, and system settings.

---

## 7. Functional Requirements

### 7.1 Public Devotional & Information Subsystem
- **FR-001 (Sacred Invocations & Identity):** The system shall render the verified sacred invocation `|| श्री गणेशाय नमः || ❖ || श्री त्र्यंबकेश्वराय नमः ||` prominently in the top header banner across all public pages in Devanagari script.
- **FR-002 (Bilingual Support):** The system shall enable instant switching between Marathi (`mr`) and English (`en`) without requiring page reload, persisting the user's choice in browser cookies (`pp_language`) and `localStorage`.
- **FR-003 (Service Catalog Display):** The system shall display categorized Vedic pujas and rituals with summary descriptions, duration estimates, significance, and procedure overviews.
- **FR-004 (Service Filter & Search):** The system shall allow public visitors to filter pujas by category slug (e.g., `grah-vastu-shanti`, `puja-abhishek`, `sanskar`) and search across Marathi and English titles in real time.
- **FR-005 (Samagri List Access):** The system shall provide detailed, printable/downloadable Samagri (material) requirements for each puja ritual.
- **FR-006 (Festival & Muhurat Calendar):** The system shall present upcoming religious events, Tithis, and special puja schedules ordered by chronological date.
- **FR-007 (Multimedia Galleries):** The system shall render an categorized photo gallery with full-resolution lightboxes and embedded video recitations without third-party advertising cookies.
- **FR-008 (Devotee Feedback & Testimonials):** The system shall display verified, approved devotee testimonials with 5-star ratings and devotee localities.
- **FR-009 (Devotee Review Submission):** The system shall allow public devotees to submit testimonials subject to rate limiting (5 submissions/hour/IP) and admin approval before public rendering.
- **FR-010 (Vedic Blog & Articles):** The system shall display educational articles explaining scriptural philosophy, Vastu science, and rituals with slug-based routing.
- **FR-011 (Interactive FAQ Section):** The system shall present categorized frequently asked questions with accordion toggles addressing booking timelines, Gotra, and travel policies.
- **FR-012 (Private WhatsApp Gateway):** The system shall route WhatsApp inquiries via an internal server endpoint (`/api/whatsapp`) redirecting to the official account `@PrashantPathakGuruji`, strictly protecting Guruji's personal phone number.

### 7.2 Puja Booking & Inquiry Subsystem
- **FR-013 (Booking Request Submission):** The system shall provide a multi-field booking form capturing: full name, mobile number, optional email, preferred date, preferred time window, estimated attendee count, full address, locality, city, and special requirements.
- **FR-014 (Booking Reference Generation):** The system shall automatically generate a unique, human-readable reference number formatted as `PUJA-YYYY-XXXXXX` upon every valid submission.
- **FR-015 (Instant Admin Notification):** Upon booking submission, the system shall insert an unread notification record in the `notifications` table linking to the booking reference.
- **FR-016 (Submission Rate Limiting):** The system shall restrict booking submissions to a maximum of 10 requests per hour per client IP address.

### 7.3 Administrative Content Management Subsystem
- **FR-017 (Admin Authentication):** The system shall verify administrative credentials against salted bcrypt password hashes in the `admins` table.
- **FR-018 (Session Token Generation):** Upon successful authentication, the system shall issue an HttpOnly, SameSite=Lax JWT cookie valid for 7 days.
- **FR-019 (Booking Lifecycle Management):** The administrator shall be able to view, filter, search, annotate, and transition bookings through `Pending`, `Confirmed`, `Completed`, and `Cancelled` states.
- **FR-020 (Service & Category CRUD):** The administrator shall be able to create, update, reorder, toggle visibility, and delete services and service categories.
- **FR-021 (Interactive Image Upload & Crop):** The administrator shall be able to upload images (up to 10MB), validate magic bytes, crop them interactively using `react-easy-crop`, and bind them directly to Guruji's profile (hero image, primary portrait, about portrait).
- **FR-022 (Event & Muhurat Management):** The administrator shall be able to publish and update upcoming spiritual events with date and location details.
- **FR-023 (Testimonial Moderation):** The administrator shall be able to approve, edit, or reject submitted devotee feedback.
- **FR-024 (Homepage Sections Reordering):** The administrator shall be able to toggle the visibility and reorder the sequence of 10 homepage content sections.
- **FR-025 (Theme & Appearance Configuration):** The administrator shall be able to adjust theme colors (primary saffron, secondary maroon, accent gold, ivory background) or reset to defaults.
- **FR-026 (Audit Trail Logging):** The system shall record administrative mutations (action name, target entity, entity ID, metadata JSON, IP address, timestamp) in the `audit_logs` table while stripping passwords and tokens.

---

## 8. Non-Functional Requirements (NFR)

### 8.1 Security Requirements
- **NFR-001 (Database Isolation Check):** The database connection pool shall execute strict runtime assertions confirming that `current_database() == 'prashant_pathak_puja_db'` and `current_user == 'prashant_pathak_app'` before processing queries.
- **NFR-002 (SQL Injection Prevention):** All database interactions shall strictly utilize parameterized queries with ordinal placeholders (`$1, $2, ...`) via the `pg` client.
- **NFR-003 (Cross-Site Scripting [XSS] Mitigation):** All user-supplied text strings shall be stripped of HTML tags and JavaScript injection vectors using `sanitizeString()` prior to database persistence.
- **NFR-004 (File Upload Validation):** Image uploads shall undergo magic-byte signature validation (`validateImageMagicBytes`) confirming genuine JPEG, PNG, or WebP binary headers regardless of client file extensions.
- **NFR-005 (Path Traversal Protection):** File uploads and image serving routes shall enforce path boundary checks preventing directory traversal attacks outside the designated `uploads/` directory.
- **NFR-006 (HTTP Security Headers):** All HTTP responses shall include `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`.

### 8.2 Performance & Responsiveness
- **NFR-007 (Server-Side Rendering Latency):** Public SSR pages (`/`, `/about`) shall deliver initial server-rendered HTML within 300ms under standard local network conditions.
- **NFR-008 (Asset Delivery Optimization):** Static media served via `/api/uploads/[filename]` shall send `Cache-Control: public, max-age=31536000, immutable` headers.
- **NFR-009 (Database Connection Pooling):** The PostgreSQL connection pool shall maintain a maximum of 15 connections with a 30-second idle timeout.

### 8.3 Usability & Cultural Authenticity
- **NFR-010 (Cultural Aesthetic Compliance):** The user interface shall consistently adhere to traditional Vedic design principles utilizing deep maroon (`#660F1A`), saffron (`#E65100`), antique gold (`#C5A059`), and ivory (`#FAF7F2`).
- **NFR-011 (Responsive Layout Adaptability):** The interface shall maintain visual symmetry across viewport breakpoints from 360px mobile displays up to 1600px desktop displays without horizontal overflow or clipped navigation text.

---

## 9. Hardware & Environmental Requirements
- **Server Platform:** x86_64 or ARM64 architecture, minimum 1.5 GHz Dual Core CPU, 2 GB RAM, 10 GB disk storage.
- **Client Devices:** Any modern smartphone, tablet, laptop, or desktop workstation.

---

## 10. Software Requirements
- **Runtime Environment:** Node.js v18.17.0+ (Tested on v24.20.0).
- **Framework:** Next.js v14.2.15+ (App Router).
- **Database Server:** PostgreSQL 14+ (Tested on PostgreSQL 16+ on port 5432).
- **Package Manager:** npm (v9.0.0+).

---

## 11. Browser & Network Requirements
- **Supported Browsers:** Google Chrome 90+, Mozilla Firefox 88+, Apple Safari 14+, Microsoft Edge 90+, Android Chrome, iOS Safari.
- **Network Constraints:** Functional on 3G, 4G, 5G, and broadband connections; public client JavaScript bundle size $\le 110$ kB first-load JS.

---

## 12. Assumptions and Constraints
- **C-1:** Dakshina / financial fee transactions are handled in person; online banking payment gateways are intentionally excluded.
- **C-2:** PostgreSQL server is accessible at `localhost:5432` with pre-configured database `prashant_pathak_puja_db`.
- **A-1:** The server environment maintains persistent local disk storage in `uploads/` for uploaded media assets.

---
*SRS document verified against actual codebase implementation.*
