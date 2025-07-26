# Pote AI Website Template

This is a [Next.js](https://nextjs.org) template designed for AI-generated business websites with built-in internationalization and analytics tracking.

## Features

- 🌍 **Type-safe Internationalization** - Compile-time validated translations
- 📊 **Firebase Analytics** - Automatic visitor and business action tracking
- 🎨 **shadcn/ui Components** - Modern, accessible UI components
- 🌙 **Dark Mode** - Theme switching with next-themes
- 📱 **Responsive Design** - Mobile-first responsive layout

## Getting Started

### Development Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
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

### Adding New Languages

1. **Update the TranslationProtocol interface** in `lib/i18n/index.ts`:
```typescript
export interface TranslationProtocol {
  home: {
    getStarted: string;
    saveAndSee: string;
    // Add new keys here
    newKey: string;
  };
  // Add new sections here
  newSection: {
    title: string;
    description: string;
  };
}
```

2. **Add new language files** in `lib/i18n/`:
```typescript
// lib/i18n/es.ts
export const es = {
  home: {
    getStarted: "Comienza editando",
    saveAndSee: "Guarda y ve tus cambios al instante.",
    newKey: "Nueva traducción"
  },
  newSection: {
    title: "Título",
    description: "Descripción"
  }
} as const;
```

3. **Update the main i18n file**:
```typescript
// lib/i18n/index.ts
import { es } from './es';

export type Locale = 'en' | 'fr' | 'es'; // Add new locale

// Validate new translation
const _validateEs: TranslationProtocol = es;

export const translations = {
  en: _validateEn,
  fr: _validateFr,
  es: _validateEs, // Add new translation
} as const;
```

### Using Translations in Components

```typescript
import { useTranslation } from '@/provider/language-provider';

export default function MyComponent() {
  const { t, locale } = useTranslation();
  
  return (
    <div>
      <h1>{t.home.getStarted}</h1>
      <p>{t.newSection.description}</p>
      <p>Current locale: {locale}</p>
    </div>
  );
}
```

**Important**: The translation system is **compile-time validated**. If you add a key to the `TranslationProtocol` interface, you MUST add it to all language files or the build will fail. This ensures no missing translations in production.

## Analytics System

### Basic Setup

The analytics system automatically tracks:
- Page views with scroll depth and time on page
- Phone number clicks (`tel:` links)
- Email clicks (`mailto:` links)
- Form submissions
- External link clicks
- User sessions with device info

### Manual Event Tracking

```typescript
import { useAnalytics } from '@/lib/useAnalytics';
import { Source, EventType } from '@/lib/analytics-types';

export default function ContactSection() {
  const { logEvent } = useAnalytics(process.env.NEXT_PUBLIC_WEBSITE_ID || "");
  
  return (
    <div>
      {/* Automatic tracking - no code needed */}
      <a href="tel:+1234567890">Call Now</a>
      <a href="mailto:contact@business.com">Email Us</a>
      
      {/* Manual event tracking with enums */}
      <button 
        onClick={() => logEvent('cta_click', Source.HeroSection, EventType.Tap, { 
          button: 'hero_cta',
          value: 'get_started' 
        })}
      >
        Get Started
      </button>
      
      <button 
        onClick={() => logEvent('download_brochure', Source.ServicesPage, EventType.Tap, { 
          document: 'company_brochure.pdf' 
        })}
      >
        Download Brochure
      </button>
    </div>
  );
}
```

### Custom Event Types

You can track any business-specific events with structured enums:

```typescript
// Track appointment bookings
logEvent('appointment_booked', Source.ContactPage, EventType.Submit, { 
  service: 'consultation',
  date: '2024-01-15',
  value: 150 
});

// Track quote requests
logEvent('quote_requested', Source.ServicesPage, EventType.Submit, { 
  service: 'home_renovation',
  location: 'kitchen' 
});

// Track social media clicks
logEvent('social_click', Source.Footer, EventType.Tap, { 
  platform: 'facebook',
  location: 'footer' 
});

// Track content impressions
logEvent('testimonial_view', Source.HomeScreen, EventType.Impression, {
  testimonialIndex: 2,
  section: 'testimonials'
});
```

### Data Structure

Analytics data is stored in Firestore under `/analytics/{websiteId}/` with three sub-collections:

- **`sessions`** - User sessions with device info, location, referrer
- **`pageviews`** - Individual page visits with time spent and scroll depth  
- **`events`** - Business actions with source/type classification (phone calls, emails, form submissions, impressions)

## AI Agent Instructions

### For Website Generation:

1. **Environment Variables**: Always set `NEXT_PUBLIC_WEBSITE_ID` to a unique UUID for each generated website
2. **Translations**: Add business-specific content to the `TranslationProtocol` interface and all language files
3. **Analytics**: Use `logEvent(eventType, source, type, metadata)` for important business actions with proper enum classification
4. **Components**: Build using shadcn/ui components for consistency

### Translation Workflow:

1. Define new keys in `TranslationProtocol` interface
2. Add translations to all language files (`en.ts`, `fr.ts`, etc.)
3. TypeScript will enforce completion - build fails if translations are missing
4. Use `useTranslation()` hook to access translations in components

### Analytics Integration:

- Analytics automatically initializes via `AnalyticsProvider` in layout
- Use `useAnalytics()` hook for manual event tracking
- Most common business actions are tracked automatically
- Add custom events for business-specific actions

## File Structure

```
├── app/
│   ├── layout.tsx          # Root layout with providers
│   └── page.tsx            # Home page
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── analytics-provider.tsx # Analytics wrapper
│   └── language-picker.tsx # Language switcher
├── lib/
│   ├── i18n/              # Translation system
│   │   ├── index.ts       # Main i18n logic
│   │   ├── en.ts          # English translations
│   │   └── fr.ts          # French translations
│   ├── analytics.ts       # Analytics SDK
│   ├── analytics-types.ts # Source and EventType enums
│   ├── useAnalytics.ts    # Analytics React hook
│   └── firebase.ts        # Firebase configuration
└── provider/
    └── language-provider.tsx # Language context
```

This template provides a solid foundation for AI-generated business websites with professional translation and analytics capabilities.
