import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { EventType } from './analytics-types';

interface EventData {
  eventId: string;
  websiteId: string;
  type: EventType;
  path: string;
  timestamp: Timestamp;
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
  metadata: Record<string, unknown>;
}

export class PoteAnalytics {
  private websiteId: string;
  private deviceInfo: EventData['device'];
  private locationInfo: EventData['location'] | null = null;
  private ipHash: string = 'unknown';

  constructor() {
    this.websiteId = process.env.NEXT_PUBLIC_WEBSITE_ID || '';
    this.deviceInfo = this.getDeviceInfo();
    
    if (!this.isBot()) {
      this.initializeLocationData();
    }
  }

  private generateId(): string {
    return crypto.randomUUID();
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

  private getDeviceInfo(): EventData['device'] {
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

  private async initializeLocationData(): Promise<void> {
    try {
      const [location, ipHash] = await Promise.all([
        this.getLocationInfo(),
        this.getClientIP()
      ]);
      
      this.locationInfo = location;
      this.ipHash = ipHash;
    } catch (error) {
      console.warn('Failed to initialize location data:', error);
      this.locationInfo = {
        country: 'Unknown',
        city: 'Unknown',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
    }
  }

  private async getLocationInfo(): Promise<EventData['location']> {
    try {
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
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  public async logEvent(
    type: EventType,
    path: string = window.location.pathname,
    metadata: Record<string, unknown> = {}
  ): Promise<void> {
    if (this.isBot()) return;

    try {
      // Wait for location data if not ready yet
      if (!this.locationInfo) {
        await this.initializeLocationData();
      }

      const eventData: Omit<EventData, 'eventId'> = {
        websiteId: this.websiteId,
        type,
        path,
        timestamp: serverTimestamp() as Timestamp,
        userAgent: navigator.userAgent,
        ipHash: this.ipHash,
        location: this.locationInfo || {
          country: 'Unknown',
          city: 'Unknown',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        device: this.deviceInfo,
        referrer: document.referrer || 'direct',
        metadata
      };

      await addDoc(
        collection(db, `analytics/${this.websiteId}/events`),
        { ...eventData, eventId: this.generateId() }
      );
    } catch (error) {
      console.error('Failed to log event:', error);
    }
  }

  // Convenience methods
  public async logImpression(path?: string, metadata?: Record<string, unknown>): Promise<void> {
    await this.logEvent(EventType.Impression, path, metadata);
  }

  public async logTap(action: string, metadata?: Record<string, unknown>): Promise<void> {
    await this.logEvent(EventType.Tap, window.location.pathname, { action, ...metadata });
  }
}