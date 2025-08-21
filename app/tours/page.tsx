import { Metadata } from 'next';
import { Suspense } from 'react';
import { getTours } from '@/lib/tours';
import HeroSlider from '@/components/tours/HeroSlider';
import TrustBadges from '@/components/tours/TrustBadges';
import ValueProposition from '@/components/tours/ValueProposition';
import TourCardEnhanced from '@/components/tours/TourCardEnhanced';
import ToursLoadingSkeleton from '@/components/tours/ToursLoadingSkeleton';
import '@/styles/animations.css';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Cape Town Safari Tours | Best Private Tours & Luxury Safaris 2025',
  description: 'Experience Cape Town\'s #1 rated private tours and luxury safaris. TripAdvisor Certificate of Excellence winner. Small groups, expert guides, best price guarantee.',
  keywords: 'Cape Town tours, safari tours, private tours Cape Town, luxury safaris, wine tours, penguin tours, Table Mountain tours',
  openGraph: {
    title: 'Cape Town Safari Tours | Best Private Tours & Luxury Safaris',
    description: 'Experience Cape Town\'s #1 rated private tours and luxury safaris. Small groups, expert guides, best price guarantee.',
    url: 'https://capetownsafaritours.com/tours',
    siteName: 'Cape Town Safari Tours',
    images: [
      {
        url: '/safari-elephants-river.png',
        width: 1200,
        height: 630,
        alt: 'Cape Town Safari Tours - Luxury Safari Experience',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cape Town Safari Tours | Best Private Tours & Luxury Safaris',
    description: 'Experience Cape Town\'s #1 rated private tours and luxury safaris.',
    images: ['/safari-elephants-river.png'],
  },
  alternates: {
    canonical: 'https://capetownsafaritours.com/tours',
  },
};

// Generate structured data for SEO
function generateStructuredData(tours: any[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Cape Town Safari Tours - All Tours',
    description: 'Browse our collection of top-rated Cape Town tours and safaris',
    numberOfItems: tours.length,
    itemListElement: tours.map((tour, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: tour.title,
        description: tour.description,
        offers: {
          '@type': 'Offer',
          price: tour.price,
          priceCurrency: tour.currency,
          availability: 'https://schema.org/InStock',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '1000',
        },
      },
    })),
  };
}

// Tours Section Component
async function ToursSection() {
  const tours = await getTours();

  if (!tours || tours.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-700">
            No Tours Available
          </h2>
          <p className="text-gray-600 mb-8">
            We're currently updating our tour catalog. Please check back soon or contact us for custom tour arrangements.
          </p>
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-primary/90 transition"
          >
            Contact Us
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Add structured data to page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData(tours)),
        }}
      />
      
      <section id="tours" className="w-full bg-gray-50 py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-brand-primary tracking-tight text-center drop-shadow-sm">
            Featured Top Rated Tours &amp; Safaris
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {tours.map((tour) => (
              <TourCardEnhanced key={tour.id} tour={tour} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// Main Page Component
export default function ToursCataloguePage() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section with Slider */}
      <HeroSlider />
      
      {/* Trust Badges */}
      <section className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <TrustBadges />
        </div>
      </section>

      {/* Value Proposition */}
      <ValueProposition />

      {/* Featured Tours with Suspense for loading state */}
      <Suspense
        fallback={
          <section className="w-full bg-gray-50 py-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-brand-primary tracking-tight text-center">
                Featured Top Rated Tours &amp; Safaris
              </h2>
              <ToursLoadingSkeleton />
            </div>
          </section>
        }
      >
        <ToursSection />
      </Suspense>

      {/* Call to Action Section */}
      <section className="w-full bg-gradient-to-r from-blue-600 to-blue-700 py-16 px-4 md:px-8 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-95">
            Create your perfect Cape Town adventure with our custom tour planning service
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/tours/custom"
              className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition"
            >
              Plan Custom Tour
            </a>
            <a
              href="/contact"
              className="inline-block px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold hover:bg-white/10 transition"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="w-full bg-white py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
            Your Safety &amp; Satisfaction Guaranteed
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="font-bold mb-2">Fully Licensed &amp; Insured</h3>
              <p className="text-gray-600">All tours comply with South African tourism regulations</p>
            </div>
            <div>
              <div className="text-4xl mb-4">💯</div>
              <h3 className="font-bold mb-2">100% Satisfaction Guarantee</h3>
              <p className="text-gray-600">Not happy? Get a full refund, no questions asked</p>
            </div>
            <div>
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="font-bold mb-2">Award-Winning Service</h3>
              <p className="text-gray-600">TripAdvisor Certificate of Excellence 5 years running</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
