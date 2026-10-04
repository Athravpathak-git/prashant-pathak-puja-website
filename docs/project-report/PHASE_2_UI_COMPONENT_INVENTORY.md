# PHASE 2: UI/UX COMPONENT INVENTORY & LIQUID GLASS SPECIFICATIONS
## Vedmurti Prashant Shriprasad Pathak (Guruji) — Puja & Religious Services Website
### Application Identifier: `prashant_pathak_guruji_website`

---

### 1. Liquid Glass Design System Specifications

The design system fuses **Traditional Vedic Aesthetics** with modern **Liquid Glassmorphism**:

#### 1.1 Color Tokens & Material Palettes
- **Sacred Primary Maroon**: `#651C24` / `#5A1720` (Refined Deep Garnet)
- **Dark Surface**: `#321116` / `#421218` (Temple Sanctum Dark)
- **Sacred Ochre Saffron**: `#C86B24` (Auspicious Haldi-Kumkum Saffron)
- **Antique Gold**: `#B58A3A`, `#D8B96A` (Pure Brass/Gold Temple Trims)
- **Text Primary**: `#282321` / `#24211E` (Warm Charcoal)
- **Text Muted**: `#6F625A` (Soft Sandstone)
- **Sacred Ivory**: `#FAF7F0` (Warm Sacred Ivory Base)
- **Temple Cream**: `#F3E8D0` (Pooja Asana Warm Cream)

#### 1.2 Glass Material Tokens
- `glass-white`: `rgba(255, 255, 255, 0.58)`
- `glass-ivory`: `rgba(250, 247, 240, 0.68)`
- `glass-maroon`: `rgba(90, 23, 32, 0.10)`
- `glass-dark`: `rgba(50, 17, 22, 0.85)`
- `gold-border`: `rgba(184, 148, 74, 0.38)`
- `gold-border-rich`: `rgba(184, 148, 74, 0.55)`

---

### 2. Core Reusable Component Library

#### 2.1 Liquid Glass Components (`src/components/LiquidGlassSystem.tsx`)

| Component | Props / Variants | Description & Visual Effect |
| :--- | :--- | :--- |
| `GlassCard` | `variant: 'white' \| 'ivory' \| 'dark' \| 'maroon'`, `hoverEffect: boolean`, `padding: string` | Container featuring multi-layered backdrop blur (14px), subtle hairline border in antique gold, and a specular glare reflection along the upper rim. |
| `GlassButton` | `variant: 'primary' \| 'gold' \| 'secondary' \| 'ghost'`, `size: 'sm' \| 'md' \| 'lg'`, `loading: boolean`, `icon: ElementType` | Elegant pill-shaped action button with smooth hover elevation, soft gold rim glow, and integrated spiritual loading spinners. |
| `GlassInput` | `label: string`, `error: string`, `icon: ElementType` | Form field with translucent glass background, subtle gold focus ring, accessible typography, and integrated iconography. |
| `GlassBadge` | `variant: 'gold' \| 'maroon' \| 'saffron' \| 'white'`, `size: 'sm' \| 'md'` | Micro pill badge adorned with sacred `❖` diamond separator. |
| `GlassStatCard` | `value: string \| number`, `label: string`, `sublabel?: string`, `icon?: ElementType` | Metric dashboard card highlighting numeric counters in majestic Devanagari typography. |
| `GlassEmptyState`| `title: string`, `description: string`, `action?: ReactNode` | Culturally sensitive empty state container featuring an Om medallion and gold divider. |
| `GlassLoadingState`| `message?: string` | Spiritual spinning ring and pulsing Om symbol inside a frosted glass enclosure. |
| `GlassSection` | `containerClassName?: string` | Semantic section wrapper enforcing consistent responsive padding across viewports. |
| `GlassTable` | `children: ReactNode` | Frosted table wrapper providing clean border lines, high-contrast text, and subtle row hover highlights. |

#### 2.2 Vedic Architectural System (`src/components/VedicDesignSystem.tsx`)

| Component | Props / Variants | Description & Usage |
| :--- | :--- | :--- |
| `TempleArchFrame`| `children: ReactNode` | Palatial arched frame with gold corner filigree and sacred diamond insets. Used for Guruji's official photograph. |
| `VedicSectionHeader`| `eyebrow?: string`, `badge?: string`, `title: string`, `subtitle?: string`, `align?: 'center' \| 'left'`, `variant?: 'kalash' \| 'diya' \| 'diamond'` | Standardized section header with sacred Devanagari serif font and gold hairlines. |
| `VedicDivider` | `variant?: 'kalash' \| 'diya' \| 'diamond' \| 'flower'` | Editorial divider featuring dual horizontal hairlines tapering out from a central temple motif. |
| `VedicBadge` | `variant?: 'gold' \| 'saffron' \| 'maroon' \| 'ivory'` | Traditional pill badge with warm spiritual background colors. |
| `OmMedallion` | `size?: 'sm' \| 'md' \| 'lg'` | Brass-accented radial medallion with Devanagari `ॐ`. |
| `DiyaIcon` | Hand-drawn SVG | Ceremonial brass oil lamp motif with auspicious flame. |
| `KalashIcon` | Hand-drawn SVG | Sacred temple pot crowned with coconut and mango leaves. |

---

### 3. Navigation & Footer Components

#### 3.1 Public Header & Navbar (`src/components/Navbar.tsx`)
- **Sacred Mantra Bar**: Exact text `|| श्री गणेशाय नमः ||❖|| श्री त्र्यंबकेश्वराय नमः ||` on desktop.
- **Guruji Branding Block**: Compact Om medallion + Guruji's name `वे.मु. प्रशांत पाठक` and subtitle `(गुरुजी)`.
- **Navigation Links**: 11 links with active pill states and subtle gold hover feedback.
- **Language Switcher**: Liquid Glass dropdown supporting 7 languages.
- **Puja Booking CTA**: Gold-bordered primary maroon button.

#### 3.2 Public Footer (`src/components/Footer.tsx`)
- **Maha Mrityunjaya Mantra Ribbon**: Full Sanskrit verse on charcoal ribbon.
- **4-Column Grid**: Comprehensive bio, quick links, key rituals, and official WhatsApp card (`@PrashantPathakGuruji`).
- **Admin Access Link**: Discreet Lock icon + "प्रशासक (Admin)" link in the bottom bar with keyboard and screen reader accessibility.

---

### 4. Public Page Layouts

1. **Homepage (`/`)**: 11 rich sections combining hero, Guruji lineage, 14 major puja cards, why choose us, upcoming events, photo gallery, devotee testimonials, FAQs, and booking CTA.
2. **About Guruji (`/about`)**: Lineage, Vedic credentials, ancestral tradition, code of conduct, and auspicious timings.
3. **Services (`/services`)**: Filterable catalog of 14 traditional pujas and Sanskars with required materials and guidance.
4. **Service Detail (`/services/[id]`)**: Deep dive into ritual significance, duration, items required, and booking trigger.
5. **Book Puja (`/book-puja`)**: Intuitive multi-field booking form with service selection, date picker, attendee count, and instant reference number generation.
6. **Gallery (`/gallery`)**: Filterable photo grid featuring sacred ceremonies, havans, and temple celebrations.
7. **Events (`/events`)**: Auspicious festivals, upcoming Mahaparvas, and community pujas.
8. **Videos (`/videos`)**: Curated holy chants, puja highlights, and Vedic mantras.
9. **Testimonials (`/testimonials`)**: Heartfelt reflections and blessings from host families.
10. **Blog (`/blog` & `/blog/[id]`)**: Educational articles on Shastrokta Vidhi, Muhurats, and Griha Shanti.
11. **FAQ (`/faq`)**: Common questions regarding samagri, muhurat, dakshina, and bookings.
12. **Contact (`/contact`)**: Headquarters in Nagpur, contact form, official WhatsApp redirect.

---

### 5. Multilingual Localization Inventory

Translations are synchronized across all 7 supported languages in `src/lib/locales/`:
- `mr.json`: Marathi (148 keys)
- `en.json`: English (148 keys)
- `hi.json`: Hindi (148 keys)
- `te.json`: Telugu (148 keys)
- `kn.json`: Kannada (148 keys)
- `ta.json`: Tamil (148 keys)
- `ml.json`: Malayalam (148 keys)
