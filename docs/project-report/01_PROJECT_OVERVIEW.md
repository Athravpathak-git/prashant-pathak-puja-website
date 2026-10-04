# PROJECT REPORT 01: PROJECT OVERVIEW

---

## 1. Project Title
**Vedmurti Prashant Shriprasad Pathak (Guruji) — Puja & Religious Services Website**  
*मराठी शीर्षक: वे.मु. प्रशांत पाठक (गुरुजी) — शास्त्रोक्त धार्मिक विधी व पूजा सेवा*

---

## 2. Project Identification & Scope Baseline
- **Application Identifier:** `prashant_pathak_guruji_website`
- **Dedicated Database:** `prashant_pathak_puja_db`
- **Database User:** `prashant_pathak_app`
- **Application Port / Default Host:** `http://localhost:3000`
- **Domain Context:** Shastrokta Vedic Purohit Services & Digital Puja Consultation
- **Geographical Focus:** Nagpur, Vidarbha, and Maharashtra, India

---

## 3. Client Profile
- **Client Name (Marathi):** वे.मु. प्रशांत पाठक (गुरुजी)
- **Client Name (English):** Vedmurti Prashant Shriprasad Pathak (Guruji)
- **Official Title:** वेदमूर्ती (Vedmurti) — Rigvedic & Yajurvedic Shastrokta Purohit
- **Geographic Base:** Nagpur, Maharashtra
- **Official Public WhatsApp Channel:** `@PrashantPathakGuruji`
- **Sacred Invocations (Opening):**
  $$\text{॥ श्री गणेशाय नमः ॥ ❖ ॥ श्री त्र्यंबकेश्वराय नमः ॥}$$
- **Official Service Statement:**
  > *"आमच्या कडे वास्तुशांती, ग्रहशांती, सत्यनारायण, अभिषेक, नक्षत्र शांती, कालसर्प शांती, विवाह, उपनयन संस्कार, मूर्ती प्राणप्रतिष्ठा, उदक शांती, नवचंडी पुजन, लघुरुद्र व सर्व प्रकारच्या धार्मिक विधी शास्त्रोक्त पद्धतीने केले जातील. कुंडली तयार करून मिळेल."*

---

## 4. Problem Statement
Traditional Vedic Purohit services in urban centers like Nagpur operate predominantly through informal, unorganized word-of-mouth channels. This paradigm creates several operational challenges:
1. **Information Asymmetry:** Devotees (Yajamans) frequently lack clear, authentic information regarding necessary ritual prerequisites (Samagri), auspicious Muhurats, ceremony duration, and Shastrokta procedures.
2. **Scheduling Bottlenecks & Coordination Friction:** Ritual booking during peak festival seasons (e.g., Ganeshotsav, Navratri, Shravan, and wedding Muhurats) is vulnerable to double-booking, missed inquiries, and calendar conflicts when handled via manual phone calls.
3. **Absence of a Dignified Digital Presence:** Purohits possessing authentic Vedic lineage rarely have a dedicated, respectful digital platform to showcase ritual photographs, explain scriptural significance, publish festival calendars, and share astrological knowledge.
4. **Devotee Privacy Concerns:** Exposing personal telephone numbers directly on public social directories invites spam, scraping, and intrusive calls during sacred ceremonies.

---

## 5. Proposed Solution
A modern, independent, high-performance web platform built on **Next.js 14 App Router** and **PostgreSQL**, engineered with:
1. **Sacred, Culturally Resonant User Experience:** An ivory, saffron, antique gold, and deep maroon visual theme adhering to traditional Maharashtrian Vedic aesthetics.
2. **Bilingual Accessibility:** Complete parallel language support in **Marathi (मराठी)** as the primary language and **English** as the auxiliary language.
3. **Structured Puja Catalog:** Detailed profiles for 14+ Vedic ceremonies including Samagri requirements, durations, and significance.
4. **Secure Puja Booking & Enquiry Engine:** A user-friendly booking interface generating trackable booking reference numbers (e.g., `PUJA-2026-XXXXXX`) while instantly notifying the admin dashboard.
5. **Private WhatsApp Communication Gateway:** Server-side WhatsApp redirect (`/api/whatsapp`) protecting Guruji's personal contact number behind the public handle `@PrashantPathakGuruji`.
6. **Full-Featured Administrative CMS:** A secure, password-protected administrative back office allowing Guruji and authorized assistants to manage bookings, services, events, photo/video galleries, devotee reviews, FAQs, blog articles, and hero image cropping.

---

## 6. Project Scope & Boundaries

### Included within Scope:
- **Public Bilingual Web Portal:** 13 responsive client-facing routes covering Home, About, Services, Service Details, Booking Form, Events, Photo Gallery, Video Gallery, Devotee Testimonials, Blog Articles, Blog Details, FAQs, and Contact.
- **Administrative Back-Office:** 19 management screens for managing content, reviewing booking submissions, cropping Guruji's official portraits, moderating devotee reviews, and checking audit logs.
- **Dedicated Media Library:** Multi-file upload engine supporting JPG, PNG, and WebP formats with image dimension extraction, byte verification, and in-browser interactive cropping (`react-easy-crop`).
- **Notification & Audit Subsystem:** Internal in-app notification center for new booking requests and tamper-evident audit logging for administrative mutations.

### Strictly Out of Scope / Project Boundaries:
- Third-party payment gateways (Dakshina / fees are discussed privately according to Shastrokta tradition).
- Integration with external social media APIs (no third-party tracking scripts or automated Facebook/Instagram scrapers).
- Sharing of any database, ORM schema, server resources, or credentials with other software projects on the hosting environment.

---

## 7. Target User Groups
1. **Devotees & Families (Yajamans):** Citizens in Nagpur, Vidarbha, and across Maharashtra seeking authentic Vedic rituals for domestic milestones (Griha Pravesh, Vivah, Upanayan) and astrological peace rituals (Grah Shanti, Kalsarp Shanti).
2. **Corporate & Commercial Establishments:** Businesses seeking office Vastu Shanti, Vyapar Vridhi Pujan, or new premises sanctification.
3. **Guruji & Purohit Assistants (Administrators):** वे.मु. प्रशांत पाठक and designated family/administrative managers managing ritual schedules, responding to inquiries, publishing festival Muhurats, and updating photo galleries.

---

## 8. Key High-Level Features
- **Strict Database Isolation:** Complete separation within PostgreSQL (`prashant_pathak_puja_db`), enforced through connection-level database identity verification and application metadata assertions.
- **Dynamic Content Delivery:** Real-time synchronization between the PostgreSQL database and public pages with Next.js dynamic rendering and zero cache staleness.
- **Bilingual Internationalization (i18n):** Client-side instant language toggle between Marathi and English with cookie and `localStorage` persistence.
- **Booking Reference Workflow:** Algorithmic generation of unique references (`PUJA-YYYY-XXXXXX`) enabling structured status tracking (Pending $\rightarrow$ Confirmed $\rightarrow$ Completed / Cancelled).
- **Secure Authentication & Token Management:** HttpOnly cookie-based JWT sessions, salted bcrypt password hashing, and active session validation against database records.

---

## 9. Current Implementation Status Summary

| Area / Subsystem | Implementation Status | Evidence in Codebase |
| :--- | :--- | :--- |
| Core Public Website (13 Routes) | **Implemented** | `src/app/*` (Home, About, Services, Booking, etc.) |
| Bilingual Engine (Marathi / English) | **Implemented** | `src/lib/i18n.tsx`, `src/lib/locales/mr.json`, `en.json` |
| Dedicated PostgreSQL Database | **Implemented** | `prashant_pathak_puja_db`, `src/lib/db.ts`, 17 tables |
| Administrative CMS (19 Routes) | **Implemented** | `src/app/admin/*`, layout, dashboard, management |
| Puja Booking Subsystem | **Implemented** | `/book-puja`, `api/bookings`, `bookings` table |
| Media Upload & In-Browser Cropping | **Implemented** | `/api/upload`, `ImageCropModal.tsx`, `react-easy-crop` |
| Security & Audit Logging | **Implemented** | `src/lib/security.ts`, `src/lib/audit.ts`, HTTP headers |
| Automated Test Suites | **Implemented** | `scripts/*.mjs` (workflow, auth, API, DB identity) |
| Online Payment Gateway | **Not Implemented (Out of Scope)** | By design: Vedic Dakshina is handled offline |

---
*Report verified against repository root: `C:\Users\Shree\Desktop\Prashant Pathak`*
