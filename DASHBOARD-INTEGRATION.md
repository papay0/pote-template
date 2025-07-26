# Dashboard Integration Guide

## Overview

This guide is for AI agents building the Pote AI dashboard to display analytics data from generated business websites.

## Firebase Project Setup

**Important**: Use Firebase Admin SDK for server-side access to read analytics data. Client-side access is write-only for security.

```typescript
// Dashboard server-side Firebase setup
import admin from 'firebase-admin';

const app = admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'pote-ai' // Your Firebase project ID
});

const db = admin.firestore();
```

## Data Structure Reference

### Collection Path
- **Single Collection**: `/analytics/{websiteId}/events`

### Event Data Structure
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
    phone?: string,             // Phone number for phone_click events
    email?: string,             // Email for email_click events
    // Any other custom fields...
  }
}
```

### Key Analytics Queries

#### 1. Basic Metrics (Last 30 Days)

```typescript
async function getBasicMetrics(websiteId: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Get all events from last 30 days
  const eventsSnapshot = await db
    .collection(`analytics/${websiteId}/events`)
    .where('timestamp', '>=', thirtyDaysAgo)
    .get();

  const events = eventsSnapshot.docs.map(doc => doc.data());
  
  // Count impressions (page views)
  const impressions = events.filter(event => event.type === 'impression');
  const totalPageViews = impressions.length;
  
  // Count taps (business actions)
  const taps = events.filter(event => event.type === 'tap');
  const totalActions = taps.length;
  
  // Estimate unique visitors from unique IP hashes
  const uniqueIPs = new Set(events.map(event => event.ipHash));
  const uniqueVisitors = uniqueIPs.size;

  return {
    uniqueVisitors,
    totalPageViews,
    totalActions,
    totalEvents: events.length,
    avgPageViewsPerVisitor: uniqueVisitors > 0 ? totalPageViews / uniqueVisitors : 0
  };
}
```

#### 2. Business Actions Tracking

```typescript
async function getBusinessActions(websiteId: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Get all tap events from last 30 days
  const tapsSnapshot = await db
    .collection(`analytics/${websiteId}/events`)
    .where('type', '==', 'tap')
    .where('timestamp', '>=', thirtyDaysAgo)
    .get();

  const taps = tapsSnapshot.docs.map(doc => doc.data());
  
  // Count different action types
  const phoneCalls = taps.filter(tap => tap.metadata?.action === 'phone_click').length;
  const emails = taps.filter(tap => tap.metadata?.action === 'email_click').length;
  const formSubmissions = taps.filter(tap => tap.metadata?.action === 'form_submit').length;
  const externalLinks = taps.filter(tap => tap.metadata?.action === 'external_link_click').length;

  return {
    phoneCalls,
    emails,
    formSubmissions,
    externalLinks,
    totalLeads: phoneCalls + emails + formSubmissions,
    totalTaps: taps.length
  };
}
```

#### 3. Page Analysis (Where Actions Come From)

```typescript
async function getActionsByPage(websiteId: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const tapsSnapshot = await db
    .collection(`analytics/${websiteId}/events`)
    .where('type', '==', 'tap')
    .where('timestamp', '>=', thirtyDaysAgo)
    .get();

  const pageBreakdown: Record<string, number> = {};
  
  tapsSnapshot.forEach(doc => {
    const data = doc.data();
    const page = data.path || 'unknown';
    pageBreakdown[page] = (pageBreakdown[page] || 0) + 1;
  });

  return pageBreakdown;
  // Example result: { "/": 45, "/contact": 23, "/about": 12 }
}
```

#### 4. Device & Location Analytics

```typescript
async function getVisitorDemographics(websiteId: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Get all events to analyze visitor patterns
  const eventsSnapshot = await db
    .collection(`analytics/${websiteId}/events`)
    .where('timestamp', '>=', thirtyDaysAgo)
    .get();

  const events = eventsSnapshot.docs.map(doc => doc.data());
  
  // Use unique IP hashes to avoid counting same visitor multiple times
  const uniqueVisitors = new Map();
  
  events.forEach(event => {
    const ipHash = event.ipHash;
    if (!uniqueVisitors.has(ipHash)) {
      uniqueVisitors.set(ipHash, event); // Store first event for each visitor
    }
  });

  const deviceTypes: Record<string, number> = {};
  const browsers: Record<string, number> = {};
  const countries: Record<string, number> = {};

  uniqueVisitors.forEach(event => {
    // Device breakdown
    const deviceType = event.device?.type || 'unknown';
    deviceTypes[deviceType] = (deviceTypes[deviceType] || 0) + 1;
    
    // Browser breakdown
    const browser = event.device?.browser || 'unknown';
    browsers[browser] = (browsers[browser] || 0) + 1;
    
    // Country breakdown
    const country = event.location?.country || 'unknown';
    countries[country] = (countries[country] || 0) + 1;
  });

  return { deviceTypes, browsers, countries };
}
```

#### 5. Time-Series Data for Charts

```typescript
async function getDailyMetrics(websiteId: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const eventsSnapshot = await db
    .collection(`analytics/${websiteId}/events`)
    .where('timestamp', '>=', startDate)
    .orderBy('timestamp')
    .get();

  // Group by day
  const dailyData: Record<string, { impressions: number; taps: number; totalEvents: number }> = {};

  eventsSnapshot.forEach(doc => {
    const data = doc.data();
    const day = data.timestamp.toDate().toISOString().split('T')[0];
    
    if (!dailyData[day]) {
      dailyData[day] = { impressions: 0, taps: 0, totalEvents: 0 };
    }
    
    dailyData[day].totalEvents++;
    
    if (data.type === 'impression') {
      dailyData[day].impressions++;
    } else if (data.type === 'tap') {
      dailyData[day].taps++;
    }
  });

  return dailyData;
}
```

#### 6. Popular Pages Analysis

```typescript
async function getPopularPages(websiteId: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Get all impression events (page views)
  const impressionsSnapshot = await db
    .collection(`analytics/${websiteId}/events`)
    .where('type', '==', 'impression')
    .where('timestamp', '>=', thirtyDaysAgo)
    .get();

  const pageStats: Record<string, { 
    views: number; 
    initialLoads: number;
    routeChanges: number;
  }> = {};

  impressionsSnapshot.forEach(doc => {
    const data = doc.data();
    const path = data.path; // Already just the path (/contact, /, /about)
    const isInitialLoad = data.metadata?.isInitialLoad || false;

    if (!pageStats[path]) {
      pageStats[path] = { 
        views: 0, 
        initialLoads: 0,
        routeChanges: 0
      };
    }

    pageStats[path].views++;
    
    if (isInitialLoad) {
      pageStats[path].initialLoads++;
    } else {
      pageStats[path].routeChanges++;
    }
  });

  // Sort by views (most popular first)
  const sortedPages = Object.entries(pageStats)
    .sort(([,a], [,b]) => b.views - a.views)
    .reduce((obj, [path, stats]) => {
      obj[path] = stats;
      return obj;
    }, {} as typeof pageStats);

  return sortedPages;
}

// Get taps (actions) per page
async function getPageActions(websiteId: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const tapsSnapshot = await db
    .collection(`analytics/${websiteId}/events`)
    .where('type', '==', 'tap')
    .where('timestamp', '>=', thirtyDaysAgo)
    .get();

  const pageActions: Record<string, number> = {};

  tapsSnapshot.forEach(doc => {
    const data = doc.data();
    const path = data.path;
    pageActions[path] = (pageActions[path] || 0) + 1;
  });

  return pageActions;
}
```

## Simple Event Filtering

Only two event types to work with:

### Event Types
- `impression` - Page views (automatic on URL changes)
- `tap` - User actions (clicks, form submissions)

### Common Queries

```typescript
// Get all page impressions (page views)
const impressions = await db
  .collection(`analytics/${websiteId}/events`)
  .where('type', '==', 'impression')
  .where('timestamp', '>=', thirtyDaysAgo)
  .get();

// Get all business actions
const taps = await db
  .collection(`analytics/${websiteId}/events`)
  .where('type', '==', 'tap')
  .where('timestamp', '>=', thirtyDaysAgo)
  .get();

// Get phone calls specifically
const phoneCalls = await db
  .collection(`analytics/${websiteId}/events`)
  .where('type', '==', 'tap')
  .where('metadata.action', '==', 'phone_click')
  .where('timestamp', '>=', thirtyDaysAgo)
  .get();

// Get initial page loads vs route changes
const initialLoads = await db
  .collection(`analytics/${websiteId}/events`)
  .where('type', '==', 'impression')
  .where('metadata.isInitialLoad', '==', true)
  .where('timestamp', '>=', thirtyDaysAgo)
  .get();
```

## Dashboard Metrics to Display

### Key Performance Indicators
1. **Total Visitors** (unique IP hashes)
2. **Page Views** (impression events)
3. **Business Actions** (tap events)
4. **Top Pages** (impressions by path)
5. **Action Rate** (taps / impressions)

### Charts & Visualizations
1. **Daily Traffic Chart** (impressions + taps over time)
2. **Page Breakdown** (which pages get most views/actions)
3. **Device Types** (mobile vs desktop visitors)
4. **Action Types** (phone calls vs emails vs forms)
5. **Entry vs Navigation** (initial loads vs route changes)

### Business Insights
- **Phone Calls** - Count of phone_click taps
- **Email Contacts** - Count of email_click taps  
- **Form Submissions** - Count of form_submit taps
- **Popular Entry Points** - Pages with most initial loads
- **High-Action Pages** - Pages with best tap/impression ratio

## Example Dashboard Query Function

```typescript
export async function getDashboardData(websiteId: string) {
  const [
    basicMetrics,
    businessActions,
    pageBreakdown,
    demographics,
    dailyMetrics,
    popularPages,
    pageActions
  ] = await Promise.all([
    getBasicMetrics(websiteId),
    getBusinessActions(websiteId),
    getActionsByPage(websiteId),
    getVisitorDemographics(websiteId),
    getDailyMetrics(websiteId),
    getPopularPages(websiteId),
    getPageActions(websiteId)
  ]);

  return {
    basicMetrics,
    businessActions,
    pageBreakdown,
    demographics,
    dailyMetrics,
    popularPages,
    pageActions,
    lastUpdated: new Date()
  };
}
```

## Quick Reference

### Event Structure
```javascript
{
  type: 'impression' | 'tap',
  path: '/contact',                    // URL path
  metadata: {
    action: 'phone_click',             // For taps
    isInitialLoad: true,               // For impressions
    phone: '+1234567890'               // Custom data
  },
  device: { type, browser, os },
  location: { country, city, timezone },
  timestamp: firestore_timestamp
}
```

### Key Queries
- **Impressions**: `where('type', '==', 'impression')`
- **Actions**: `where('type', '==', 'tap')`
- **Phone calls**: `where('metadata.action', '==', 'phone_click')`
- **Initial loads**: `where('metadata.isInitialLoad', '==', true)`

This simplified structure makes dashboard development straightforward while providing all essential business metrics!