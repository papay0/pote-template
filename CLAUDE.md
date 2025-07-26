# Small Business Website Template - AI Agent Instructions

## 🎯 Project Overview
This is a Next.js template for small business websites with SEO optimization, internationalization, and analytics.

## 🚨 CRITICAL RULES - NEVER BREAK THESE

### Translation System (BUILD WILL FAIL IF IGNORED)
- **ALWAYS update BOTH** `lib/i18n/en.ts` AND `lib/i18n/fr.ts` with identical structure
- **FIRST** add new keys to `lib/i18n/types.ts`, **THEN** add to both language files
- **NO EXCEPTIONS** - missing translations cause TypeScript build failures

### SEO Requirements
- Replace ALL instances of "ABC Business Solutions" with real business name
- Change ALL `https://example.com` to actual domain in `lib/structured-data.ts`
- Update `lib/metadata.ts` siteUrl and siteName variables
- Keep metadata export pattern in each page file

### File Structure (DO NOT RENAME)
- `app/robots.ts`, `app/sitemap.ts`, `app/manifest.ts` - Auto-generate SEO files
- Keep client/server component pattern for pages with metadata

## 🎨 Creative Freedom
- Transform into ANY business type (pizzeria, law firm, dentist, salon, etc.)
- Modify pages, content, design, colors, layout completely
- Add/remove sections, change business focus entirely
- Create industry-specific content (menus, services, procedures, etc.)

## 📋 Required Updates Checklist

### 1. Business Content
```typescript
// lib/i18n/en.ts AND lib/i18n/fr.ts
brand: {
  name: "Real Business Name",
  description: "Real business description"
},
footer: {
  address: "Real address",
  phone: "Real phone", 
  email: "Real email"
}
```

### 2. Domain Settings
- `lib/structured-data.ts` - Change example.com to real domain
- `lib/metadata.ts` - Update siteUrl variable
- `.env` - Add `NEXT_PUBLIC_SITE_URL=https://realdomain.com`

### 3. Page Metadata
- `app/page.tsx` - Export metadata with real business info
- `app/contact/page.tsx` - Export metadata for contact page
- `app/faq/page.tsx` - Export metadata for FAQ page

### 4. SEO Content
- `public/llms.txt` - Replace ALL placeholder content with real business info

## ⚡ Common Commands
- `npm run dev` - Start development server
- `npm run build` - Build and validate translations
- `npm run lint` - Check code style

## 🔍 Testing & Validation
- **ALWAYS run** `npm run build` after translation changes
- Visit `/robots.txt`, `/sitemap.xml`, `/llms.txt` to verify SEO files
- Test mobile responsive design
- Verify dark mode toggle and language switcher work

## 📁 Key Files Structure
```
app/
├── layout.tsx          # Root layout with providers
├── page.tsx            # Home page with metadata export
├── contact/page.tsx    # Contact page with metadata export
├── faq/page.tsx        # FAQ page with metadata export
├── robots.ts           # Auto-generates /robots.txt
├── sitemap.ts          # Auto-generates /sitemap.xml
└── manifest.ts         # Auto-generates /manifest.webmanifest

lib/i18n/
├── types.ts            # Translation interface (update FIRST)
├── en.ts               # English translations
├── fr.ts               # French translations (MUST match en.ts)
└── index.ts            # Translation logic

components/
├── header.tsx          # Navigation with dark mode toggle
├── footer.tsx          # Footer with language switcher
└── ui/                 # shadcn/ui components
```

## 🚫 DO NOT MODIFY
- SEO component files (already optimized)
- Core translation system logic
- Analytics provider setup
- Structured data schemas (just update URLs)

## 💡 Analytics Usage
```typescript
const { logTap, logImpression } = useAnalytics();

// Track user interactions
logTap('button_click', { button: 'hero_cta', page: 'home' });

// Impressions tracked automatically, manual only for special cases
logImpression(); // Usually not needed
```

## 🎨 Component Patterns
- Use `"use client"` for interactive components
- Server Components for pages with metadata exports
- Import from `@/components/ui/` for UI elements
- Use `useTranslation()` hook for all text content

## ⚠️ Common Mistakes to Avoid
- Adding text without translations (build fails)
- Forgetting to update French translations
- Breaking the metadata export pattern
- Renaming auto-generated SEO files
- Not testing the build after changes

## 🎯 Success Criteria
1. ✅ `npm run build` passes without errors
2. ✅ All text is translated in both languages
3. ✅ Business info replaced throughout
4. ✅ SEO files accessible at `/robots.txt`, `/sitemap.xml`, `/llms.txt`
5. ✅ Mobile responsive and dark mode functional