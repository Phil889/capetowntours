'use client';

import { Tour } from '@/types/tour-detail';
import React, { ReactNode } from 'react';
import TourHeroGallery from '@/components/tours/TourHeroGallery';
import TourTrustBar from '@/components/tours/sections/TourTrustBar';
import PremiumBookingWidget from '@/components/tours/PremiumBookingWidget';
import MobileBookingSheet from '@/components/tours/MobileBookingSheet';
import TourSectionErrorBoundary from '@/components/tours/TourSectionErrorBoundary';
import InteractiveBreadcrumb from '@/components/tours/InteractiveBreadcrumb';
import { getTourImages } from '@/lib/tour-utils';
import { getIntegerValue, getNumericValue, getStringValue } from '@/lib/validation-helpers';
import { useTranslations } from '@/lib/i18n/hooks';

interface TourPageTemplateProps {
  tour: Tour;
  children: ReactNode;
  translations?: {
    badges?: {
      best_seller?: string;
      verified_tour?: string;
      rating?: string;
      guest_favorite?: string;
    };
    trustIndicators?: {
      guest_rating?: string;
      verified_reviews?: string;
      happy_guests?: string;
      tour_operator?: string;
    };
    booking?: {
      per_person?: string;
      best_price_guarantee?: string;
      people_viewing_now?: string;
      booked_today?: string;
      max_group_size?: string;
      top_rated?: string;
      verified_operator?: string;
      operator?: string;
      rating?: string;
      chat_with_us?: string;
      call_us?: string;
      free_cancellation_24h?: string;
      recent_guest_review?: string;
      from?: string;
      check_availability?: string;
      max?: string;
      book_your_tour?: string;
    };
    tour_detail?: {
      duration?: string;
      departure?: string;
      pickup?: string;
      your_journey?: string;
      stop_number?: string;
      important_information?: string;
      seasonal_notes?: string;
      child_policy?: string;
      accessibility?: string;
      cancellation_policy?: string;
      tour_location?: string;
      getting_there?: string;
      meeting_point?: string;
      pickup_included?: string;
      self_drive?: string;
      details_after_booking?: string;
    };
  };
}

export default function TourPageTemplate({ tour, children, translations }: TourPageTemplateProps) {
  const { t } = useTranslations('navigation');
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
        {t('skip_to_content')}
      </a>

      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
        {/* Hero Gallery */}
        <TourSectionErrorBoundary sectionName="Gallery">
          <TourHeroGallery
            title={tour.title}
            images={tourImages}
            translations={translations?.badges}
          />
        </TourSectionErrorBoundary>

        <main id="main-content" className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
            <InteractiveBreadcrumb href="/" eventLabel="home">
              {t('home')}
            </InteractiveBreadcrumb>
            <span aria-hidden="true">/</span>
            <InteractiveBreadcrumb href="/tours" eventLabel="tours">
              {t('tours')}
            </InteractiveBreadcrumb>
            <span aria-hidden="true">/</span>
            <span className="text-gray-900 font-medium" aria-current="page">{tour.title}</span>
          </nav>

          {/* Trust Indicators */}
          <TourTrustBar translations={translations?.trustIndicators} />

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
                  translations={{
                    booking: translations?.booking,
                    tour_detail: translations?.tour_detail
                  }}
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
        translations={{
          booking: translations?.booking
        }}
      />

      {/* No-JS Fallback */}
      <noscript>
        <div className="fixed bottom-0 left-0 right-0 bg-amber-600 text-white p-4 text-center z-50">
          <p className="mb-2">{t('javascript_required')}</p>
          <a href="tel:+27214245215" className="font-bold underline">
            {t('call_to_book')}
          </a>
        </div>
      </noscript>
    </>
  );
}
