'use client';

import { useEffect, useRef } from 'react';
import { PoteAnalytics } from './analytics';

let analyticsInstance: PoteAnalytics | null = null;

export function useAnalytics() {
  const analyticsRef = useRef<PoteAnalytics | null>(null);

  useEffect(() => {
    // Only initialize on client side and if not already initialized
    if (typeof window !== 'undefined' && !analyticsInstance) {
      analyticsInstance = new PoteAnalytics();
      analyticsRef.current = analyticsInstance;
    }
  }, []);

  const logImpression = (path?: string, metadata?: Record<string, unknown>) => {
    if (analyticsInstance) {
      analyticsInstance.logImpression(path, metadata);
    }
  };

  const logTap = (action: string, metadata?: Record<string, unknown>) => {
    if (analyticsInstance) {
      analyticsInstance.logTap(action, metadata);
    }
  };

  return {
    logImpression,
    logTap,
    analytics: analyticsInstance
  };
}