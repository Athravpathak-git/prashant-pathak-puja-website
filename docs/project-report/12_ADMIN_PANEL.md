# PROJECT REPORT 12: ADMINISTRATIVE CMS PORTAL DOCUMENTATION

---

## 1. Executive Summary
The **Administrative CMS Portal** (`/admin`) serves as the private operational center for Guruji and authorized purohit assistants. Built with **Next.js 14 Client Components** within an authenticated layout (`src/app/admin/layout.tsx`), it provides a responsive interface to oversee booking requests, moderate content, upload photography, and adjust system settings.

---

## 2. Navigation Architecture & Module Directory

The admin sidebar (`AdminLayout`) provides access to 16 management modules:

| Route | Label (Marathi / English) | Icon Component | Available CRUD Actions |
| :--- | :--- | :--- | :--- |
| `/admin` | डॅशबोर्ड (Dashboard) | `LayoutDashboard` | Read overview stats & metrics |
| `/admin/bookings` | बुकिंग्स (Bookings) | `CalendarCheck` | Read, Search, Filter, Update Status, Delete, Notes |
| `/admin/services` | पूजा / विधी (Services) | `Flame` | Create, Read, Update, Delete, Toggle Active/Featured |
| `/admin/categories`| वर्गवारी (Categories) | `FolderTree` | Create, Read, Update, Delete, Reorder |
| `/admin/events` | कार्यक्रम (Events) | `Calendar` | Create, Read, Update, Delete, Date Ordering |
| `/admin/gallery` | दालन (Gallery) | `ImageIcon` | Create, Read, Update, Delete, Toggle Featured/Hidden |
| `/admin/media` | मिडीया लायब्ररी (Media) | `HardDrive` | Upload, Read, Copy URL, Delete |
| `/admin/videos` | व्हिडीओ (Videos) | `Film` | Create, Read, Update, Delete, Embed YouTube URL |
| `/admin/testimonials`| अभिप्राय (Testimonials) | `MessageSquareQuote`| Create, Read, Moderate Approval, Delete |
| `/admin/blog` | लेख / ब्लॉग (Blog) | `BookOpen` | Create, Read, Update, Delete, Slug Generation |
| `/admin/faqs` | प्रश्नोत्तरे (FAQs) | `HelpCircle` | Create, Read, Update, Delete, Categorize |
| `/admin/homepage` | मुख्यपृष्ठ व्यवस्थापन | `Home` | Read, Reorder Sections, Toggle Visibility |
| `/admin/appearance`| रंगरूप (Appearance) | `Palette` | Read Colors, Update Hex Codes, Reset to Default |
| `/admin/notifications`| सूचना (Notifications) | `Bell` | Read, Mark as Read, Badge Counter |
| `/admin/settings` | सेटिंग्ज (Settings) | `Settings` | Read, Update WhatsApp Handle & Contact City |
| `/admin/security` | सुरक्षा (Security) | `ShieldCheck` | Change Admin Password, Session Inspection |
| `/admin/audit-logs`| ऑडिट लॉग (Audit Logs) | `FileText` | Read Chronological Trail, Filter by Action/User |
| `/admin/profile` | गुरुजी प्रोफाईल (Profile) | `User` | Read Bio, Update Biography, Interactive Photo Crop |

---

## 3. Detailed Administrative Module Specifications

### 3.1 Admin Authentication & Session Guard (`/admin/login`, `AdminLayout`)
- Route protection is enforced via `useEffect` calling `GET /api/auth/me`.
- If the token is invalid or expired, the user is redirected immediately to `/admin/login`.
- Login provides rate-limited bcrypt authentication and sets the `pp_admin_token` cookie.
- Logout invokes `POST /api/auth/logout` and clears client session storage.

### 3.2 Dashboard Screen (`/admin/page.tsx`)
Displays key performance cards:
- Total Bookings & Pending Inquiries Count.
- Active Services Count.
- Gallery Photos & Published Events Count.
- Quick shortcut buttons to create new pujas, review recent bookings, or crop Guruji's official photos.

### 3.3 Services & Categories Management
- **Services:** Full modal/drawer creation and editing of ritual profiles. Captures Marathi and English titles, short descriptions, Samagri requirements, procedures, and estimated durations.
- **Categories:** Assigns ceremonies to functional groups (`grah-vastu-shanti`, `puja-abhishek`, `sanskar`, `special-rituals`, `kundali-astrology`).

### 3.4 Guruji Profile & Portrait Studio (`/admin/profile`)
- Manages Guruji's official biographical statement in Marathi and English.
- Integrated photo studio:
  - Select file from computer.
  - Automatically launches `ImageCropModal.tsx`.
  - Enables zoom, pan, and aspect ratio adjustment (4:5 portrait for main cards, 1:1 for round medallions).
  - On save, auto-uploads to `/api/upload` and auto-persists to `PUT /api/profile`, updating the database immediately.

### 3.5 Devotee Testimonials Moderation (`/admin/testimonials`)
- Displays all reviews submitted by devotees via `/testimonials`.
- Administrators can review the 5-star rating and commentary, toggle `is_approved` status, or delete spam submissions.

### 3.6 Homepage Sections Controller (`/admin/homepage`)
Controls 10 homepage sections (`hero`, `guruji_intro`, `services`, `why_choose`, `events`, `gallery`, `videos`, `testimonials`, `faq`, `cta`):
- Drag/numeric order adjustment (`sort_order`).
- One-click visibility toggle (`is_enabled`).

### 3.7 Appearance & Theming Subsystem (`/admin/appearance`)
Allows administrators to customize theme tokens:
- Primary Saffron (`appearance_primary_color`)
- Deep Maroon (`appearance_secondary_color`)
- Antique Gold (`appearance_accent_color`)
- Warm Ivory (`appearance_background`)
- Charcoal Text (`appearance_text`)
- One-click "मूळ स्थितीत पूर्ववत करा" (Reset to Defaults) button restoring the verified temple color scheme.

### 3.8 Audit Logs & Activity Trail (`/admin/audit-logs`)
- Provides an immutable ledger of administrative operations.
- Inspects actor username, target entity, action name, client IP address, and payload metadata with sensitive secrets stripped out.

---
*Admin panel documentation verified against all 19 views in `src/app/admin/`.*
