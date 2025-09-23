'use client';

import { Tour } from '@/types/tour-detail';
import { getTourImages, getLocationInfo } from '@/lib/tour-utils';
import { Compass, MapPin, Clock, Users, Navigation, Calendar, Info } from 'lucide-react';
import InteractiveMapLink from '@/components/tours/InteractiveMapLink';
import styles from '@/styles/tour-detail.module.css';
import { useTranslations } from '@/lib/i18n/hooks';

interface TourLocationProps {
  tour: Tour;
  translations?: {
    tour_location?: string;
    departure?: string;
    pickup?: string;
    getting_there?: string;
    duration?: string;
    meeting_point?: string;
    pickup_included?: string;
    self_drive?: string;
    details_after_booking?: string;
  };
}

export default function TourLocation({ tour, translations }: TourLocationProps) {
  const { t } = useTranslations('tour_detail');
  const locationInfo = getLocationInfo(tour);

  return (
    <section className={styles.contentCard} aria-labelledby="location-heading">
      <h2 id="location-heading" className={styles.sectionTitle}>
        <div className={styles.sectionIcon} aria-hidden="true">
          <Compass className="w-4 h-4" />
        </div>
        {translations?.tour_location || t('tour_location')}
      </h2>
      
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-full shadow-md" aria-hidden="true">
            <MapPin className="w-8 h-8 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-800 mb-2">
              {locationInfo.name}
            </h3>
            <p className="text-gray-700 mb-3">
              {locationInfo.address}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" aria-hidden="true" />
                <span className="text-gray-600">
                  {translations?.departure || t('departure')}: {locationInfo.departureTime}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600" aria-hidden="true" />
                <span className="text-gray-600">
                  {translations?.pickup || t('pickup')}: {locationInfo.pickup}
                </span>
              </div>
            </div>
            
            <div className="mt-4">
              <InteractiveMapLink
                mapsQuery={locationInfo.mapsQuery}
                tourSlug={tour.slug}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Navigation className="w-5 h-5 text-amber-600" aria-hidden="true" />
            <h4 className="font-semibold text-gray-800">{translations?.getting_there || t('getting_there')}</h4>
          </div>
          <p className="text-sm text-gray-600">
            {tour.pickup ? (translations?.pickup_included || t('pickup_included')) : (translations?.self_drive || t('self_drive'))}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-amber-600" aria-hidden="true" />
            <h4 className="font-semibold text-gray-800">{translations?.duration || t('duration')}</h4>
          </div>
          <p className="text-sm text-gray-600">{locationInfo.duration}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-5 h-5 text-amber-600" aria-hidden="true" />
            <h4 className="font-semibold text-gray-800">{translations?.meeting_point || t('meeting_point')}</h4>
          </div>
          <p className="text-sm text-gray-600">
            {tour.pickup || (translations?.details_after_booking || t('details_after_booking'))}
          </p>
        </div>
      </div>
    </section>
  );
}
