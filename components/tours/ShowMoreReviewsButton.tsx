"use client";
import React, { useState } from "react";

export default function ShowMoreReviewsButton() {
  const [showAll, setShowAll] = useState(false);

  const handleToggle = () => {
    setShowAll(!showAll);
    
    // Toggle visibility of additional reviews
    const additionalReviews = document.querySelector('.additional-reviews') as HTMLDivElement;
    const reviewsContainer = document.querySelector('[class*="reviewsContainer"]') as HTMLDivElement;
    
    if (additionalReviews && reviewsContainer) {
      if (!showAll) {
        // Show more reviews
        additionalReviews.style.display = 'block';
        // Move reviews from hidden div to main container
        const reviews = additionalReviews.querySelectorAll('[class*="reviewCard"]');
        reviews.forEach(review => {
          reviewsContainer.appendChild(review.cloneNode(true));
        });
        additionalReviews.style.display = 'none';
      } else {
        // Show less reviews
        const allReviews = reviewsContainer.querySelectorAll('[class*="reviewCard"]');
        // Keep only first 6 reviews
        allReviews.forEach((review, index) => {
          if (index >= 6) {
            review.remove();
          }
        });
      }
    }
  };

  return (
    <div className="text-center mt-6">
      <button 
        onClick={handleToggle}
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
  );
}
