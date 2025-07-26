'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAnalytics } from '@/lib/useAnalytics';
import { Source, EventType } from '@/lib/analytics-types';

interface AnalyticsProviderProps {
  websiteId: string;
  children: React.ReactNode;
}

// Map page paths to appropriate sources
function getSourceFromPath(pathname: string): Source {
  if (pathname === '/') return Source.HomeScreen;
  if (pathname.includes('/contact')) return Source.ContactPage;
  if (pathname.includes('/about')) return Source.AboutPage;
  if (pathname.includes('/services')) return Source.ServicesPage;
  if (pathname.includes('/products')) return Source.ProductPage;
  if (pathname.includes('/checkout')) return Source.CheckoutPage;
  if (pathname.includes('/login')) return Source.LoginPage;
  if (pathname.includes('/signup')) return Source.SignupPage;
  if (pathname.includes('/dashboard')) return Source.Dashboard;
  if (pathname.includes('/profile')) return Source.ProfilePage;
  if (pathname.includes('/settings')) return Source.SettingsPage;
  if (pathname.includes('/blog')) return Source.BlogPost;
  if (pathname.includes('/search')) return Source.SearchResults;
  
  // Default fallback for unknown routes
  return Source.Unknown;
}

export function AnalyticsProvider({ websiteId, children }: AnalyticsProviderProps) {
  const { logEvent } = useAnalytics(websiteId);
  const pathname = usePathname();
  const previousPath = useRef<string>('');

  // Track route changes for automatic page impressions
  useEffect(() => {
    // Only log if this is a different page (not initial load)
    if (previousPath.current && previousPath.current !== pathname) {
      const source = getSourceFromPath(pathname);
      logEvent('page_impression', source, EventType.Impression, {
        from: previousPath.current,
        to: pathname,
        // Include the actual pathname for unknown routes
        pathname: source === Source.Unknown ? pathname : undefined
      });
    }
    previousPath.current = pathname;
  }, [pathname, logEvent]);

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