# PHASE 2: UI/UX COMPONENT & DESIGN SYSTEM INVENTORY
## Vedmurti Prashant Pathak (Guruji) Website

---

### 1. Design Tokens & Styling Primitives (`tailwind.config.ts` & `globals.css`)

```css
/* Color System Tokens */
--color-ivory: #FAF7F0;     /* Page Backgrounds & Cards */
--color-cream: #F3E8D0;     /* Warm Secondary Surfaces */
--color-maroon: #651C24;    /* Primary Sacred Header & Accents */
--color-maroon-dark: #421218;/* Sidebar & Deep Gradients */
--color-saffron: #C86B24;   /* Auspicious Accents & Highlights */
--color-gold: #B58A3A;      /* Borders, Hairlines & Badges */
--color-gold-light: #D8B96A;/* Button Highlights & Filigree */
--color-charcoal: #24211E;  /* High-legibility Body Text */
```

#### Custom CSS Utility Classes
- `.bg-jali-pattern`: Auspicious sacred geometry jali lattice overlay.
- `.bg-jali-subtle`: Subtle opacity jali lattice for section backgrounds.
- `.gold-hairline`: Thin 1px gradient hairline border with gold shimmer.
- `.gold-gradient-text`: Text gradient using antique gold hues.
- `.maroon-gradient-text`: Text gradient using deep garnet maroon tones.
- `.arch-frame`: Arched top container with smooth curvature.
- `.shadow-temple-card`: Refined warm shadow for sacred cards.
- `.shadow-temple-hover`: Elevated hover shadow for interactive components.

---

### 2. Design System Components (`src/components/VedicDesignSystem.tsx`)

| Component | Props | Description |
| :--- | :--- | :--- |
| `DiyaIcon` | `className?: string` | Hand-crafted SVG flame and diya lamp vector with warm saffron styling. |
| `KalashIcon` | `className?: string` | Traditional sacred kalash vessel vector with coconut, mango leaves, and swastika base. |
| `VedicDivider` | `className?: string`, `variant?: 'kalash' \| 'diya' \| 'diamond' \| 'flower'` | Dual horizontal gold hairlines tapering outwards with center sacred emblem. |
| `VedicSectionHeader` | `eyebrow?: string`, `badge?: string`, `title: string`, `subtitle?: string`, `align?: 'center' \| 'left'`, `variant?: string` | Standardized editorial header with Devanagari typography, eyebrow ribbons, and divider. |
| `TempleArchFrame` | `children: React.ReactNode`, `className?: string` | Palatial temple arch frame with gold borders and radial corner filigree. |
| `VedicBadge` | `children: React.ReactNode`, `variant?: 'gold' \| 'maroon' \| 'saffron'`, `className?: string` | Cultural badge for Shastrokta accreditation, categories, and tags. |
| `OmMedallion` | `size?: 'sm' \| 'md' \| 'lg'`, `className?: string` | Circular gradient medallion with sacred `ॐ` and subtle pulsing aura. |

---

### 3. Shared Global Components

| File | Type | Functionality |
| :--- | :--- | :--- |
| `src/components/Navbar.tsx` | Client Component | Top sacred banner with exact mantra, compact Guruji brand block, 11 navigation links, language switcher, Book Puja CTA, and responsive mobile drawer. |
| `src/components/Footer.tsx` | Client Component | Maha Mrityunjaya mantra ribbon, 4-column link directory, official WhatsApp identity (`@PrashantPathakGuruji`), and admin portal entrance. |
| `src/components/LanguageSwitcher.tsx` | Client Component | Pill toggle button supporting English and Marathi translations seamlessly. |
| `src/components/FloatingWhatsApp.tsx` | Client Component | Floating action button routing to `/api/whatsapp` with privacy tooltip `@PrashantPathakGuruji`. |
| `src/components/ImageCropModal.tsx` | Client Component | Canvas-based image cropper with zoom, pan, and aspect ratio controls for Guruji's official photos. |

---

### 4. Public Page Client Controllers

| Route | Main Component | Structure & Sections |
| :--- | :--- | :--- |
| `/` | `src/components/HomePageClient.tsx` | 11 Sections: Hero (TempleArchFrame), Guruji Intro, Services Showcase, Vedic Pillars, Booking Process, Events, Gallery, Testimonials, Blog, FAQ, and Final CTA. |
| `/about` | `src/components/AboutClient.tsx` | Lineage & Bio card with TempleArchFrame, Puja categories, Scriptural principles, and consultation CTAs. |
| `/services` | `src/app/services/page.tsx` | Category filter chips, real-time search input, 3-column card grid with duration and direct booking links. |
| `/services/[id]` | `src/app/services/[id]/page.tsx` | Individual ceremony detail, significance, step-by-step procedure, required samagri list, and related pujas. |
| `/book-puja` | `src/app/book-puja/page.tsx` | Grouped 4-part form, instant reference generator (`PUJA-YYYY-XXXXXX`), and WhatsApp notification bridge. |
| `/gallery` | `src/app/gallery/page.tsx` | Category filter, 4-column responsive grid, and fullscreen lightbox modal with next/prev navigation. |
| `/events` | `src/app/events/page.tsx` | Chronological event cards with date badges, location, and participation booking link. |
| `/videos` | `src/app/videos/page.tsx` | Grid of video cards with YouTube thumbnail and embedded player modal. |
| `/testimonials` | `src/app/testimonials/page.tsx` | Devotee review cards with 5-star ratings and interactive submission form. |
| `/blog` | `src/app/blog/page.tsx` | 2-column editorial article feed with category tags, date, and excerpt. |
| `/blog/[id]` | `src/app/blog/[id]/page.tsx` | Article reader with high-readability typography and embedded booking invitation banner. |
| `/faq` | `src/app/faq/page.tsx` | Searchable accordion with expandable Q&A items. |
| `/contact` | `src/app/contact/page.tsx` | Guruji official location card, WhatsApp badge, hours, and direct inquiry form. |

---

### 5. Admin CMS Pages

| Route | Purpose | Key UI Elements |
| :--- | :--- | :--- |
| `/admin` | Main Dashboard | 4 Metrics cards, quick actions toolbar, recent bookings table, and live notifications feed. |
| `/admin/layout.tsx` | Layout & Navigation | Deep maroon gradient sidebar with gold trim, unread badges, top bar with logout. |
| `/admin/bookings` | Bookings Management | Search/status filter, bookings table, and detail panel with status update and admin notes. |
| `/admin/services` | Services Management | CRUD management for all 14+ Vedic ceremonies with pricing, duration, and descriptions. |
| `/admin/profile` | Profile & Photo Studio | Dual-language bio editor and image uploader with interactive `ImageCropModal`. |
| `/admin/gallery` | Gallery Management | Photo upload, categorization, and public display toggling. |
| `/admin/media` | Media Library | Centralized asset browser for all uploaded images and documents. |
| `/admin/events` | Events Management | Event scheduler with dates, times, and venue locations. |
| `/admin/testimonials` | Testimonial Moderation | Approval/rejection workflow for public reviews. |
| `/admin/blog` | Blog CMS | Article authoring tool with Marathi & English markdown support. |
| `/admin/faqs` | FAQ Management | Q&A editor for common devotee questions. |
| `/admin/notifications` | Notifications Center | System notifications with unread state tracking and mark-as-read actions. |
| `/admin/audit-logs` | Security Logs | Immutable log of administrative logins, edits, and deletions. |
| `/admin/security` | Admin Credentials | Password change and session management. |
| `/admin/settings` | Website Settings | WhatsApp handle, site title, and contact configuration. |
