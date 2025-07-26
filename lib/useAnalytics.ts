'use client';

import { useEffect, useRef } from 'react';
import { PoteAnalytics } from './analytics';
import { Source, EventType } from './analytics-types';

let analyticsInstance: PoteAnalytics | null = null;

export function useAnalytics(websiteId: string) {
  const analyticsRef = useRef<PoteAnalytics | null>(null);

  useEffect(() => {
    // Only initialize on client side and if not already initialized
    if (typeof window !== 'undefined' && !analyticsInstance && websiteId) {
      analyticsInstance = new PoteAnalytics(websiteId);
      analyticsRef.current = analyticsInstance;
    }
  }, [websiteId]);

  const logEvent = (
    eventType: string, 
    source: Source, 
    type: EventType, 
    metadata: Record<string, unknown> = {}
  ) => {
    if (analyticsInstance) {
      analyticsInstance.logEvent(eventType, source, type, metadata);
    }
  };


  const logPageView = () => {
    if (analyticsInstance) {
      analyticsInstance.logPageView();
    }
  };

  return {
    logEvent,
    logPageView,
    analytics: analyticsInstance
  };
}