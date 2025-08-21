"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, Play, Award, Clock, Users, MapPin } from "lucide-react";
import styles from "@/styles/tour-detail.module.css";

interface TourHeroGalleryProps {
  title: string;
  images: string[];
  badges?: {
    icon: React.ReactNode;
    label: string;
    value: string;
  }[];
  videoUrl?: string;
}

export default function TourHeroGallery({ 
  title, 
  images = [], 
  badges = [],
  videoUrl 
}: TourHeroGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  // Use the first image or a placeholder if no images
  const displayImages = images.length > 0 ? images : ["/placeholder.jpg"];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    document.body.style.overflow = 'unset';
  };

  // Default badges if none provided
  const defaultBadges = badges.length > 0 ? badges : [
    { icon: <Award className="w-4 h-4" />, label: "Best", value: "Seller" },
    { icon: <Clock className="w-4 h-4" />, label: "Instant", value: "Confirmation" },
    { icon: <Users className="w-4 h-4" />, label: "Small", value: "Groups" },
    { icon: <MapPin className="w-4 h-4" />, label: "Hotel", value: "Pickup" }
  ];

  return (
    <>
      <div className={styles.heroSection}>
        <div className="relative w-full h-full">
          {/* Main Image */}
          <img
            src={displayImages[currentImageIndex]}
            alt={`${title} - Image ${currentImageIndex + 1}`}
            className={styles.heroImage}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.jpg";
            }}
          />
          
          {/* Gradient Overlay */}
          <div className={styles.heroOverlay} />
          
          {/* Gallery Controls */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/30 transition-all z-20"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/30 transition-all z-20"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}
          
          {/* Image Counter */}
          {displayImages.length > 1 && (
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm z-20">
              {currentImageIndex + 1} / {displayImages.length}
            </div>
          )}
          
          {/* View Controls */}
          <div className="absolute top-4 left-4 flex gap-2 z-20">
            <button
              onClick={openFullscreen}
              className="bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/30 transition-all"
              aria-label="View fullscreen"
            >
              <ZoomIn className="w-5 h-5 text-white" />
            </button>
            {videoUrl && (
              <button
                onClick={() => setShowVideo(true)}
                className="bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/30 transition-all"
                aria-label="Play video"
              >
                <Play className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
          
          {/* Hero Content */}
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>{title}</h1>
            <div className={styles.heroBadges}>
              {defaultBadges.map((badge, index) => (
                <div key={index} className={styles.heroBadge}>
                  {badge.icon}
                  <span>{badge.label} {badge.value}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Thumbnail Strip */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-24 left-0 right-0 px-8 z-20">
              <div className="flex gap-2 justify-center overflow-x-auto pb-2">
                {displayImages.slice(0, 5).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex 
                        ? 'border-white scale-110' 
                        : 'border-white/50 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.jpg";
                      }}
                    />
                  </button>
                ))}
                {displayImages.length > 5 && (
                  <button
                    onClick={openFullscreen}
                    className="flex-shrink-0 w-16 h-16 rounded-lg bg-black/50 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center text-white text-sm font-semibold hover:bg-black/70 transition-all"
                  >
                    +{displayImages.length - 5}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Fullscreen Gallery Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95">
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 z-50"
            aria-label="Close fullscreen"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="w-full h-full flex items-center justify-center p-8">
            <button
              onClick={prevImage}
              className="absolute left-4 bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/30 transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            
            <img
              src={displayImages[currentImageIndex]}
              alt={`${title} - Fullscreen ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.jpg";
              }}
            />
            
            <button
              onClick={nextImage}
              className="absolute right-4 bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/30 transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
          
          {/* Fullscreen Thumbnail Strip */}
          <div className="absolute bottom-8 left-0 right-0 px-8">
            <div className="flex gap-2 justify-center overflow-x-auto pb-2">
              {displayImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === currentImageIndex 
                      ? 'border-white scale-110' 
                      : 'border-white/50 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`Fullscreen thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.jpg";
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Video Modal */}
      {showVideo && videoUrl && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-8">
          <button
            onClick={() => setShowVideo(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
            aria-label="Close video"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="w-full max-w-5xl aspect-video">
            <iframe
              src={videoUrl}
              className="w-full h-full rounded-lg"
              allowFullScreen
              title={`${title} Video`}
            />
          </div>
        </div>
      )}
    </>
  );
}
