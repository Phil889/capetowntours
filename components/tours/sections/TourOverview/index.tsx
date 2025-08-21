'use client';

import { Tour } from '@/types/tour-detail';
import { Sparkles } from 'lucide-react';
import TourHighlights from './TourHighlights';
import styles from '@/styles/tour-detail.module.css';

interface TourOverviewProps {
  tour: Tour;
}

export default function TourOverview({ tour }: TourOverviewProps) {
  return (
    <section className={styles.contentCard} aria-labelledby="overview-heading">
      <h2 id="overview-heading" className={styles.sectionTitle}>
        <div className={styles.sectionIcon} aria-hidden="true">
          <Sparkles className="w-4 h-4" />
        </div>
        About this Experience
      </h2>
      
      <p className="text-gray-700 mb-6 leading-relaxed text-lg">
        {tour.description}
      </p>
      
      {tour.highlights && <TourHighlights highlights={tour.highlights} />}
    </section>
  );
}
