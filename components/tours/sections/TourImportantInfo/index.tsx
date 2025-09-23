'use client';

import { Tour } from '@/types/tour-detail';
import { Info, Sun, Users, Calendar } from 'lucide-react';
import styles from '@/styles/tour-detail.module.css';
import { useTranslations } from '@/lib/i18n/hooks';

interface TourImportantInfoProps {
  tour: Tour;
  translations?: {
    important_information?: string;
    seasonal_notes?: string;
    child_policy?: string;
    accessibility?: string;
    cancellation_policy?: string;
  };
}

export default function TourImportantInfo({ tour, translations }: TourImportantInfoProps) {
  const { t } = useTranslations('tour_detail');
  const hasInfo = tour.seasonalNotes || tour.childPolicy || tour.accessibility || tour.cancellationPolicy;
  
  if (!hasInfo) {
    return null;
  }

  return (
    <section className={styles.contentCard} aria-labelledby="info-heading">
      <h2 id="info-heading" className={styles.sectionTitle}>
        <div className={styles.sectionIcon} aria-hidden="true">
          <Info className="w-4 h-4" />
        </div>
        {translations?.important_information || t('important_information')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tour.seasonalNotes && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <Sun className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" aria-hidden="true" />
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">{translations?.seasonal_notes || t('seasonal_notes')}</h4>
                <p className="text-sm text-gray-600">{tour.seasonalNotes}</p>
              </div>
            </div>
          </div>
        )}
        {tour.childPolicy && (
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" aria-hidden="true" />
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">{translations?.child_policy || t('child_policy')}</h4>
                <p className="text-sm text-gray-600">{tour.childPolicy}</p>
              </div>
            </div>
          </div>
        )}
        {tour.accessibility && (
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" aria-hidden="true" />
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">{translations?.accessibility || t('accessibility')}</h4>
                <p className="text-sm text-gray-600">{tour.accessibility}</p>
              </div>
            </div>
          </div>
        )}
        {tour.cancellationPolicy && (
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" aria-hidden="true" />
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">{translations?.cancellation_policy || t('cancellation_policy')}</h4>
                <p className="text-sm text-gray-600">{tour.cancellationPolicy}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
