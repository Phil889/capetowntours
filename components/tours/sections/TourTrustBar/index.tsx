'use client';

import { TRUST_INDICATORS } from '@/lib/tour-data/tour-constants';
import styles from '@/styles/tour-detail.module.css';
import { useTranslations } from '@/lib/i18n/hooks';

interface TourTrustBarProps {
  translations?: {
    guest_rating?: string;
    verified_reviews?: string;
    happy_guests?: string;
    tour_operator?: string;
  };
}

export default function TourTrustBar({ translations }: TourTrustBarProps) {
  const { t } = useTranslations('trust_indicators');
  // Create translation mappings for trust indicator labels - use server-side translations if available
  const labelTranslations = {
    rating: translations?.guest_rating || t('guest_rating'),
    reviews: translations?.verified_reviews || t('verified_reviews'),
    guests: translations?.happy_guests || t('happy_guests'),
    ranking: translations?.tour_operator || t('tour_operator')
  };

  return (
    <div className={styles.trustSection} role="region" aria-label="Trust indicators">
      <div className={styles.trustGrid}>
        {Object.entries(TRUST_INDICATORS).map(([key, indicator]) => {
          const Icon = indicator.icon;
          const translatedLabel = labelTranslations[key as keyof typeof labelTranslations] || indicator.label;
          return (
            <div key={key} className={styles.trustItem}>
              <Icon className={styles.trustIcon} aria-hidden="true" />
              <div className={styles.trustValue}>{indicator.value}</div>
              <div className={styles.trustLabel}>{translatedLabel}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
