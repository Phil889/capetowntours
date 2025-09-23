'use client';

import { CheckCircle, Zap } from 'lucide-react';
import styles from '@/styles/tour-detail.module.css';
import { useTranslations } from '@/lib/i18n/hooks';

interface TourHighlightsProps {
  highlights: string[];
}

export default function TourHighlights({ highlights }: TourHighlightsProps) {
  const { t } = useTranslations('tour_detail');

  if (!highlights || highlights.length === 0) return null;

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4 flex items-center text-gray-800">
        <Zap className="w-5 h-5 mr-2 text-yellow-500" aria-hidden="true" />
        {t('tour_highlights')}
      </h3>
      <div className={styles.highlightsGrid} role="list">
        {highlights.map((item, idx) => (
          <div key={idx} className={styles.highlightCard} role="listitem">
            <div className={styles.highlightIcon} aria-hidden="true">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className={styles.highlightContent}>
              <p>{item}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
