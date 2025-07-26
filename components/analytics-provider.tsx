'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAnalytics } from '@/lib/useAnalytics';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const { logImpression, logTap } = useAnalytics();
  const pathname = usePathname();
  const isInitialLoad = useRef(true);

  // Track route changes and initial load for automatic page impressions
  useEffect(() => {
    // Log impression for both initial load and route changes
    logImpression(pathname, {
      isInitialLoad: isInitialLoad.current
    });
    
    isInitialLoad.current = false;
  }, [pathname, logImpression]);

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
          logTap('phone_click', { phone });
        }
        
        // Track email clicks
        if (href.startsWith('mailto:')) {
          const email = href.replace('mailto:', '');
          logTap('email_click', { email });
        }
        
        // Track external link clicks
        if (href.startsWith('http') && !href.includes(window.location.hostname)) {
          logTap('external_link_click', { url: href });
        }
      }
      
      // Track form submissions
      if ((target as HTMLInputElement).type === 'submit' || target.closest('button[type="submit"]')) {
        const form = target.closest('form');
        if (form) {
          logTap('form_submit', { 
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
  }, [logTap]);

  return <>{children}</>;
}