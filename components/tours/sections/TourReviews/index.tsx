import { Suspense } from 'react';
import TourSectionErrorBoundary from '@/components/tours/TourSectionErrorBoundary';
import ReviewsSkeleton from '@/components/tours/ReviewsSkeleton';
import GuestReviewsSectionSSR from '@/components/tours/GuestReviewsSectionSSR';
import { Locale } from '@/lib/i18n/config';

interface TourReviewsProps {
  tourSlug: string;
  locale?: Locale;
}

export default function TourReviews({ tourSlug, locale = 'en' }: TourReviewsProps) {
  return (
    <TourSectionErrorBoundary sectionName="Guest Reviews">
      <Suspense fallback={<ReviewsSkeleton />}>
        <GuestReviewsSectionSSR tourSlug={tourSlug} locale={locale} />
      </Suspense>
    </TourSectionErrorBoundary>
  );
}
