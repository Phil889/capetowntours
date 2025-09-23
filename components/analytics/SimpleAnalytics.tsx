'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function SimpleAnalyticsImpl() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;
    
    if (GA_TRACKING_ID && typeof window !== 'undefined' && window.gtag) {
      const url = pathname + searchParams.toString();
      window.gtag('config', GA_TRACKING_ID, {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);

  // Track scroll depth for engagement
  useEffect(() => {
    let scrollDepthTracked = { 25: false, 50: false, 75: false, 100: false };

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      Object.keys(scrollDepthTracked).forEach((depth) => {
        const depthNum = parseInt(depth);
        if (scrollPercent >= depthNum && !scrollDepthTracked[depthNum as keyof typeof scrollDepthTracked]) {
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'scroll_depth', {
              event_category: 'Engagement',
              event_label: `${depthNum}%`,
              value: depthNum,
            });
          }
          scrollDepthTracked[depthNum as keyof typeof scrollDepthTracked] = true;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  return null;
}

export default function SimpleAnalytics() {
  return (
    <Suspense fallback={null}>
      <SimpleAnalyticsImpl />
    </Suspense>
  );
}