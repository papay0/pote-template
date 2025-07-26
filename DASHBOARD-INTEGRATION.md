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

### Collection Paths
- **Main Collection**: `/analytics/{websiteId}`
- **Sessions**: `/analytics/{websiteId}/sessions/{sessionId}`
- **Page Views**: `/analytics/{websiteId}/pageviews/{pageviewId}`
- **Events**: `/analytics/{websiteId}/events/{eventId}`

### Key Analytics Queries

#### 1. Basic Metrics (Last 30 Days)

```typescript
async function getBasicMetrics(websiteId: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Total unique visitors (sessions)
  const sessionsSnapshot = await db
    .collection(`analytics/${websiteId}/sessions`)
    .where('startTime', '>=', thirtyDaysAgo)
    .get();
  const uniqueVisitors = sessionsSnapshot.size;

  // Total page views
  const pageViewsSnapshot = await db
    .collection(`analytics/${websiteId}/pageviews`)
    .where('timestamp', '>=', thirtyDaysAgo)
    .get();
  const totalPageViews = pageViewsSnapshot.size;

  // Total events
  const eventsSnapshot = await db
    .collection(`analytics/${websiteId}/events`)
    .where('timestamp', '>=', thirtyDaysAgo)
    .get();
  const totalEvents = eventsSnapshot.size;

  return {
    uniqueVisitors,
    totalPageViews,
    totalEvents,
    avgPageViewsPerSession: uniqueVisitors > 0 ? totalPageViews / uniqueVisitors : 0
  };
}
```

#### 2. Business Actions Tracking

```typescript
async function getBusinessActions(websiteId: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Phone calls
  const phoneCallsSnapshot = await db
    .collection(`analytics/${websiteId}/events`)
    .where('eventType', '==', 'phone_click')
    .where('timestamp', '>=', thirtyDaysAgo)
    .get();

  // Email contacts
  const emailsSnapshot = await db
    .collection(`analytics/${websiteId}/events`)
    .where('eventType', '==', 'email_click')
    .where('timestamp', '>=', thirtyDaysAgo)
    .get();

  // Form submissions
  const formsSnapshot = await db
    .collection(`analytics/${websiteId}/events`)
    .where('eventType', '==', 'form_submit')
    .where('timestamp', '>=', thirtyDaysAgo)
    .get();

  return {
    phoneCalls: phoneCallsSnapshot.size,
    emails: emailsSnapshot.size,
    formSubmissions: formsSnapshot.size,
    totalLeads: phoneCallsSnapshot.size + emailsSnapshot.size + formsSnapshot.size
  };
}
```

#### 3. Source Analysis (Where Actions Come From)

```typescript
async function getActionsBySource(websiteId: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const eventsSnapshot = await db
    .collection(`analytics/${websiteId}/events`)
    .where('type', '==', 'tap') // Only tap events for actions
    .where('timestamp', '>=', thirtyDaysAgo)
    .get();

  const sourceBreakdown: Record<string, number> = {};
  
  eventsSnapshot.forEach(doc => {
    const data = doc.data();
    const source = data.source || 'unknown';
    sourceBreakdown[source] = (sourceBreakdown[source] || 0) + 1;
  });

  return sourceBreakdown;
  // Example result: { "home_screen": 45, "contact_page": 23, "header": 12 }
}
```

#### 4. Device & Location Analytics

```typescript
async function getVisitorDemographics(websiteId: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const sessionsSnapshot = await db
    .collection(`analytics/${websiteId}/sessions`)
    .where('startTime', '>=', thirtyDaysAgo)
    .get();

  const deviceTypes: Record<string, number> = {};
  const browsers: Record<string, number> = {};
  const countries: Record<string, number> = {};

  sessionsSnapshot.forEach(doc => {
    const data = doc.data();
    
    // Device breakdown
    const deviceType = data.device?.type || 'unknown';
    deviceTypes[deviceType] = (deviceTypes[deviceType] || 0) + 1;
    
    // Browser breakdown
    const browser = data.device?.browser || 'unknown';
    browsers[browser] = (browsers[browser] || 0) + 1;
    
    // Country breakdown
    const country = data.location?.country || 'unknown';
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

  const pageViewsSnapshot = await db
    .collection(`analytics/${websiteId}/pageviews`)
    .where('timestamp', '>=', startDate)
    .orderBy('timestamp')
    .get();

  const eventsSnapshot = await db
    .collection(`analytics/${websiteId}/events`)
    .where('timestamp', '>=', startDate)
    .orderBy('timestamp')
    .get();

  // Group by day
  const dailyData: Record<string, { pageViews: number; events: number }> = {};

  pageViewsSnapshot.forEach(doc => {
    const data = doc.data();
    const day = data.timestamp.toDate().toISOString().split('T')[0];
    if (!dailyData[day]) dailyData[day] = { pageViews: 0, events: 0 };
    dailyData[day].pageViews++;
  });

  eventsSnapshot.forEach(doc => {
    const data = doc.data();
    const day = data.timestamp.toDate().toISOString().split('T')[0];
    if (!dailyData[day]) dailyData[day] = { pageViews: 0, events: 0 };
    dailyData[day].events++;
  });

  return dailyData;
}
```

#### 6. Popular Pages Analysis

```typescript
async function getPopularPages(websiteId: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const pageViewsSnapshot = await db
    .collection(`analytics/${websiteId}/pageviews`)
    .where('timestamp', '>=', thirtyDaysAgo)
    .get();

  const pageStats: Record<string, { 
    views: number; 
    avgTimeOnPage: number; 
    totalTime: number;
    avgScrollDepth: number;
    totalScrollDepth: number;
  }> = {};

  pageViewsSnapshot.forEach(doc => {
    const data = doc.data();
    // Extract just the path from full URL for cleaner display
    const url = new URL(data.url).pathname; // "/", "/contact", "/about"
    const timeOnPage = data.timeOnPage || 0;
    const scrollDepth = data.scrollDepth || 0;

    if (!pageStats[url]) {
      pageStats[url] = { 
        views: 0, 
        avgTimeOnPage: 0, 
        totalTime: 0,
        avgScrollDepth: 0,
        totalScrollDepth: 0
      };
    }

    pageStats[url].views++;
    pageStats[url].totalTime += timeOnPage;
    pageStats[url].totalScrollDepth += scrollDepth;
  });

  // Calculate averages
  Object.keys(pageStats).forEach(url => {
    const stats = pageStats[url];
    stats.avgTimeOnPage = stats.views > 0 ? stats.totalTime / stats.views : 0;
    stats.avgScrollDepth = stats.views > 0 ? stats.totalScrollDepth / stats.views : 0;
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

// Get specific page performance
async function getPagePerformance(websiteId: string, pagePath: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const pageViewsSnapshot = await db
    .collection(`analytics/${websiteId}/pageviews`)
    .where('timestamp', '>=', thirtyDaysAgo)
    .get();

  const pageViews = pageViewsSnapshot.docs
    .map(doc => doc.data())
    .filter(data => new URL(data.url).pathname === pagePath);

  const totalViews = pageViews.length;
  const avgTimeOnPage = totalViews > 0 
    ? pageViews.reduce((sum, view) => sum + (view.timeOnPage || 0), 0) / totalViews 
    : 0;
  const avgScrollDepth = totalViews > 0
    ? pageViews.reduce((sum, view) => sum + (view.scrollDepth || 0), 0) / totalViews
    : 0;
  const exitRate = totalViews > 0
    ? pageViews.filter(view => view.exitPage).length / totalViews
    : 0;

  return {
    path: pagePath,
    views: totalViews,
    avgTimeOnPage: Math.round(avgTimeOnPage / 1000), // Convert to seconds
    avgScrollDepth: Math.round(avgScrollDepth),
    exitRate: Math.round(exitRate * 100) // As percentage
  };
}
```

## Event Type Filtering

Use the enum values for precise filtering:

### Source Values
- `home_screen`, `contact_page`, `about_page`, `services_page`
- `header`, `footer`, `sidebar`, `hero_section`
- `modal`, `cta_section`, `testimonials_section`

### EventType Values  
- `impression` - Content views/visibility
- `tap` - Button clicks, link clicks
- `submit` - Form submissions
- `view`, `scroll`, `download`, `share`

```typescript
// Get all CTA button clicks from hero sections
const heroCtaClicks = await db
  .collection(`analytics/${websiteId}/events`)
  .where('source', '==', 'hero_section')
  .where('type', '==', 'tap')
  .where('eventType', '==', 'cta_click')
  .get();

// Get all content impressions
const impressions = await db
  .collection(`analytics/${websiteId}/events`)
  .where('type', '==', 'impression')
  .get();

// Get page navigation flow (route changes)
const pageImpressions = await db
  .collection(`analytics/${websiteId}/events`)
  .where('eventType', '==', 'page_impression')
  .where('timestamp', '>=', thirtyDaysAgo)
  .orderBy('timestamp')
  .get();
```

## Dashboard Metrics to Display

### Key Performance Indicators
1. **Total Visitors** (unique sessions)
2. **Page Views** (total pageviews)
3. **Business Leads** (phone + email + form submissions)
4. **Conversion Rate** (leads / visitors)

### Charts & Visualizations
1. **Daily Traffic Chart** (visitors over time)
2. **Source Breakdown** (where leads come from)
3. **Device Types** (mobile vs desktop)
4. **Popular Pages** (most visited pages)
5. **Lead Actions Timeline** (recent business actions)

### Real-time Features
- Recent visitor activity
- Live lead notifications
- Today's metrics vs yesterday

## Example Dashboard Query Function

```typescript
export async function getDashboardData(websiteId: string) {
  const [
    basicMetrics,
    businessActions,
    sourceBreakdown,
    demographics,
    dailyMetrics,
    popularPages
  ] = await Promise.all([
    getBasicMetrics(websiteId),
    getBusinessActions(websiteId),
    getActionsBySource(websiteId),
    getVisitorDemographics(websiteId),
    getDailyMetrics(websiteId),
    getPopularPages(websiteId)
  ]);

  return {
    basicMetrics,
    businessActions,
    sourceBreakdown,
    demographics,
    dailyMetrics,
    popularPages,
    lastUpdated: new Date()
  };
}
```

This structure provides comprehensive analytics while maintaining the separation between website tracking (write-only) and dashboard viewing (admin read-only).