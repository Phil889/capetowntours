'use client';

import { TRUST_INDICATORS } from '@/lib/tour-data/tour-constants';
import styles from '@/styles/tour-detail.module.css';

export default function TourTrustBar() {
  return (
    <div className={styles.trustSection} role="region" aria-label="Trust indicators">
      <div className={styles.trustGrid}>
        {Object.entries(TRUST_INDICATORS).map(([key, indicator]) => {
          const Icon = indicator.icon;
          return (
            <div key={key} className={styles.trustItem}>
              <Icon className={styles.trustIcon} aria-hidden="true" />
              <div className={styles.trustValue}>{indicator.value}</div>
              <div className={styles.trustLabel}>{indicator.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
