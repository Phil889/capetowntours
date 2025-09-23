"use client";

import { useState } from "react";
import { X, Calendar, Users, Clock, MapPin } from "lucide-react";
import PremiumBookingWidget from "./PremiumBookingWidget";
import { useTranslations } from "@/lib/i18n/hooks";

interface MobileBookingSheetProps {
  tourId: string;
  price: number;
  tourName: string;
  duration?: string;
  groupSize?: number;
  departureTime?: string;
  pickup?: string;
  reviewSnippet?: string;
  translations?: {
    booking?: {
      from?: string;
      per_person?: string;
      check_availability?: string;
      max?: string;
      book_your_tour?: string;
    };
  };
}

export default function MobileBookingSheet(props: MobileBookingSheetProps) {
  const { translations } = props;
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslations('booking');

  return (
    <>
      {/* Fixed bottom button - only visible on mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm text-gray-600">{translations?.booking?.from || t('from')}</p>
              <p className="text-2xl font-bold text-gray-900">
                R{props.price.toLocaleString()}
                <span className="text-sm font-normal text-gray-600 ml-1">{translations?.booking?.per_person || t('per_person')}</span>
              </p>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors shadow-md"
              aria-label="Open booking form"
            >
              {translations?.booking?.check_availability || t('check_availability')}
            </button>
          </div>
          
          {/* Quick info badges */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {props.duration && (
              <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
                <Clock className="w-3 h-3" />
                {props.duration}
              </div>
            )}
            {props.groupSize && (
              <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
                <Users className="w-3 h-3" />
                {translations?.booking?.max || t('max')} {props.groupSize}
              </div>
            )}
            {props.pickup && (
              <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
                <MapPin className="w-3 h-3" />
                {props.pickup}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom sheet overlay and content */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Bottom sheet */}
          <div
            className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ${
              isOpen ? 'translate-y-0' : 'translate-y-full'
            }`}
            style={{ maxHeight: '85vh' }}
          >
            {/* Handle bar */}
            <div className="flex justify-center py-2">
              <div className="w-12 h-1 bg-gray-300 rounded-full" />
            </div>
            
            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{translations?.booking?.book_your_tour || t('book_your_tour')}</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close booking form"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            {/* Scrollable content */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 80px)' }}>
              <div className="px-4 py-4">
                <PremiumBookingWidget {...props} />
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Add padding to the bottom of the page content to account for fixed button */}
      <div className="lg:hidden h-24" />
    </>
  );
}
