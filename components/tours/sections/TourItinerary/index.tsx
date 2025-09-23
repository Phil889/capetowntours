'use client';

import { Tour } from '@/types/tour-detail';
import { Navigation } from 'lucide-react';
import styles from '@/styles/tour-detail.module.css';
import { useTranslations } from '@/lib/i18n/hooks';

interface TourItineraryProps {
  tour: Tour;
  translations?: {
    your_journey?: string;
    stop_number?: string;
  };
}

export default function TourItinerary({ tour, translations }: TourItineraryProps) {
  const { t } = useTranslations('tour_detail');

  if (!tour.itinerary || tour.itinerary.length === 0) {
    return null;
  }

  return (
    <section className={styles.contentCard} aria-labelledby="itinerary-heading">
      <h2 id="itinerary-heading" className={styles.sectionTitle}>
        <div className={styles.sectionIcon} aria-hidden="true">
          <Navigation className="w-4 h-4" />
        </div>
        {translations?.your_journey || t('your_journey')}
      </h2>
      <ol className={styles.itineraryTimeline} role="list">
        {tour.itinerary.map((step, idx) => (
          <li key={idx} className={styles.itineraryStep} role="listitem">
            <div className={styles.itineraryMarker} aria-hidden="true">
              {idx + 1}
            </div>
            <div className={styles.itineraryContent}>
              <h3 className={styles.itineraryTitle}>{translations?.stop_number ? translations.stop_number.replace('{{number}}', (idx + 1).toString()) : t('stop_number', { number: (idx + 1).toString() })}</h3>
              <p className={styles.itineraryDescription}>{step}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
