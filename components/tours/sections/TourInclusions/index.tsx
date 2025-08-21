'use client';

import { Tour } from '@/types/tour-detail';
import { CheckCircle, XCircle } from 'lucide-react';
import styles from '@/styles/tour-detail.module.css';

interface TourInclusionsProps {
  tour: Tour;
}

export default function TourInclusions({ tour }: TourInclusionsProps) {
  if (!tour.included?.length && !tour.excluded?.length) {
    return null;
  }

  return (
    <section className={styles.contentCard} aria-labelledby="inclusions-heading">
      <h2 id="inclusions-heading" className={styles.sectionTitle}>
        <div className={styles.sectionIcon} aria-hidden="true">
          <CheckCircle className="w-4 h-4" />
        </div>
        Inclusions & Exclusions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tour.included && tour.included.length > 0 && (
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <h3 className="font-semibold text-lg mb-4 flex items-center text-green-800">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" aria-hidden="true" />
              What's Included
            </h3>
            <ul className="space-y-2" role="list">
              {tour.included.map((item, idx) => (
                <li key={idx} className="flex items-start" role="listitem">
                  <CheckCircle className="w-4 h-4 mr-3 mt-1 text-green-600 flex-shrink-0" aria-hidden="true" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {tour.excluded && tour.excluded.length > 0 && (
          <div className="bg-red-50 rounded-xl p-6 border border-red-200">
            <h3 className="font-semibold text-lg mb-4 flex items-center text-red-800">
              <XCircle className="w-5 h-5 mr-2 text-red-600" aria-hidden="true" />
              Not Included
            </h3>
            <ul className="space-y-2" role="list">
              {tour.excluded.map((item, idx) => (
                <li key={idx} className="flex items-start" role="listitem">
                  <XCircle className="w-4 h-4 mr-3 mt-1 text-red-600 flex-shrink-0" aria-hidden="true" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
