'use client';

import { Tour } from '@/types/tour-detail';
import { ReactNode } from 'react';
import TourHeroGallery from '@/components/tours/TourHeroGallery';
import TourTrustBar from '@/components/tours/sections/TourTrustBar';
import PremiumBookingWidget from '@/components/tours/PremiumBookingWidget';
import MobileBookingSheet from '@/components/tours/MobileBookingSheet';
import TourSectionErrorBoundary from '@/components/tours/TourSectionErrorBoundary';
import InteractiveBreadcrumb from '@/components/tours/InteractiveBreadcrumb';
import { getTourImages } from '@/lib/tour-utils';
import { getIntegerValue, getNumericValue, getStringValue } from '@/lib/validation-helpers';
import { TOUR_BADGES } from '@/lib/tour-data/tour-constants';

interface TourPageTemplateProps {
  tour: Tour;
  children: ReactNode;
}

export default function TourPageTemplate({ tour, children }: TourPageTemplateProps) {
  const tourImages = getTourImages(tour);
  const validatedPrice = getNumericValue(tour.price, 0);
  const validatedGroupSize = getIntegerValue(tour.groupSizeMax, 10);
  const validatedTourName = getStringValue(tour.title);
  const validatedDuration = getStringValue(tour.duration);

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-600 focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>

      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
        {/* Hero Gallery */}
        <TourSectionErrorBoundary sectionName="Gallery">
          <TourHeroGallery 
            title={tour.title}
            images={tourImages}
            badges={TOUR_BADGES}
          />
        </TourSectionErrorBoundary>

        <main id="main-content" className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
            <InteractiveBreadcrumb href="/" eventLabel="home">
              Home
            </InteractiveBreadcrumb>
            <span aria-hidden="true">/</span>
            <InteractiveBreadcrumb href="/tours" eventLabel="tours">
              Tours
            </InteractiveBreadcrumb>
            <span aria-hidden="true">/</span>
            <span className="text-gray-900 font-medium" aria-current="page">{tour.title}</span>
          </nav>

          {/* Trust Indicators */}
          <TourTrustBar />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2">
              {children}
            </div>

            {/* Sticky Booking Widget - Desktop only */}
            <aside className="hidden lg:block lg:col-span-1" role="complementary" aria-label="Booking information">
              <TourSectionErrorBoundary sectionName="Booking">
                <PremiumBookingWidget
                  tourId={tour.id}
                  price={validatedPrice}
                  tourName={validatedTourName}
                  duration={validatedDuration}
                  groupSize={validatedGroupSize}
                  departureTime={tour.departureTime}
                  pickup={tour.pickup}
                  reviewSnippet={tour.reviewSnippet}
                />
              </TourSectionErrorBoundary>
            </aside>
          </div>
        </main>
      </div>
      
      {/* Mobile Booking Sheet */}
      <MobileBookingSheet
        tourId={tour.id}
        price={validatedPrice}
        tourName={validatedTourName}
        duration={validatedDuration}
        groupSize={validatedGroupSize}
        departureTime={tour.departureTime}
        pickup={tour.pickup}
        reviewSnippet={tour.reviewSnippet}
      />

      {/* No-JS Fallback */}
      <noscript>
        <div className="fixed bottom-0 left-0 right-0 bg-amber-600 text-white p-4 text-center z-50">
          <p className="mb-2">JavaScript is required for online booking.</p>
          <a href="tel:+27214245215" className="font-bold underline">
            Call to book: +27 21 424 5215
          </a>
        </div>
      </noscript>
    </>
  );
}
