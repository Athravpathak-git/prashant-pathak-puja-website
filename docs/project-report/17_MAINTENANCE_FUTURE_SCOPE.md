# PROJECT REPORT 17: MAINTENANCE STRATEGY & FUTURE SCOPE

---

## 1. Executive Summary
This document delineates the operational maintenance protocols required for sustained reliability of the **Vedmurti Prashant Shriprasad Pathak (Guruji) Website** and establishes a clear roadmap distinguishing current deliverables from planned enhancements.

---

## 2. Operational Maintenance Strategy

### 2.1 Content Maintenance Protocols
- **Panchang & Festival Calendar Updates:** Guruji or an authorized administrator updates the `events` table bi-monthly to publish upcoming Ekadashi, Pradosh, Shivratri, and festive Muhurats.
- **Devotee Testimonial Moderation:** Weekly inspection of `/admin/testimonials` to approve legitimate devotee reviews and purge potential spam.
- **Vedic Blog & Article Publishing:** Monthly publication of Shastrokta articles explaining ritual significance, Griha Pravesh rules, and astrological remedies.

### 2.2 Database Maintenance (`prashant_pathak_puja_db`)
- **Automated Vacuuming & Re-indexing:** PostgreSQL autovacuum handles dead tuple reclamation. Monthly re-indexing of primary B-tree indexes:
  ```sql
  REINDEX TABLE bookings;
  REINDEX TABLE services;
  REINDEX TABLE audit_logs;
  ```
- **Audit Log Pruning:** Archiving records older than 180 days from `audit_logs` to preserve query performance.
- **Daily Automated Backups:** Automated cron job executing `pg_dump` daily at 02:00 AM IST to local and off-site backup storage.

### 2.3 Security & Dependency Maintenance
- **Vulnerability Auditing:** Bi-weekly execution of `npm audit` to identify vulnerabilities in transitive Node.js dependencies.
- **Cryptographic Secret Rotation:** Recommended semi-annual rotation of `JWT_SECRET` and administrative account passwords via `/admin/security`.

---

## 3. Clear Differentiation: Implemented vs. Future Scope

| Feature / Domain | Current Implementation Status | Future Roadmap Phase |
| :--- | :--- | :--- |
| **Complete Project Audit & Documentation** | **Implemented (Phase 1 Completed)** | Complete |
| **Bilingual Public Devotional Portal (13 Routes)** | **Implemented** | Stable Baseline |
| **Administrative CMS Back-Office (19 Routes)** | **Implemented** | Stable Baseline |
| **Dedicated PostgreSQL Schema (17 Tables)** | **Implemented** | Stable Baseline |
| **Puja Inquiry & Reference System** | **Implemented** | Stable Baseline |
| **Interactive In-Browser Image Cropping** | **Implemented** | Stable Baseline |
| **Private Server-Side WhatsApp Redirect** | **Implemented** | Stable Baseline |
| **Complete Unique Premium UI/UX Redesign** | **Planned (Reserved for Phase 2)** | **Phase 2 (Next Immediate Task)** |
| **Automated WhatsApp Business API Dispatch** | Planned | Phase 3 |
| **PWA (Progressive Web App) Offline Support** | Planned | Phase 3 |
| **Vedic Panchang & Muhurat Calculator Engine** | Planned | Phase 4 |
| **Embedded Vedic Stotra Audio Player** | Planned | Phase 4 |
| **Multi-Purohit Scheduling & Team Calendar** | Planned | Phase 4 |

---

## 4. Phase 2: Complete Unique Premium UI/UX Redesign (Preview)
As mandated by project governance:
- **Phase 1** encompasses the complete technical audit and report set generation (the current task).
- **Phase 2** will execute an end-to-end visual and aesthetic transformation without altering database structures or business logic:
  1. Elevation to a bespoke, royal temple aesthetic (ornate Mandir jali patterns, micro-interactions, subtle gold leaf textures).
  2. Bespoke card interactions, typography enhancements, and refined mobile navigation ergonomics.
  3. Tailored ceremonial iconography and spiritual divider ornaments.

---
*Maintenance and roadmap documentation approved for operational baseline.*
