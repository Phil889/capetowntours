'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Tour } from '@/types/tour-detail';
import { HelpCircle } from 'lucide-react';
import styles from '@/styles/tour-detail.module.css';

const FAQAccordion = dynamic(
  () => import('@/components/tours/FAQAccordion'),
  {
    loading: () => (
      <div className="animate-pulse">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    ),
    ssr: true,
  }
);

interface TourFAQProps {
  tour: Tour;
}

export default function TourFAQ({ tour }: TourFAQProps) {
  if (!tour.faqs || tour.faqs.length === 0) {
    return null;
  }

  return (
    <section className={styles.contentCard} aria-labelledby="faq-heading">
      <h2 id="faq-heading" className={styles.sectionTitle}>
        <div className={styles.sectionIcon} aria-hidden="true">
          <HelpCircle className="w-4 h-4" />
        </div>
        Frequently Asked Questions
      </h2>
      <Suspense fallback={
        <div className="animate-pulse">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      }>
        <FAQAccordion faqs={tour.faqs.map(faq => ({
          q: faq.question,
          a: faq.answer
        }))} />
      </Suspense>
    </section>
  );
}
