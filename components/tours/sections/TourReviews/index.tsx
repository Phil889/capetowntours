'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import TourSectionErrorBoundary from '@/components/tours/TourSectionErrorBoundary';
import ReviewsSkeleton from '@/components/tours/ReviewsSkeleton';

const GuestReviewsSection = dynamic(
  () => import('@/components/tours/GuestReviewsSectionSSR'),
  {
    loading: () => <ReviewsSkeleton />,
    ssr: true,
  }
);

interface TourReviewsProps {
  tourSlug: string;
}

export default function TourReviews({ tourSlug }: TourReviewsProps) {
  return (
    <TourSectionErrorBoundary sectionName="Guest Reviews">
      <Suspense fallback={<ReviewsSkeleton />}>
        <GuestReviewsSection tourSlug={tourSlug} />
      </Suspense>
    </TourSectionErrorBoundary>
  );
}
