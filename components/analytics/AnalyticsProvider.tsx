'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview, trackScrollDepth } from '@/lib/gtag';

function AnalyticsProviderImpl({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views
  useEffect(() => {
    const url = pathname + searchParams.toString();
    pageview(url);
  }, [pathname, searchParams]);

  // Track scroll depth for engagement metrics
  useEffect(() => {
    let scrollDepthTracked = {
      25: false,
      50: false,
      75: false,
      100: false,
    };

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      Object.keys(scrollDepthTracked).forEach((depth) => {
        const depthNum = parseInt(depth);
        if (scrollPercent >= depthNum && !scrollDepthTracked[depthNum as keyof typeof scrollDepthTracked]) {
          trackScrollDepth(depthNum);
          scrollDepthTracked[depthNum as keyof typeof scrollDepthTracked] = true;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  return <>{children}</>;
}

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <AnalyticsProviderImpl>{children}</AnalyticsProviderImpl>
    </Suspense>
  );
}