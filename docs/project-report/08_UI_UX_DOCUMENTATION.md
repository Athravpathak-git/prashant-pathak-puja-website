# PROJECT REPORT 08: UI/UX & DESIGN SYSTEM DOCUMENTATION

---

## 1. Design Approach & Cultural Aesthetic
The user interface of the **Vedmurti Prashant Shriprasad Pathak (Guruji) Website** is intentionally designed around traditional Maharashtrian Vedic aesthetics. The visual identity reflects spiritual purity (शुचिता), dignity, and serenity. 

*(Note: This document reflects the CURRENT visual implementation. A complete premium redesign will be executed in a dedicated future phase.)*

---

## 2. Color Palette Specification

The color architecture is defined in `tailwind.config.ts`:

| Color Token | Hex Code | Visual Name | Semantic Usage |
| :--- | :--- | :--- | :--- |
| `ivory-50` | `#FDFCF9` | Pearl Ivory | Card backgrounds, header banner inner tint |
| `ivory-100` | `#FAF7F2` | Warm Ivory | Page background, content body default |
| `saffron-500`| `#E65100` | Sacred Saffron | Primary spiritual accent, active highlights |
| `saffron-700`| `#A63300` | Deep Saffron | Subheadings, section sub-titles |
| `maroon-800` | `#660F1A` | Temple Maroon | Primary action buttons, brand accents, footer |
| `maroon-950` | `#2F050A` | Deep Garnet | Top announcement bar, admin sidebar, primary headings |
| `gold-200` | `#F2E8CE` | Light Sand Gold | Pill badges, soft borders, subtle highlights |
| `gold-400` | `#D4AF37` | Antique Muted Gold | Card borders, spiritual dividers, Kalash icons |
| `gold-500` | `#C5A059` | Metallic Gold | Ornamental diamonds (❖), borders, badges |
| `charcoal-800`| `#2A2523` | Deep Charcoal | Primary reading text, body paragraphs |
| `charcoal-900`| `#1F1D1D` | Carbon Black | High-contrast body text, headings |

---

## 3. Typography System
- **Serif Heading Font:** `"Noto Serif Devanagari"`, `"Rozha One"`, `Georgia`, `serif`
  - Applied via `font-serif` to sacred mantras, Guruji's official title, section titles, and puja names.
  - Conveys scriptural gravitas and cultural authenticity in both Devanagari and Latin scripts.
- **Sans-Serif Body Font:** `"Poppins"`, `system-ui`, `sans-serif`
  - Applied via `font-sans` to body text, form labels, technical data, and administrative tables.
  - Ensures crisp legibility across high-DPI smartphone displays.

---

## 4. Header & Navigation Architecture

### 4.1 Top Announcement & Sacred Mantra Bar
- **Container:** `bg-maroon-950 text-gold-200 py-1.5 px-3 sm:px-6 border-b border-gold-500/30 flex items-center justify-center text-center`
- **Exact Verified Content:**
  $$\text{॥ श्री गणेशाय नमः ॥ ❖ ॥ श्री त्र्यंबकेश्वराय नमः ॥}$$
- **Desktop Behavior:** Enforces `whitespace-nowrap` on a single horizontal line.
- **Mobile Behavior:** Adaptive font sizing (`text-[10.5px] min-[400px]:text-xs sm:text-sm`) prevents text clipping or awkward wrapping.

### 4.2 Main Public Navbar (`Navbar.tsx`)
- **Branding Block:** Contains an ornate Om (`ॐ`) medallion (`w-10 h-10 rounded-full bg-gradient-to-tr from-maroon-900 to-saffron-600 border-2 border-gold-400`) and the compact name lockup:
  - `वे.मु. प्रशांत पाठक`
  - `(गुरुजी)`
- **Desktop Navigation:** Centered horizontal link row (`hidden xl:flex`) featuring 11 concise, authentic links (`मुख्यपृष्ठ`, `परिचय`, `पूजा विधी`, `बुकिंग`, `कार्यक्रम`, `दालन`, `व्हिडीओ`, `अभिप्राय`, `लेख`, `प्रश्नोत्तरे`, `संपर्क`).
- **Action Cluster:** Compact bilingual `LanguageSwitcher` pill and a highlighted "पूजा बुक करा" (Book Puja) CTA button.
- **Mobile Drawer:** Viewports below `1280px` collapse into an accessible hamburger menu (`xl:hidden`) opening a smooth full-height navigation drawer.

---

## 5. Component Patterns

### 5.1 Spiritual Divider (`SpiritualBorders.tsx`)
A custom visual divider featuring a centered traditional Kalash icon flanked by symmetrical dual gold accent lines, used to demarcate major section headers.

### 5.2 Puja Service Cards
- White rounded containers (`rounded-xl border border-gold-300/80 shadow-sm`) with soft hover elevation (`hover:shadow-md`).
- Header with Marathi and English service names, duration badge (`Clock` icon), and categorized tag.
- Direct CTA buttons routing to details (`/services/[id]`) and booking (`/book-puja?service=[id]`).

### 5.3 Form Design
- Input fields use soft ivory backgrounds with clear focus rings (`focus:ring-2 focus:ring-maroon-800`).
- Bilingual labels and validation prompts.
- Multi-column responsive layout adapting from 1 column on mobile to 2 columns on desktop.

### 5.4 Admin CMS Interface
- **Sidebar:** Fixed deep-garnet (`bg-maroon-950`) navigation panel with 16 categorized management tabs, active item indicator, and real-time unread notification count badge.
- **Data Tables:** Clear tabular layouts with hover rows, status badges (Green = Confirmed, Yellow = Pending, Blue = Completed, Red = Cancelled), and contextual action buttons (Edit, Delete, View).
- **Interactive Crop Modal (`ImageCropModal.tsx`):** Full-screen dark backdrop overlay with interactive panning, zooming, and aspect ratio preset toggles (4:5 portrait, 1:1 square).

---

## 6. Accessibility & Responsive Viewport Matrix

| Viewport Category | Width Range | Header Layout | Card Grids | Mobile Nav |
| :--- | :--- | :--- | :--- | :--- |
| Mobile Small | 360px – 480px | Centered compact mantra | 1 Column | Hamburger Drawer |
| Mobile Large / Tablet | 481px – 768px | Compact brand + switcher | 1 – 2 Columns | Hamburger Drawer |
| Tablet Landscape | 769px – 1024px | Compact brand + switcher | 2 – 3 Columns | Hamburger Drawer |
| Desktop Regular | 1025px – 1279px| Compact brand + switcher | 3 Columns | Hamburger Drawer |
| Desktop Wide | 1280px – 1600px| Full 11-link horizontal row | 3 – 4 Columns | Full Desktop Nav |

---
*UI/UX documentation audited against live component styling in `src/components` and `src/app`.*
