'use client';

import { Tour } from '@/types/tour-detail';
import { Navigation } from 'lucide-react';
import styles from '@/styles/tour-detail.module.css';

interface TourItineraryProps {
  tour: Tour;
}

export default function TourItinerary({ tour }: TourItineraryProps) {
  if (!tour.itinerary || tour.itinerary.length === 0) {
    return null;
  }

  return (
    <section className={styles.contentCard} aria-labelledby="itinerary-heading">
      <h2 id="itinerary-heading" className={styles.sectionTitle}>
        <div className={styles.sectionIcon} aria-hidden="true">
          <Navigation className="w-4 h-4" />
        </div>
        Your Journey
      </h2>
      <ol className={styles.itineraryTimeline} role="list">
        {tour.itinerary.map((step, idx) => (
          <li key={idx} className={styles.itineraryStep} role="listitem">
            <div className={styles.itineraryMarker} aria-hidden="true">
              {idx + 1}
            </div>
            <div className={styles.itineraryContent}>
              <h3 className={styles.itineraryTitle}>Stop {idx + 1}</h3>
              <p className={styles.itineraryDescription}>{step}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
