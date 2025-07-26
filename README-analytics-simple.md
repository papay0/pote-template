# Simple Analytics Implementation Guide

## Overview

Simplified analytics system with **only two event types**: `impression` and `tap`. All data stored in a single Firestore collection.

## Data Structure

**Collection Path**: `/analytics/{websiteId}/events`

```javascript
{
  eventId: string,              // Generated UUID
  websiteId: string,            // Website UUID  
  type: 'impression' | 'tap',   // Event type
  path: string,                 // URL path (/contact, /, /about)
  timestamp: timestamp,         // Event time
  userAgent: string,            // Full browser user agent
  ipHash: string,               // Hashed IP for privacy
  location: {
    country: string,            // Detected via ipapi.co
    city: string,               // Detected via ipapi.co
    timezone: string            // Browser timezone
  },
  device: {
    type: 'mobile' | 'desktop' | 'tablet',
    browser: string,            // Chrome, Firefox, Safari, Edge
    os: string                  // Windows, macOS, iOS, Android
  },
  referrer: string,             // Document referrer or 'direct'
  metadata: {                   // Custom event data
    action?: string,            // For taps: 'phone_click', 'email_click', etc.
    isInitialLoad?: boolean,    // For impressions: true on first page load
    // Any other custom fields...
  }
}
```

## Automatic Tracking

### Page Impressions
- **Initial page load** - Logged when user first visits site
- **Route changes** - Logged on every URL change in Next.js
- **Path captured** - Exact pathname (/, /contact, /about, etc.)

### Business Actions
- **Phone clicks** - `tel:` links automatically tracked as taps
- **Email clicks** - `mailto:` links automatically tracked as taps  
- **Form submissions** - Form submits automatically tracked as taps
- **External links** - External site clicks automatically tracked as taps

## Manual Tracking

```typescript
import { useAnalytics } from '@/lib/useAnalytics';

export default function MyComponent() {
  const { logTap } = useAnalytics();
  
  return (
    <button onClick={() => logTap('cta_click', { button: 'hero', value: 'signup' })}>
      Sign Up
    </button>
  );
}
```

## Dashboard Queries

### Basic Metrics
```typescript
// Total impressions (page views) 
const impressions = await db
  .collection(`analytics/${websiteId}/events`)
  .where('type', '==', 'impression')
  .where('timestamp', '>=', thirtyDaysAgo)
  .get();

// Business actions (taps)
const actions = await db
  .collection(`analytics/${websiteId}/events`)
  .where('type', '==', 'tap')
  .where('timestamp', '>=', thirtyDaysAgo)
  .get();
```

### Page Popularity
```typescript
// Group impressions by path
const pageViews = {};
impressions.forEach(doc => {
  const data = doc.data();
  const path = data.path;
  pageViews[path] = (pageViews[path] || 0) + 1;
});

// Result: { "/": 1250, "/contact": 423, "/about": 234 }
```

### Business Action Analysis  
```typescript
// Phone calls
const phoneCalls = await db
  .collection(`analytics/${websiteId}/events`)
  .where('type', '==', 'tap')
  .where('metadata.action', '==', 'phone_click')
  .get();

// Email contacts
const emails = await db
  .collection(`analytics/${websiteId}/events`)
  .where('type', '==', 'tap')
  .where('metadata.action', '==', 'email_click')
  .get();
```

### Device & Location Analytics
```typescript
const events = await db
  .collection(`analytics/${websiteId}/events`)
  .where('timestamp', '>=', thirtyDaysAgo)
  .get();

const deviceTypes = {};
const countries = {};

events.forEach(doc => {
  const data = doc.data();
  
  // Device breakdown
  const device = data.device.type;
  deviceTypes[device] = (deviceTypes[device] || 0) + 1;
  
  // Country breakdown  
  const country = data.location.country;
  countries[country] = (countries[country] || 0) + 1;
});
```

## Firebase Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Analytics events - write-only from websites
    match /analytics/{websiteId}/events/{eventId} {
      allow write: if true;  // Websites can write events
      allow read: if false;  // Dashboard uses admin SDK
    }
  }
}
```

## Implementation Files

- `lib/analytics.ts` - Main PoteAnalytics class
- `lib/analytics-types.ts` - EventType enum (impression/tap)
- `lib/useAnalytics.ts` - React hook with logTap(), logImpression()
- `components/analytics-provider.tsx` - Auto-tracking wrapper

## Key Benefits

1. **Simple** - Only 2 event types to understand
2. **Automatic** - Page impressions tracked without any code
3. **Flexible** - Custom metadata for any business needs  
4. **Privacy-focused** - IP hashing, bot filtering
5. **Rich context** - Device, location, referrer data on every event

This simplified approach gives you essential analytics without complexity!