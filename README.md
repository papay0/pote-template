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

## SEO Optimization

This template includes comprehensive SEO optimizations:

### Search Engine Optimization
- **Structured Data (JSON-LD)**: Organization, LocalBusiness, WebSite, FAQ, and Breadcrumb schemas
- **Meta Tags**: Dynamic titles, descriptions, keywords, and Open Graph tags
- **Sitemap**: Auto-generated XML sitemap with language variations
- **Robots.txt**: Configured for optimal crawling with AI bot allowances
- **Canonical URLs**: Proper canonicalization and hreflang tags

### AI/LLM Optimization
- **llms.txt**: AI-readable site summary at `/llms.txt` for better LLM understanding
- **Structured content**: Clear hierarchy and semantic markup for AI comprehension

### Technical SEO
- **Web App Manifest**: PWA-ready configuration
- **Performance**: Font display swap, optimized loading
- **Accessibility**: ARIA labels, semantic HTML5 elements
- **Mobile-first**: Responsive design with proper viewport settings

### Social Media
- **Open Graph**: Facebook, LinkedIn sharing optimization
- **Twitter Cards**: Optimized Twitter sharing with large images
- **Rich Snippets**: Enhanced search result appearance

## Best Practices

1. **Always add translations** to both language files when adding new text
2. **Use semantic HTML** for better SEO and accessibility
3. **Track meaningful events** that provide business insights
4. **Test on mobile devices** to ensure responsive design works
5. **Keep the footer copyright year dynamic** using JavaScript
6. **Add proper images** to `/public/` directory (see `.gitkeep` for requirements)
7. **Update URLs** in structured data files to match your domain

This template provides a professional, SEO-optimized foundation for small business websites with all essential features built-in.