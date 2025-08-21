import Image from 'next/image';
import Link from 'next/link';
import { Tour } from '@/types/tour';
import { formatPrice } from '@/lib/tours';
import { Clock, Users } from 'lucide-react';

interface TourCardProps {
  tour: Tour;
}

export default function TourCardEnhanced({ tour }: TourCardProps) {
  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="border rounded-2xl shadow-lg bg-white block hover:shadow-xl transition-all duration-300 group overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        {tour.image_url ? (
          <Image
            src={tour.image_url}
            alt={tour.image_alt || tour.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <span className="text-blue-600 text-lg font-semibold">
              {tour.title}
            </span>
          </div>
        )}
        {tour.category && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-blue-800 text-xs font-semibold uppercase shadow-md">
              {tour.category}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-brand-primary group-hover:text-blue-700 transition-colors line-clamp-2">
          {tour.title}
        </h3>
        
        <p className="mb-4 text-gray-700 line-clamp-3">
          {tour.description}
        </p>
        
        {/* Tour details */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          {tour.duration_days && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>
                {tour.duration_days} {tour.duration_days === 1 ? 'day' : 'days'}
              </span>
            </div>
          )}
          {tour.max_group_size && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>Max {tour.max_group_size}</span>
            </div>
          )}
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-green-700">
              {formatPrice(tour.price, tour.currency)}
            </span>
            <span className="text-sm text-gray-500 ml-1">per person</span>
          </div>
          <button
            className="px-4 py-2 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-primary/90 transition-colors text-sm"
            tabIndex={-1}
          >
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
}
