import { db } from './firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { Source, EventType } from './analytics-types';

interface SessionData {
  sessionId: string;
  websiteId: string;
  startTime: Timestamp;
  endTime?: Timestamp;
  userAgent: string;
  ipHash: string;
  location: {
    country: string;
    city: string;
    timezone: string;
  };
  device: {
    type: 'mobile' | 'desktop' | 'tablet';
    browser: string;
    os: string;
  };
  referrer: string;
  totalPageViews: number;
  totalTimeSpent: number;
}

interface PageViewData {
  pageviewId: string;
  sessionId: string;
  websiteId: string;
  url: string;
  title: string;
  timestamp: Timestamp;
  timeOnPage: number;
  scrollDepth: number;
  exitPage: boolean;
}

interface EventData {
  eventId: string;
  sessionId: string;
  websiteId: string;
  eventType: string;
  source: Source;
  type: EventType;
  timestamp: Timestamp;
  metadata: {
    element?: string;
    value?: string;
    page: string;
  };
}

export class PoteAnalytics {
  private websiteId: string;
  private sessionId: string;
  private sessionStartTime: number;
  private currentPageStartTime: number;
  private maxScrollDepth: number = 0;
  private sessionDocId: string | null = null;
  private currentPageViewDocId: string | null = null;

  constructor(websiteId: string) {
    this.websiteId = websiteId;
    this.sessionStartTime = Date.now();
    this.currentPageStartTime = Date.now();
    
    // Check for existing session or create new one
    this.sessionId = this.getOrCreateSession();
    
    if (!this.isBot()) {
      this.initializeSession();
      this.logPageView();
      this.setupEventListeners();
    }
  }

  private generateId(): string {
    return crypto.randomUUID();
  }

  private getOrCreateSession(): string {
    const stored = localStorage.getItem('pote_session');
    if (stored) {
      try {
        const session = JSON.parse(stored);
        const thirtyMinutes = 30 * 60 * 1000;
        if (Date.now() - session.lastActivity < thirtyMinutes) {
          // Update last activity
          session.lastActivity = Date.now();
          localStorage.setItem('pote_session', JSON.stringify(session));
          return session.sessionId;
        }
      } catch {
        // Invalid stored session, create new one
      }
    }
    
    // Create new session
    const newSessionId = this.generateId();
    const session = {
      sessionId: newSessionId,
      lastActivity: Date.now()
    };
    localStorage.setItem('pote_session', JSON.stringify(session));
    return newSessionId;
  }

  private isBot(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    const botPatterns = [
      'bot', 'crawler', 'spider', 'scraper', 'headless',
      'googlebot', 'bingbot', 'slurp', 'duckduckbot',
      'facebookexternalhit', 'twitterbot', 'linkedinbot'
    ];
    
    return botPatterns.some(pattern => userAgent.includes(pattern));
  }

  private getDeviceInfo(): SessionData['device'] {
    const userAgent = navigator.userAgent;
    
    // Detect device type
    let type: 'mobile' | 'desktop' | 'tablet' = 'desktop';
    if (/tablet|ipad/i.test(userAgent)) {
      type = 'tablet';
    } else if (/mobile|android|iphone/i.test(userAgent)) {
      type = 'mobile';
    }

    // Detect browser
    let browser = 'Unknown';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    // Detect OS
    let os = 'Unknown';
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';

    return { type, browser, os };
  }

  private async getLocationInfo(): Promise<SessionData['location']> {
    try {
      // Use a free IP geolocation service
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        return {
          country: data.country_name || 'Unknown',
          city: data.city || 'Unknown',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
      }
    } catch (error) {
      console.warn('Failed to get location info:', error);
    }
    
    // Fallback to just timezone
    return {
      country: 'Unknown',
      city: 'Unknown',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      if (response.ok) {
        const data = await response.json();
        // Simple hash of IP for privacy
        return this.simpleHash(data.ip);
      }
    } catch (error) {
      console.warn('Failed to get IP:', error);
    }
    return 'unknown';
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }

  private async initializeSession(): Promise<void> {
    try {
      const [location, ipHash] = await Promise.all([
        this.getLocationInfo(),
        this.getClientIP()
      ]);

      const sessionData: Omit<SessionData, 'sessionId'> = {
        websiteId: this.websiteId,
        startTime: serverTimestamp() as Timestamp,
        userAgent: navigator.userAgent,
        ipHash,
        location,
        device: this.getDeviceInfo(),
        referrer: document.referrer || 'direct',
        totalPageViews: 0,
        totalTimeSpent: 0
      };

      const docRef = await addDoc(
        collection(db, `analytics/${this.websiteId}/sessions`),
        { ...sessionData, sessionId: this.sessionId }
      );
      
      this.sessionDocId = docRef.id;
    } catch (error) {
      console.error('Failed to initialize analytics session:', error);
    }
  }

  public async logPageView(): Promise<void> {
    if (this.isBot()) return;

    try {
      // Update previous page view with time spent
      if (this.currentPageViewDocId) {
        await this.updateCurrentPageView();
      }

      const pageViewData: Omit<PageViewData, 'pageviewId'> = {
        sessionId: this.sessionId,
        websiteId: this.websiteId,
        url: window.location.href,
        title: document.title,
        timestamp: serverTimestamp() as Timestamp,
        timeOnPage: 0,
        scrollDepth: 0,
        exitPage: false
      };

      const docRef = await addDoc(
        collection(db, `analytics/${this.websiteId}/pageviews`),
        { ...pageViewData, pageviewId: this.generateId() }
      );

      this.currentPageViewDocId = docRef.id;
      this.currentPageStartTime = Date.now();
      this.maxScrollDepth = 0;

      // Update session page view count
      if (this.sessionDocId) {
        await updateDoc(doc(db, `analytics/${this.websiteId}/sessions`, this.sessionDocId), {
          totalPageViews: (await this.getSessionPageViewCount()) + 1
        });
      }
    } catch (error) {
      console.error('Failed to log page view:', error);
    }
  }

  public async logEvent(
    eventType: string, 
    source: Source, 
    type: EventType, 
    metadata: Record<string, unknown> = {}
  ): Promise<void> {
    if (this.isBot()) return;

    try {
      const eventData: Omit<EventData, 'eventId'> = {
        sessionId: this.sessionId,
        websiteId: this.websiteId,
        eventType,
        source,
        type,
        timestamp: serverTimestamp() as Timestamp,
        metadata: {
          ...metadata,
          page: window.location.href
        }
      };

      await addDoc(
        collection(db, `analytics/${this.websiteId}/events`),
        { ...eventData, eventId: this.generateId() }
      );
    } catch (error) {
      console.error('Failed to log event:', error);
    }
  }


  private async updateCurrentPageView(): Promise<void> {
    if (!this.currentPageViewDocId) return;

    try {
      const timeOnPage = Date.now() - this.currentPageStartTime;
      await updateDoc(
        doc(db, `analytics/${this.websiteId}/pageviews`, this.currentPageViewDocId),
        {
          timeOnPage,
          scrollDepth: this.maxScrollDepth
        }
      );
    } catch (error) {
      console.error('Failed to update page view:', error);
    }
  }

  private async getSessionPageViewCount(): Promise<number> {
    try {
      // This is a simplified version - in production you might want to query the actual count
      const stored = localStorage.getItem(`pote_pageviews_${this.sessionId}`);
      const count = stored ? parseInt(stored, 10) : 0;
      localStorage.setItem(`pote_pageviews_${this.sessionId}`, (count + 1).toString());
      return count;
    } catch {
      return 0;
    }
  }

  private setupEventListeners(): void {
    // Track scroll depth
    const trackScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      this.maxScrollDepth = Math.max(this.maxScrollDepth, scrollPercent || 0);
    };

    // Update session activity
    const updateActivity = () => {
      const stored = localStorage.getItem('pote_session');
      if (stored) {
        try {
          const session = JSON.parse(stored);
          session.lastActivity = Date.now();
          localStorage.setItem('pote_session', JSON.stringify(session));
        } catch {
          // Ignore errors
        }
      }
    };

    // Event listeners
    window.addEventListener('scroll', trackScroll, { passive: true });
    window.addEventListener('click', updateActivity);
    window.addEventListener('keydown', updateActivity);

    // Handle page unload
    window.addEventListener('beforeunload', () => {
      this.updateCurrentPageView();
      
      // Mark as exit page
      if (this.currentPageViewDocId) {
        updateDoc(
          doc(db, `analytics/${this.websiteId}/pageviews`, this.currentPageViewDocId),
          { exitPage: true }
        ).catch(() => {
          // Ignore errors on unload
        });
      }

      // Update session end time
      if (this.sessionDocId) {
        const totalTime = Date.now() - this.sessionStartTime;
        updateDoc(
          doc(db, `analytics/${this.websiteId}/sessions`, this.sessionDocId),
          {
            endTime: serverTimestamp(),
            totalTimeSpent: totalTime
          }
        ).catch(() => {
          // Ignore errors on unload
        });
      }
    });
  }
}