"use client";
import React, { useState, useEffect } from "react";
import BookingWidget from "./booking-widget";
import {
  Calendar,
  Users,
  Clock,
  MapPin,
  Star,
  Shield,
  Award,
  TrendingUp,
  CheckCircle,
  Phone,
  MessageCircle
} from "lucide-react";
import styles from "@/styles/tour-detail.module.css";
import { useTranslations } from "@/lib/i18n/hooks";

interface PremiumBookingWidgetProps {
  tourId: string;
  price: string | number;
  tourName?: string;
  duration?: string;
  groupSize?: number;
  departureTime?: string;
  pickup?: string;
  reviewSnippet?: string;
  translations?: {
    booking?: {
      per_person?: string;
      best_price_guarantee?: string;
      people_viewing_now?: string;
      booked_today?: string;
      max_group_size?: string;
      top_rated?: string;
      verified_operator?: string;
      operator?: string;
      rating?: string;
      chat_with_us?: string;
      call_us?: string;
      free_cancellation_24h?: string;
      recent_guest_review?: string;
    };
    tour_detail?: {
      duration?: string;
      departure?: string;
      pickup?: string;
    };
  };
}

export default function PremiumBookingWidget({
  tourId,
  price,
  tourName,
  duration,
  groupSize,
  departureTime,
  pickup,
  reviewSnippet,
  translations,
}: PremiumBookingWidgetProps) {
  const { t } = useTranslations('booking');
  const { t: tTour } = useTranslations('tour_detail');
  const [showUrgency, setShowUrgency] = useState(false);
  const [bookingsToday] = useState(Math.floor(Math.random() * 8) + 3);
  const [viewingNow] = useState(Math.floor(Math.random() * 15) + 5);

  useEffect(() => {
    // Show urgency message after 3 seconds
    const timer = setTimeout(() => {
      setShowUrgency(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const InfoRow = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value?: string | number | null;
  }) => {
    if (!value) return null;
    return (
      <div className="flex items-center text-sm text-gray-600 py-2 border-b border-gray-100 last:border-0">
        <div className="w-5 h-5 mr-3 text-amber-600">{icon}</div>
        <span className="font-medium text-gray-700">{label}:</span>
        <span className="ml-auto font-semibold text-gray-900">{value}</span>
      </div>
    );
  };

  return (
    <div className={styles.premiumBookingWidget}>
      {/* Price Header */}
      <div className={styles.bookingHeader}>
        <div className={styles.priceDisplay}>
          <span className={styles.priceCurrency}>R</span>
          <span className={styles.priceAmount}>
            {typeof price === 'number' ? price.toLocaleString() : price.replace(/[^0-9]/g, '')}
          </span>
          <span className={styles.priceUnit}>{translations?.booking?.per_person || t('per_person')}</span>
        </div>
        <div className="flex items-center gap-2 text-white/90 text-sm">
          <Shield className="w-4 h-4" />
          <span>{translations?.booking?.best_price_guarantee || t('best_price_guarantee')}</span>
        </div>
      </div>

      {/* Live Activity Indicator */}
      {showUrgency && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-800">
                {viewingNow} {translations?.booking?.people_viewing_now || t('people_viewing_now')}
              </span>
            </div>
            <div className="flex items-center gap-1 text-orange-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-semibold">{bookingsToday} {translations?.booking?.booked_today || t('booked_today')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tour Quick Info */}
      <div className="px-6 py-4 bg-gray-50/50">
        <InfoRow icon={<Clock />} label={translations?.tour_detail?.duration || tTour('duration')} value={duration} />
        <InfoRow icon={<Users />} label={translations?.booking?.max_group_size || t('max_group_size')} value={groupSize} />
        <InfoRow icon={<Calendar />} label={translations?.tour_detail?.departure || tTour('departure')} value={departureTime} />
        <InfoRow icon={<MapPin />} label={translations?.tour_detail?.pickup || tTour('pickup')} value={pickup} />
      </div>

      {/* Trust Badges */}
      <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="flex flex-col items-center">
            <Award className="w-6 h-6 text-amber-600 mb-1" />
            <span className="text-xs font-semibold text-gray-700">{translations?.booking?.top_rated || t('top_rated')}</span>
            <span className="text-xs text-gray-500">2024</span>
          </div>
          <div className="flex flex-col items-center">
            <Shield className="w-6 h-6 text-amber-700 mb-1" />
            <span className="text-xs font-semibold text-gray-700">{translations?.booking?.verified_operator || t('verified_operator')}</span>
            <span className="text-xs text-gray-500">{translations?.booking?.operator || t('operator')}</span>
          </div>
          <div className="flex flex-col items-center">
            <Star className="w-6 h-6 text-yellow-500 mb-1" />
            <span className="text-xs font-semibold text-gray-700">4.9/5</span>
            <span className="text-xs text-gray-500">{translations?.booking?.rating || t('rating')}</span>
          </div>
        </div>
      </div>

      {/* Review Snippet */}
      {reviewSnippet && (
        <div className="mx-6 my-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
          <div className="flex items-start gap-2">
            <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm italic text-gray-700">"{reviewSnippet}"</p>
              <p className="text-xs text-gray-500 mt-1">{translations?.booking?.recent_guest_review || t('recent_guest_review')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Original Booking Widget */}
      <div className={styles.bookingBody}>
        <BookingWidget 
          tourId={tourId} 
          price={price} 
          tourName={tourName} 
          translations={translations}
        />
      </div>

      {/* Additional Features */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-center gap-4 py-3 border-t border-gray-200">
          <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-amber-600 transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span>{translations?.booking?.chat_with_us || t('chat_with_us')}</span>
          </button>
          <div className="w-px h-4 bg-gray-300" />
          <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-amber-600 transition-colors">
            <Phone className="w-4 h-4" />
            <span>{translations?.booking?.call_us || t('call_us')}</span>
          </button>
        </div>
      </div>

      {/* Bottom Trust Message */}
      <div className="bg-green-50 px-4 py-3 text-center border-t border-green-100">
        <div className="flex items-center justify-center gap-2 text-green-700">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">{translations?.booking?.free_cancellation_24h || t('free_cancellation_24h')}</span>
        </div>
      </div>
    </div>
  );
}
