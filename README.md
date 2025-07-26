# Small Business Website Template

A modern, responsive Next.js template designed for small business websites with built-in internationalization, analytics tracking, and dark mode support.

## Features

- 🌍 **Type-safe Internationalization** - Compile-time validated translations (English/French)
- 📊 **Firebase Analytics** - Automatic visitor tracking and business action analytics
- 🎨 **shadcn/ui Components** - Modern, accessible UI components
- 🌙 **Dark Mode** - Theme toggle in the header
- 🌐 **Language Switcher** - Located in the footer for easy access
- 📱 **Responsive Design** - Mobile-first with hamburger menu
- 📄 **Pre-built Pages** - Home, Contact, and FAQ pages ready to use

## Template Structure

### Pages

1. **Home Page** (`/`)
   - Hero section with call-to-action buttons
   - Services showcase (3 service cards)
   - About section with contact buttons

2. **Contact Page** (`/contact`)
   - Contact information cards:
     - Address with map icon
     - Phone with click-to-call
     - Email with click-to-email
     - Business hours

3. **FAQ Page** (`/faq`)
   - Accordion-style questions and answers
   - Call-to-action section at the bottom

### Key Components

- **Header** - Navigation menu with mobile hamburger and dark mode toggle
- **Footer** - Business information, quick links, hours, and language switcher
- **Mobile Menu** - Collapsible navigation for mobile devices

## Getting Started

### Development Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Analytics Configuration
NEXT_PUBLIC_WEBSITE_ID=your-unique-website-uuid
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Translation System

The translation system is **compile-time validated**, ensuring no missing translations in production.

### Structure

Translation files are located in `lib/i18n/`:
- `types.ts` - TranslationProtocol interface defining the structure
- `en.ts` - English translations
- `fr.ts` - French translations
- `index.ts` - Main translation logic

### Adding New Translations

1. **Update the TranslationProtocol interface** in `lib/i18n/types.ts`:
```typescript
export interface TranslationProtocol {
  // ... existing sections
  newSection: {
    title: string;
    description: string;
  };
}
```

2. **Add translations to all language files**:
```typescript
// lib/i18n/en.ts
export const en = {
  // ... existing translations
  newSection: {
    title: "New Section",
    description: "This is a new section"
  }
} as const;

// lib/i18n/fr.ts
export const fr = {
  // ... existing translations
  newSection: {
    title: "Nouvelle Section",
    description: "Ceci est une nouvelle section"
  }
} as const;
```

### Using Translations in Components

```typescript
import { useTranslation } from '@/provider/language-provider';

export default function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t.home.hero.title}</h1>
      <p>{t.home.hero.subtitle}</p>
    </div>
  );
}
```

## Analytics System

### Automatic Tracking

The analytics system automatically tracks:
- **Page impressions** - Every page view (initial load and navigation)
- **Phone clicks** - All `tel:` links
- **Email clicks** - All `mailto:` links
- **External link clicks**

### Manual Event Tracking

The `useAnalytics` hook provides two functions:

```typescript
import { useAnalytics } from '@/lib/useAnalytics';

export default function Component() {
  const { logImpression, logTap } = useAnalytics();
  
  // Log impression (usually automatic, but can be called manually)
  useEffect(() => {
    logImpression(); // Logs current page impression
  }, []);
  
  // Log tap events for user interactions
  return (
    <button 
      onClick={() => logTap('hero_cta_click', { 
        button: 'get_started',
        page: 'home' 
      })}
    >
      Get Started
    </button>
  );
}
```

**Note**: Page impressions are tracked automatically by the `AnalyticsProvider` on route changes. You only need to call `logImpression()` manually for special cases like modal views or virtual pages.

### Common Analytics Events

```typescript
// Service card clicks
logTap('service_click', { service: 'consulting' });

// FAQ interactions
logTap('faq_question_click', { question: 'What services...', index: 0 });

// Contact actions
logTap('contact_form_submit', formData);
logTap('contact_phone_click', { phone: '+1234567890' });

// Navigation
logTap('mobile_menu_toggle', { action: 'open' });
```

## Theme System

### Dark Mode Toggle

The dark mode toggle is located in the header. It uses `next-themes` for persistence across page reloads.

### Language Switcher

The language switcher is located in the footer. It automatically:
- Detects browser language on first visit
- Persists language choice in localStorage
- Updates all text content instantly

## Customization Guide

### Updating Business Information

1. **Company Name**: Update in `lib/i18n/en.ts` and `lib/i18n/fr.ts`:
```typescript
brand: {
  name: "Your Business Name",
  description: "Your business description"
}
```

2. **Contact Information**: Update in translation files:
```typescript
footer: {
  address: "Your Address",
  phone: "+1 (555) 123-4567",
  email: "contact@yourbusiness.com",
  hours: {
    weekdays: "Mon - Fri: 9:00 AM - 6:00 PM",
    weekends: "Sat - Sun: Closed"
  }
}
```

3. **Services**: Modify the services section in translation files
4. **FAQ**: Update the questions array in translation files

### Adding New Pages

1. Create a new file in `app/[page-name]/page.tsx`
2. Add navigation link in `components/header.tsx`
3. Add translations for the new page in `lib/i18n/types.ts` and language files

## File Structure

```
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home page
│   ├── contact/
│   │   └── page.tsx        # Contact page
│   └── faq/
│       └── page.tsx        # FAQ page
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── analytics-provider.tsx
│   ├── header.tsx          # Navigation header
│   ├── footer.tsx          # Site footer
│   └── language-picker.tsx # Language switcher
├── lib/
│   ├── i18n/              # Translation system
│   │   ├── types.ts       # TranslationProtocol interface
│   │   ├── index.ts       # Main i18n logic
│   │   ├── en.ts          # English translations
│   │   └── fr.ts          # French translations
│   ├── analytics.ts       # Analytics SDK
│   ├── useAnalytics.ts    # Analytics React hook
│   └── firebase.ts        # Firebase configuration
└── provider/
    └── language-provider.tsx # Language context
```

## SEO Strategy for AI Agents

### **🎨 Creative Freedom + Technical Rules**

**✅ YOU CAN CUSTOMIZE EVERYTHING:**
- Transform this into ANY business type (pizzeria, law firm, dentist, salon, etc.)
- Update pages, content, design, colors, layout as needed
- Add/remove sections, modify services, change the entire business focus
- Create industry-specific content (menu items, legal services, medical procedures, etc.)

**🚨 BUT ALWAYS FOLLOW THESE RULES:**

1. **Translation System (CRITICAL):** 
   - MUST update BOTH `en.ts` AND `fr.ts` with identical structure
   - Build WILL FAIL if translations don't match the TypeScript interface
   - Add new translation keys to `lib/i18n/types.ts` first, then both language files

2. **SEO Requirements:**
   - Update ALL instances of "ABC Business Solutions" and placeholder content
   - Change domain from `example.com` to real domain in structured data
   - Keep the metadata export pattern in each page file

3. **File Structure:**
   - Don't rename core files (`robots.ts`, `sitemap.ts`, `manifest.ts`)
   - Keep the client/server component pattern for pages with metadata

### **🎯 What to Update When Creating a New Business Website:**

#### **1. Business Information (Required)**
Update these files with actual business details:

**`lib/i18n/en.ts` and `lib/i18n/fr.ts`:**
```typescript
brand: {
  name: "Your Actual Business Name",
  description: "Your actual business description"
},
footer: {
  address: "Real business address",
  phone: "Real phone number", 
  email: "Real email address",
  // Update business hours to match actual hours
}
```

**`public/llms.txt`:** Replace ALL placeholder content with real business info
- Business name, services, contact details
- Accurate address and hours
- Real description of what the business does

#### **2. Domain & SEO Settings (Required)**
**`lib/structured-data.ts`:** Change ALL `https://example.com` to actual domain
**`lib/metadata.ts`:** Update `siteUrl` with real domain
**`.env`:** Add `NEXT_PUBLIC_SITE_URL=https://yourdomain.com`

#### **3. Page Content (Required)**
Update all business-specific content in translation files:
- Services descriptions to match actual services
- FAQ questions/answers relevant to the business
- Contact form messages and success text

#### **4. Page Metadata (Required)**
Each page exports metadata - update titles/descriptions in:
- `app/page.tsx` - Home page metadata
- `app/contact/page.tsx` - Contact page metadata  
- `app/faq/page.tsx` - FAQ page metadata

#### **5. Social Media (Optional)**
**`lib/metadata.ts`:** Update Twitter handle from `@abcbusiness` to real handle

#### **6. Images (Required for Production)**
Add these files to `/public/` directory:
- `favicon.ico`, `apple-touch-icon.png` 
- `og-image.png` (1200x630) for social sharing
- Business logo and photos

### **🔄 SEO Files That Update Automatically:**
These files are generated automatically and need NO changes:
- `/robots.txt` - Auto-generated from `app/robots.ts`
- `/sitemap.xml` - Auto-generated from `app/sitemap.ts`  
- `/manifest.webmanifest` - Auto-generated from `app/manifest.ts`

### **🎯 Quick Checklist for AI Agents:**
1. ✅ **Customize the business** (pizzeria, lawyer, etc.) - content, design, pages
2. ✅ **Update translations** - BOTH `en.ts` AND `fr.ts` with identical structure
3. ✅ **Replace ALL placeholder content** - business name, services, contact info
4. ✅ **Update `public/llms.txt`** with real business details
5. ✅ **Change `example.com`** to real domain in structured data files
6. ✅ **Update page metadata** titles/descriptions for the new business type
7. ✅ **Add business images** to `/public/` directory
8. ✅ **Test build** with `npm run build` to ensure translations are valid
9. ✅ **Verify SEO files** by visiting `/robots.txt`, `/sitemap.xml`, `/llms.txt`

### **🚫 Don't Touch These Files:**
- `app/robots.ts`, `app/sitemap.ts`, `app/manifest.ts` - Already optimized
- SEO component files - Already configured
- Structured data schemas - Already set up correctly

**The template is fully SEO-optimized. Just update the business content!**