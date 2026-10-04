# PROJECT REPORT 16: RISK MANAGEMENT & RISK REGISTER

---

## 1. Executive Summary
The **Risk Management Framework** identifies, evaluates, and establishes mitigation controls across operational, architectural, security, and data integrity dimensions of the **Vedmurti Prashant Shriprasad Pathak (Guruji) Website**.

---

## 2. Comprehensive Risk Register

| Risk ID | Risk Category | Risk Description | Probability | Impact | Severity | Implemented Mitigation | Continuous Monitoring | Contingency Plan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **RSK-001** | Database | Accidental connection to or modification of an unrelated PostgreSQL database on the host machine. | Low | Critical | **Critical** | Database isolation assertions in `src/lib/db.ts` checking `current_database()`, `current_user`, and `application_identifier`. | Automated check runs on every connection initialization. | System immediately halts process before executing any SQL query. |
| **RSK-002** | Security | Brute force credential cracking against administrative login (`/admin/login`). | Medium | High | **High** | In-memory IP rate limiter limiting login attempts to 5 per 15 minutes; bcrypt hashing with 10 salt rounds. | Failed logins recorded in server logs and audit trail. | Temporarily blocks IP with HTTP 429 response. |
| **RSK-003** | Data Privacy | Devotee personal contact info or Guruji's personal WhatsApp phone exposed in public HTML. | Low | High | **High** | Phone numbers kept strictly in `.env`; public visitors interact via server redirect (`/api/whatsapp`) to `@PrashantPathakGuruji`. | Static source code grep checks in test harness. | Immediate revocation of public keys and `.env` parameter update. |
| **RSK-004** | Security | Malicious binary file upload disguised with image extensions (executable payload). | Medium | High | **High** | Magic-byte binary inspection (`validateImageMagicBytes`) verifying true JPEG, PNG, or WebP byte headers. | Log audit record generated on every upload attempt. | Reject upload with HTTP 400 Bad Request; isolate file write. |
| **RSK-005** | Security | Directory path traversal during image upload or static file serving (`/api/uploads/..`). | Low | High | **High** | Random alphanumeric filename generation; path boundary assertions verifying target resides within `uploads/`. | Automated path checking in route handlers. | HTTP 403 Forbidden on boundary violation. |
| **RSK-006** | Performance | High influx of public booking spam exhausting database connections and disk space. | Medium | Medium | **Medium** | Public booking endpoint rate limited to 10 submissions per hour per IP; input length restrictions. | In-app notification center tracks new booking volume. | Reject with HTTP 429; admin can bulk-delete spam records. |
| **RSK-007** | Availability | Next.js Node process crash or unhandled runtime rejection causing site downtime. | Low | High | **Medium** | PM2 process supervision or systemd service with automatic auto-restart upon exit. | Health checks and uptime monitoring probes. | PM2 auto-spawns a replacement process in $< 2$ seconds. |
| **RSK-008** | Data Loss | Storage disk failure or filesystem corruption leading to loss of PostgreSQL data or media. | Low | Critical | **Critical** | Standardized `pg_dump` daily cron scripts and compressed media archive backups. | Automated backup log verification and storage quota monitoring. | Restore from most recent PostgreSQL `.dump` file and `tar.gz` archive. |
| **RSK-009** | Architecture | Client-side hydration mismatch or SSR layout shift during portrait image rendering. | Medium | Medium | **Medium** | Converted `page.tsx` and `about/page.tsx` into Server Components hydration-feeding `HomePageClient.tsx`. | Verified with automated SSR string assertion script (`verify-bugs-fixed.mjs`). | Default dignified Kalash and Om fallback avatar renders gracefully. |
| **RSK-010** | Multilingual | Missing translation keys in Marathi or English causing broken UI strings (`undefined`). | Low | Low | **Low** | Hierarchical cascading fallback: Active Locale $\rightarrow$ English $\rightarrow$ Marathi $\rightarrow$ Raw Path String. | Static analysis of JSON locale files (`mr.json`, `en.json`). | UI renders raw key label without crashing the React tree. |
| **RSK-011** | Content Management | Accidental deletion or corruption of active puja services or categories. | Low | Medium | **Medium** | Foreign key constraints use `ON DELETE SET NULL`; all admin mutations logged in `audit_logs`. | Audit trail viewable at `/admin/audit-logs`. | Re-run non-destructive seed script or restore from audit history. |
| **RSK-012** | Scalability | Local server disk exhaustion from excessive media library uploads. | Low | Medium | **Medium** | 10 MB per-file upload cap; image dimensions scaled down in canvas prior to upload. | Disk usage alerts on server operating system. | Clean orphaned media records via `/admin/media`. |

---

## 3. Risk Assessment Matrix

```
       ▲
       │ [High Impact]
       │   RSK-002 (Brute Force)        RSK-001 (DB Isolation)
I      │   RSK-004 (Malicious Upload)   RSK-008 (Data Loss)
M      │   RSK-005 (Path Traversal)     RSK-003 (Privacy Exposure)
P      │   RSK-007 (Process Crash)
A      │ -----------------------------------------------------------
C      │   RSK-010 (i18n Missing Key)   RSK-006 (Booking Spam)
T      │   RSK-011 (Content Deletion)   RSK-009 (Hydration Shift)
       │                                RSK-012 (Disk Exhaustion)
       │ [Low Impact]
       └────────────────────────────────────────────────────────────►
         [Low Probability]              [Medium / High Probability]
                          PROBABILITY
```

---
*Risk Management Register audited against current application defenses.*
