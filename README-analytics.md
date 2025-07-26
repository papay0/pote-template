# Firebase Analytics Implementation Guide for Pote AI Template

## Overview

This document provides implementation specifications for the Firebase analytics SDK for Pote AI generated websites. The analytics system tracks visitor behavior and website performance, storing data in Firestore for real-time access from the Pote AI dashboard.

## System Architecture

```
[Generated Website with Analytics SDK] 
    ↓ (Firebase/Firestore)
[Pote AI Firebase Project]
    ↓ (Direct queries)
[Pote AI Dashboard - Analytics View]
```

## Firebase Project Configuration

The analytics SDK connects to the main Pote AI Firebase project and stores data in the following structure:

**Main Collection**: `analytics`
**Document Key**: `{websiteId}` (UUID of the project website)
**Sub-collections**: `sessions`, `pageviews`, `events`

## Firestore Data Structure

### Collection Path: `/analytics/{websiteId}`

Where `websiteId` is the UUID of the project website passed to the SDK during initialization.

#### Sub-collection: `sessions`
```javascript
// /analytics/{websiteId}/sessions/{sessionId}
{
  sessionId: string,           // Generated UUID for session
  websiteId: string,          // Website UUID (matches parent document)
  startTime: timestamp,       // Session start
  endTime: timestamp,         // Session end (updated on page unload)
  userAgent: string,          // Browser user agent
  ipHash: string,             // Hashed IP for privacy (client-side detection)
  location: {
    country: string,          // Detected via ipapi.co
    city: string,             // Detected via ipapi.co  
    timezone: string          // Browser timezone
  },
  device: {
    type: 'mobile' | 'desktop' | 'tablet',
    browser: string,          // Chrome, Firefox, Safari, etc.
    os: string               // Windows, macOS, iOS, Android
  },
  referrer: string,           // Document referrer URL
  totalPageViews: number,     // Count of pages viewed in session
  totalTimeSpent: number      // Total time in milliseconds
}
```

#### Sub-collection: `pageviews`
```javascript
// /analytics/{websiteId}/pageviews/{pageviewId}
{
  pageviewId: string,         // Generated UUID
  sessionId: string,          // Links to session
  websiteId: string,          // Website UUID
  url: string,                // Page URL
  title: string,              // Page title
  timestamp: timestamp,       // Page load time
  timeOnPage: number,         // Time spent on page (ms)
  scrollDepth: number,        // Max scroll percentage (0-100)
  exitPage: boolean           // True if user left site from this page
}
```

#### Sub-collection: `events`
```javascript
// /analytics/{websiteId}/events/{eventId}
{
  eventId: string,            // Generated UUID
  sessionId: string,          // Links to session
  websiteId: string,          // Website UUID
  eventType: string,          // 'phone_click', 'email_click', 'form_submit', etc.
  source: string,             // Source enum value (e.g., 'home_screen', 'contact_page')
  type: string,               // EventType enum value (e.g., 'tap', 'impression', 'submit')
  timestamp: timestamp,       // Event time
  metadata: {                 // Additional event-specific data
    element: string,          // CSS selector or element info
    value: string,           // Phone number, email, form name, etc.
    page: string             // Page where event occurred
  }
}
```

## Implementation

### File Structure

```
lib/
  ├── firebase.ts           // Firebase configuration
  ├── analytics.ts          // Main PoteAnalytics class
  ├── analytics-types.ts    // Source and EventType enums
  └── useAnalytics.ts       // React hook for analytics

components/
  └── analytics-provider.tsx // Auto-tracking provider component
```

### 1. Simple Initialization

The SDK uses the existing Firebase configuration and only needs the website ID:

```typescript
// In layout.tsx
import { AnalyticsProvider } from '@/components/analytics-provider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AnalyticsProvider websiteId="uuid-of-website-project">
          {children}
        </AnalyticsProvider>
      </body>
    </html>
  );
}
```

### 2. React Hook Usage

```typescript
// In any component
import { useAnalytics } from '@/lib/useAnalytics';
import { Source, EventType } from '@/lib/analytics-types';

export default function MyComponent() {
  const { logEvent } = useAnalytics('website-uuid');

  return (
    <button onClick={() => logEvent('custom_event', Source.HomeScreen, EventType.Tap, { value: 'test' })}>
      Track Event
    </button>
  );
}
```

### 3. Analytics Enums

The system uses TypeScript enums for structured event tracking:

```typescript
// Source - where the event originated
enum Source {
  HomeScreen = 'home_screen',
  ContactPage = 'contact_page',
  Header = 'header',
  Footer = 'footer',
  HeroSection = 'hero_section',
  // ... more sources
}

// EventType - type of interaction
enum EventType {
  Impression = 'impression',
  Tap = 'tap',
  Submit = 'submit',
  View = 'view',
  // ... more types
}
```

### 4. Automatic Tracking Features

The SDK automatically tracks:

#### Page Views
- Triggered on component mount and route changes
- Stores URL, title, timestamp
- Tracks time on page and scroll depth

#### Session Management
- Creates new session on first page load
- Uses localStorage to continue session for same visitor
- Session expires after 30 minutes of inactivity

#### Device Detection
- Parses user agent for browser, OS, device type
- Gets browser timezone
- Basic mobile/desktop/tablet detection

#### Bot Filtering
- Filters out common bot user agents
- Prevents analytics pollution from crawlers

#### Automatic Event Tracking
- **Page impressions** - Logged on every route change with appropriate source
- Phone number clicks (`tel:` links)
- Email clicks (`mailto:` links)
- Form submissions
- External link clicks

### 5. Manual Event Tracking

```typescript
import { Source, EventType } from '@/lib/analytics-types';

// Phone number click tracking
<a 
  href="tel:+1234567890" 
  onClick={() => logEvent('phone_click', Source.ContactPage, EventType.Tap, { phone: '+1234567890' })}
>
  Call Us
</a>

// Email click tracking  
<a 
  href="mailto:contact@business.com"
  onClick={() => logEvent('email_click', Source.ContactPage, EventType.Tap, { email: 'contact@business.com' })}
>
  Email Us
</a>

// Custom event tracking
<button onClick={() => logEvent('cta_click', Source.HeroSection, EventType.Tap, { button: 'hero_cta' })}>
  Get Started
</button>

// Impression tracking (when element comes into view)
<div onLoad={() => logEvent('hero_banner', Source.HomeScreen, EventType.Impression, { section: 'hero' })}>
  Hero Banner
</div>
```

**Note**: Page impressions are now **automatically tracked** on route changes. The system will log a `page_impression` event with the appropriate source every time a user navigates to a new page.

## Privacy & Security

### Bot Detection
- Filters common bot user agent patterns
- Prevents tracking of crawlers and scrapers

### Session Management
- Session IDs generated with crypto.randomUUID()
- 30-minute session timeout
- Stored in localStorage with activity tracking

### IP Privacy
- Client-side IP detection via ipapi.co
- Simple hash applied to IP for privacy
- Location detection with fallback to timezone only

## Firebase Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Analytics data - write-only from web, read from dashboard
    match /analytics/{websiteId}/{document=**} {
      allow write: if true; // Allow writes from any website
      allow read: if false; // Dashboard reads with admin SDK
    }
  }
}
```

## Dashboard Integration

The Pote AI dashboard reads analytics data using these Firestore queries:

```javascript
// Get total page views for a website (last 30 days)
const pageViewsQuery = query(
  collection(db, `analytics/${websiteId}/pageviews`),
  where('timestamp', '>=', thirtyDaysAgo),
  orderBy('timestamp', 'desc')
);

// Get unique sessions (visitors)
const sessionsQuery = query(
  collection(db, `analytics/${websiteId}/sessions`),
  where('startTime', '>=', thirtyDaysAgo),
  orderBy('startTime', 'desc')
);

// Get specific events
const eventsQuery = query(
  collection(db, `analytics/${websiteId}/events`),
  where('eventType', '==', 'phone_click'),
  where('timestamp', '>=', thirtyDaysAgo)
);

// Get events by source
const homeScreenEventsQuery = query(
  collection(db, `analytics/${websiteId}/events`),
  where('source', '==', 'home_screen'),
  where('timestamp', '>=', thirtyDaysAgo)
);

// Get events by type
const impressionEventsQuery = query(
  collection(db, `analytics/${websiteId}/events`),
  where('type', '==', 'impression'),
  where('timestamp', '>=', thirtyDaysAgo)
);

// Combined filtering
const contactTapsQuery = query(
  collection(db, `analytics/${websiteId}/events`),
  where('source', '==', 'contact_page'),
  where('type', '==', 'tap'),
  where('timestamp', '>=', thirtyDaysAgo)
);
```

## Usage Example

```typescript
// app/layout.tsx
import { AnalyticsProvider } from '@/components/analytics-provider';

export default function RootLayout({ children }) {
  return (
    <AnalyticsProvider websiteId="{{ WEBSITE_UUID }}">
      {children}
    </AnalyticsProvider>
  );
}

// components/contact-section.tsx
import { useAnalytics } from '@/lib/useAnalytics';
import { Source, EventType } from '@/lib/analytics-types';

export function ContactSection() {
  const { logEvent } = useAnalytics('{{ WEBSITE_UUID }}');

  return (
    <div>
      <a 
        href="tel:+1234567890"
        onClick={() => logEvent('phone_click', Source.ContactPage, EventType.Tap, { phone: '+1234567890' })}
      >
        Call Now
      </a>
      <a 
        href="mailto:contact@business.com"
        onClick={() => logEvent('email_click', Source.ContactPage, EventType.Tap, { email: 'contact@business.com' })}
      >
        Email Us
      </a>
    </div>
  );
}
```

This implementation provides local businesses with essential analytics while maintaining simplicity, privacy, and real-time access through the Pote AI dashboard.