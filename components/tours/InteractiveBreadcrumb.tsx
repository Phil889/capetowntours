"use client";

import { ReactNode } from "react";

interface InteractiveBreadcrumbProps {
  href: string;
  children: ReactNode;
  eventLabel?: string;
  className?: string;
}

export default function InteractiveBreadcrumb({ 
  href, 
  children, 
  eventLabel,
  className = "hover:text-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded"
}: InteractiveBreadcrumbProps) {
  const handleClick = () => {
    if (typeof window !== 'undefined' && 'gtag' in window && eventLabel) {
      (window as any).gtag('event', 'breadcrumb_click', {
        event_category: 'Tour Detail',
        event_label: eventLabel,
      });
    }
  };

  return (
    <a 
      href={href} 
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
