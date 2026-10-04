# PROJECT REPORT 09: INTERNATIONALIZATION (i18n) ARCHITECTURE

---

## 1. Executive Summary & Supported Locales
The **Vedmurti Prashant Shriprasad Pathak (Guruji) Website** implements a dedicated bilingual internationalization architecture natively within React and Next.js.
- **Primary Locale:** **Marathi (`mr`)** — The traditional language of Maharashtra and the primary medium for Vedic devotional services.
- **Secondary Locale:** **English (`en`)** — The auxiliary language enabling access for non-Marathi devotees, non-resident patrons, and administrative operations.
- **Text Directionality:** Left-to-Right (LTR) for both supported locales.

---

## 2. i18n System Architecture

```mermaid
graph TD
    Client[Browser Client] -->|Reads Cookie pp_language / localStorage| Provider[LanguageProvider / Context API]
    Provider -->|Provides language, t(), getLocalized()| UIComponents[UI Components & Pages]
    
    subgraph Dictionaries [Static Dictionary Layer]
        MR_JSON[mr.json: 150+ Structured Keys]
        EN_JSON[en.json: 150+ Structured Keys]
    end

    subgraph DatabaseLayer [Dynamic Database Layer]
        DualColumns[(Database Records: field_mr & field_en)]
    end

    Provider --> MR_JSON
    Provider --> EN_JSON
    UIComponents -->|t('nav.services')| Dictionaries
    UIComponents -->|getLocalized(service, 'name')| DatabaseLayer
```

---

## 3. Translation Delivery Mechanism

### 3.1 Static UI Text Translations (`t()`)
Static interface labels (navigation links, button text, mantras, section headers, form validation hints) are managed via structured JSON dictionaries in `src/lib/locales/`:
- `mr.json`: Native Marathi translations authored in pure Devanagari script.
- `en.json`: Professional English translations.

The `t(path, fallback)` helper resolves dot-notated paths (e.g., `t('nav.book_puja')`, `t('hero.cta_whatsapp')`).

### 3.2 Dynamic Database Content Translations (`getLocalized()`)
Content stored in the PostgreSQL database utilizes a parallel dual-column naming convention:
- Services: `name_mr` / `name_en`, `short_desc_mr` / `short_desc_en`, `materials_mr` / `materials_en`
- Categories: `name_mr` / `name_en`
- Events: `title_mr` / `title_en`, `description_mr` / `description_en`
- Blog Posts: `title_mr` / `title_en`, `content_mr` / `content_en`
- FAQs: `question_mr` / `question_en`, `answer_mr` / `answer_en`
- Testimonials: `comment_mr` / `comment_en`, `author_name_mr` / `author_name_en`

The `getLocalized(item, field)` helper dynamically selects the appropriate column:
```typescript
export const getLocalized = (item: any, field: string): string => {
  if (!item) return '';
  const currentLangKey = `${field}_${language}`;
  const altLangKey = language === 'mr' ? `${field}_en` : `${field}_mr`;

  if (item[currentLangKey] && String(item[currentLangKey]).trim() !== '') {
    return String(item[currentLangKey]);
  }
  if (item[altLangKey] && String(item[altLangKey]).trim() !== '') {
    return String(item[altLangKey]);
  }
  return '';
};
```

---

## 4. State Persistence & Fallback Handling
1. **Initial Resolution:** On mount, `LanguageProvider` inspects `localStorage.getItem('pp_preferred_language')`. If absent, it checks document cookies (`pp_language`).
2. **Default Fallback:** Defaults gracefully to Marathi (`mr`).
3. **Persistence:** When toggled via `setLanguage(lang)`:
   - Updates React Context state instantly across all mounted components.
   - Saves selection to `localStorage`.
   - Writes `pp_language=<lang>; path=/; max-age=31536000; SameSite=Lax` cookie, ensuring server components can read the user's preference on subsequent SSR requests.
4. **Missing Key Cascading Fallback:** If a key is missing in the active locale, the system cascades:
   $$\text{Active Locale} \longrightarrow \text{English (en)} \longrightarrow \text{Marathi (mr)} \longrightarrow \text{Raw Path String}$$

---

## 5. Language Switcher Component (`LanguageSwitcher.tsx`)
Rendered in the public navbar and mobile drawer as a stylized pill toggle:
- Highlights the active language with gold background (`bg-gold-200 text-maroon-900 font-bold`).
- Compact size ensuring zero layout shift or navbar overflow on small mobile displays.

---
*Internationalization architecture verified against `src/lib/i18n.tsx` and locales.*
