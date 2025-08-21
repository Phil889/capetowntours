"use client";

import { MapPin } from "lucide-react";

interface InteractiveMapLinkProps {
  mapsQuery: string;
  tourSlug: string;
}

export default function InteractiveMapLink({ mapsQuery, tourSlug }: InteractiveMapLinkProps) {
  const handleClick = () => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'map_view', {
        event_category: 'Tour Detail',
        event_label: tourSlug,
      });
    }
  };

  return (
    <a
      href={`https://www.google.com/maps/search/${encodeURIComponent(mapsQuery)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
      onClick={handleClick}
    >
      <MapPin className="w-4 h-4" aria-hidden="true" />
      View on Google Maps
    </a>
  );
}
