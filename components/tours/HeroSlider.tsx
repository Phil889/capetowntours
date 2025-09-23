'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const slides = [
  {
    src: '/safari-elephants-river.png',
    alt: 'Safari Elephants crossing a river in South Africa',
  },
  {
    src: '/safari-giraffe-sunset.webp',
    alt: 'Giraffe silhouette against a beautiful African sunset',
  },
  {
    src: '/safari-leopard-tree.png',
    alt: 'Leopard resting in a tree during African safari',
  },
];

interface HeroSliderProps {
  translations: {
    tours: {
      hero: {
        title: string;
        subtitle: string;
        cta: string;
      };
    };
  };
}

export default function HeroSlider({ translations }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full relative min-h-screen py-0 px-0">
      {/* Background slider */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
              currentSlide === index ? 'opacity-80' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              quality={85}
              className="object-cover object-top"
              sizes="100vw"
            />
          </div>
        ))}
        {/* Gradient overlay */}
        <div 
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0) 100%)"
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-6xl mx-auto flex flex-col items-center text-center min-h-screen justify-center px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 text-white drop-shadow-lg tracking-tight">
          {translations.tours.hero.title || "Cape Town's #1 Private Tours & Luxury Safaris"}
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-8 max-w-3xl font-medium">
          {translations.tours.hero.subtitle || "Unforgettable adventures, handpicked by local experts. Experience the best safaris, wine tours, and cultural journeys in South Africa—guaranteed."}
        </p>
        <Link
          href="#tours"
          className="inline-block px-8 sm:px-12 py-4 sm:py-5 bg-white/20 border border-white/40 text-white rounded-full font-bold text-xl sm:text-2xl shadow-xl backdrop-blur-md hover:bg-white/30 transition-all hover:scale-105"
        >
          {translations.tours.hero.cta || "Explore Top Rated Tours & Safaris"}
        </Link>

        {/* Slide indicators */}
        <div className="absolute bottom-10 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === index 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
