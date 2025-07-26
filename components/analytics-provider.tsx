'use client';

import { useEffect } from 'react';
import { useAnalytics } from '@/lib/useAnalytics';
import { Source, EventType } from '@/lib/analytics-types';

interface AnalyticsProviderProps {
  websiteId: string;
  children: React.ReactNode;
}

export function AnalyticsProvider({ websiteId, children }: AnalyticsProviderProps) {
  const { logEvent } = useAnalytics(websiteId);

  useEffect(() => {
    // Add click event listeners for common business actions
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a');
      
      if (link) {
        const href = link.href;
        
        // Track phone clicks
        if (href.startsWith('tel:')) {
          const phone = href.replace('tel:', '');
          logEvent('phone_click', Source.ContactPage, EventType.Tap, { phone });
        }
        
        // Track email clicks
        if (href.startsWith('mailto:')) {
          const email = href.replace('mailto:', '');
          logEvent('email_click', Source.ContactPage, EventType.Tap, { email });
        }
        
        // Track external link clicks
        if (href.startsWith('http') && !href.includes(window.location.hostname)) {
          logEvent('external_link_click', Source.HomeScreen, EventType.Tap, { url: href });
        }
      }
      
      // Track form submissions
      if ((target as HTMLInputElement).type === 'submit' || target.closest('button[type="submit"]')) {
        const form = target.closest('form');
        if (form) {
          logEvent('form_submit', Source.ContactPage, EventType.Submit, { 
            formName: form.getAttribute('name') || 'unnamed_form',
            formId: form.id || undefined
          });
        }
      }
    };

    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [logEvent]);

  return <>{children}</>;
}