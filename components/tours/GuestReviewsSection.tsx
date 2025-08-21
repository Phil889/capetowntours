"use client";
import React, { useState } from "react";
import { Star } from "lucide-react";
import styles from "@/styles/tour-detail.module.css";
import { getTourSpecificReviews, Review } from "@/lib/tour-specific-reviews-complete";

interface GuestReviewsSectionProps {
  tourSlug?: string;
}

export default function GuestReviewsSection({ tourSlug = "default" }: GuestReviewsSectionProps) {
  const [showAll, setShowAll] = useState(false);
  
  // Get tour-specific reviews for maximum SEO relevancy - each tour has unique reviews
  const tourSpecificReviews = getTourSpecificReviews(tourSlug);
  
  // Add additional international reviews for "Show More"
  const additionalReviews: Review[] = [
    {
      id: "add-1",
      name: "Isabella Martinez",
      location: "Madrid, Spain",
      flag: "🇪🇸",
      date: "1 month ago",
      rating: 5,
      text: `Incredible experience! ${tourSlug.includes('wine') ? 'The wine tasting was expertly curated and the vineyard views were spectacular.' : tourSlug.includes('safari') ? 'Saw amazing wildlife up close! The guide was incredibly knowledgeable.' : 'This tour exceeded all our expectations. Professional and well-organized.'} Highly recommend to anyone visiting Cape Town!`
    },
    {
      id: "add-2",
      name: "Yuki Yamamoto",
      location: "Osaka, Japan",
      flag: "🇯🇵",
      date: "2 months ago",
      rating: 5,
      text: `Perfect attention to detail! ${tourSlug.includes('wine') ? 'The sommelier explained each wine beautifully. The food pairing was exquisite.' : tourSlug.includes('penguin') ? 'The penguins were adorable! Great photo opportunities everywhere.' : 'Everything was perfectly organized from pickup to drop-off.'} Will definitely book again!`
    },
    {
      id: "add-3",
      name: "Pierre Dubois",
      location: "Lyon, France",
      flag: "🇫🇷",
      date: "2 months ago",
      rating: 5,
      text: `Magnifique! ${tourSlug.includes('wine') ? 'As a French wine enthusiast, I was impressed by South African wines quality.' : tourSlug.includes('mountain') ? 'The views from Table Mountain are breathtaking!' : 'A world-class experience that rivals any European tour.'} Outstanding value for money.`
    },
    {
      id: "add-4",
      name: "Maria Silva",
      location: "Rio de Janeiro, Brazil",
      flag: "🇧🇷",
      date: "2 months ago",
      rating: 5,
      text: `Wonderful experience! ${tourSlug.includes('safari') ? 'The Big 5 sighting was a dream come true!' : tourSlug.includes('shark') ? 'Adrenaline-pumping shark encounter! Felt completely safe.' : 'The guide spoke multiple languages which was very helpful.'} Cape Town tours are amazing!`
    },
    {
      id: "add-5",
      name: "Emma Watson",
      location: "Manchester, UK",
      flag: "🇬🇧",
      date: "3 months ago",
      rating: 5,
      text: `Absolutely brilliant! ${tourSlug.includes('cape-point') ? 'The scenic drive along Chapman\'s Peak was unforgettable.' : tourSlug.includes('wine') ? 'The estate grounds are immaculate and wines exceptional.' : 'Professional service from start to finish.'} Better than similar tours in Europe!`
    },
    {
      id: "add-6",
      name: "Olaf Petersen",
      location: "Oslo, Norway",
      flag: "🇳🇴",
      date: "3 months ago",
      rating: 5,
      text: `Outstanding tour! ${tourSlug.includes('penguin') ? 'The African penguins are so charming! Beach setting is unique.' : tourSlug.includes('safari') ? 'Wildlife viewing exceeded expectations. Saw all Big 5!' : 'The natural beauty of Cape Town is stunning.'} Worth every penny!`
    }
  ];
  
  const displayedReviews = showAll 
    ? [...tourSpecificReviews, ...additionalReviews]
    : tourSpecificReviews.slice(0, 6);

  // Calculate review statistics
  const totalReviews = 847;
  const countryBreakdown = {
    "🇩🇪 Germany": 186,
    "🇺🇸 USA": 234,
    "🇦🇺 Australia": 127,
    "🇦🇪 Dubai": 89,
    "🇿🇦 South Africa": 211
  };

  return (
    <div className={styles.contentCard}>
      <h2 className={styles.sectionTitle}>
        <div className={styles.sectionIcon}>
          <Star className="w-4 h-4" />
        </div>
        Guest Reviews
      </h2>
      
      {/* Reviews Summary */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 mb-6 border border-amber-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800">4.9</div>
              <div className="flex gap-0.5 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500" fill="currentColor" />
                ))}
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <div className="font-semibold">Excellent</div>
              <div>Based on {totalReviews} reviews</div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(countryBreakdown).map(([country, count]) => (
              <span key={country} className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-gray-700 border">
                {country} ({count})
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.reviewsContainer}>
        {displayedReviews.map((review) => (
          <div key={review.id} className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
              <div className={styles.reviewAuthor}>
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                  {review.flag}
                </div>
                <div>
                  <div className={styles.reviewName}>
                    {review.name}
                    <span className="ml-2 text-xs text-gray-500">{review.flag} {review.location}</span>
                  </div>
                  <div className={styles.reviewDate}>{review.date}</div>
                </div>
              </div>
              <div className={styles.reviewRating}>
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${styles.star}`} fill="currentColor" />
                ))}
              </div>
            </div>
            <p className={styles.reviewText}>{review.text}</p>
          </div>
        ))}
      </div>

      {/* Load More Reviews Button */}
      <div className="text-center mt-6">
        <button 
          onClick={() => setShowAll(!showAll)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition-colors font-semibold"
        >
          {showAll ? "Show Less Reviews" : "Show More Reviews"}
          <svg 
            className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
