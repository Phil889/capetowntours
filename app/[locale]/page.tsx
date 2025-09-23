import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/lib/i18n/config';
import { generateLocalizedMetadata } from '@/lib/i18n/metadata';
import { TourCard } from '@/components/tours/tour-card';
import { getToursWithLocale } from '@/lib/tours';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Users, Wallet, Car, Star } from 'lucide-react';
import LocalBusinessSchema from '@/components/schema/LocalBusinessSchema';
import OrganizationSchema from '@/components/schema/OrganizationSchema';
import type { Tour } from '@/lib/placeholder-data';

// Import optimized server-side translation loader
import { getTranslations } from '@/lib/i18n/server';

const SIGNATURE_SLUGS = [
  "aquila-big-5-day-safari",
  "inverdoorn-exclusive-day-safari", 
  "boulders-beach-penguin-colony",
  "hermanus-whale-watching-cruise"
];

interface LocalePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  
  if (!isValidLocale(locale)) {
    return {};
  }

  const t = await getTranslations(locale);

  return generateLocalizedMetadata({
    locale,
    pathname: '/',
    title: t?.meta?.default?.title || 'Cape Town Safari Tours',
    description: t?.meta?.default?.description || 'Experience Cape Town\'s best private safari tours'
  });
}

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'de' },
    { locale: 'fr' },
    { locale: 'es' },
    { locale: 'ar' }
  ];
}

export default async function LocaleHomePage({ params }: LocalePageProps) {
  const { locale } = await params;
  
  if (!isValidLocale(locale)) {
    notFound();
  }

  // Load translations
  const t = await getTranslations(locale);

  // Fetch signature tours with locale support
  const allTours = await getToursWithLocale(locale);
  const tours: Tour[] = SIGNATURE_SLUGS.map((slug) => {
    const tour = allTours.find((t) => t.slug === slug);
    if (!tour) return null;
    return {
      id: tour.id,
      slug: tour.slug,
      name: tour.title || tour.slug || 'Tour',
      category: tour.category || 'safari',
      duration_days: tour.duration_days || 1,
      price_per_person_cents: (tour.price || 0) * 100,
      main_image_url: tour.image_url || '/default-tour-image.jpg',
      main_image_alt: tour.image_alt || tour.title || tour.slug || 'Tour in Cape Town',
      description: tour.description || 'Experience the best of Cape Town',
      map_embed: undefined
    };
  }).filter(Boolean) as Tour[];

  // Helper function for localized links
  const getLocalizedHref = (path: string) => {
    if (locale === 'en') return path;
    return `/${locale}${path}`;
  };

  return (
    <>
      {/* Schema Markup for SEO */}
      <LocalBusinessSchema />
      <OrganizationSchema />
      
      {/* HERO SECTION */}
      <section className="w-full relative min-h-screen py-0 px-0">
        {/* Background slider */}
        <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
          <div className="w-full h-full flex">
            <img
              src="/safari-elephants-river.png"
              alt="Safari Hero"
              className="w-full h-full object-cover object-top"
              draggable={false}
            />
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0) 100%)"
              }}
            ></div>
          </div>
        </div>
        
        <div className="relative z-20 max-w-6xl mx-auto flex flex-col items-center text-center min-h-screen justify-center">
          <h1 className="font-playfair text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-[#D4B796] via-[#E59A59] to-[#BFA76A] bg-clip-text text-transparent drop-shadow-lg tracking-tight">
            {t?.homepage?.hero?.title || 'Cape Town Safari Tours'}
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 mb-8 max-w-3xl font-medium">
            {t?.homepage?.hero?.subtitle || 'Experience the best of Cape Town'}
          </p>
          <a
            href="#tours"
            className="inline-block px-12 py-5 bg-white/20 border border-white/40 text-white rounded-full font-bold text-2xl shadow-xl backdrop-blur-md hover:bg-white/30 transition"
          >
            {t?.homepage?.hero?.cta || 'Explore Tours'}
          </a>
          
          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap justify-center items-center gap-16 w-full">
            <img
              src="/tripadvisor.png"
              alt="TripAdvisor Top Rated"
              className="h-28 w-auto object-contain"
              loading="lazy"
              style={{ maxHeight: "112px", maxWidth: "220px" }}
            />
            <img
              src="/best price cape ton privat tours.png"
              alt="Best Price Cape Town Private Tours"
              className="h-28 w-auto object-contain"
              loading="lazy"
              style={{ maxHeight: "112px", maxWidth: "220px" }}
            />
            <img
              src="/privat tours cape town trusted seller.png"
              alt="Cape Town Private Tours Trusted Seller"
              className="h-28 w-auto object-contain"
              loading="lazy"
              style={{ maxHeight: "112px", maxWidth: "220px" }}
            />
            <img
              src="/viator.png"
              alt="Viator Experience Awards"
              className="h-28 w-auto object-contain"
              loading="lazy"
              style={{ maxHeight: "112px", maxWidth: "220px" }}
            />
            <img
              src="/best-cape-town-safari-choice-guarantee.webp"
              alt="Certified Eco Tourism Provider"
              className="h-28 w-auto object-contain"
              loading="lazy"
              style={{ maxHeight: "112px", maxWidth: "220px" }}
            />
          </div>
        </div>
      </section>

      {/* SIGNATURE SAFARIS */}
      <section id="tours" className="py-16 sm:py-24">
        <div className="container">
          <h2 className="font-montserrat mb-4 text-center text-3xl font-bold md:text-4xl">{t?.homepage?.signatureSafaris?.title || 'Our Signature Safaris'}</h2>
          <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            {t?.homepage?.signatureSafaris?.subtitle || 'Experience our top-rated safari adventures'}
          </p>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section
        className="relative py-28 overflow-hidden"
        style={{
          background:
            "linear-gradient(120deg, #2d1a05 0%, #bfa76a 100%), url('/Best Lion Safari Cape Town.webp') center/cover no-repeat",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-yellow-100/10 via-yellow-400/10 to-transparent animate-pulse" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center">
          <span className="uppercase tracking-widest text-lg font-semibold text-yellow-400 mb-2 drop-shadow-lg">
            {t?.homepage?.whyChooseUs?.tagline || 'Why Choose Us'}
          </span>
          <h2
            className="font-playfair text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#D4B796] via-[#E59A59] to-[#BFA76A] drop-shadow-2xl text-center mb-4"
            style={{ letterSpacing: "-0.02em" }}
          >
            {t?.homepage?.whyChooseUs?.title || 'The Cape Town Safari Tours Difference'}
          </h2>
          <p className="text-2xl md:text-2xl text-white/90 mb-12 max-w-3xl text-center font-medium">
            {t?.homepage?.whyChooseUs?.subtitle || 'We are local experts dedicated to crafting your perfect private adventure'}
          </p>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 w-full">
            <div className="group relative bg-white/20 backdrop-blur-lg border border-yellow-400/60 rounded-3xl shadow-2xl p-8 flex flex-col items-center transition-transform duration-300 hover:-translate-y-2">
              <div className="flex items-center justify-center mb-5">
                <Users className="h-14 w-14 text-yellow-100 group-hover:text-yellow-300 transition-colors duration-300 drop-shadow-lg" />
              </div>
              <h3 className="font-playfair text-2xl font-bold text-yellow-100 mb-2 text-center drop-shadow">
                {t?.homepage?.whyChooseUs?.features?.private?.title || 'Private & Customizable'}
              </h3>
              <p className="text-white/90 text-center">
                {t?.homepage?.whyChooseUs?.features?.private?.description || 'Your tour, your pace. We tailor every detail to your interests.'}
              </p>
            </div>
            
            <div className="group relative bg-white/20 backdrop-blur-lg border border-yellow-400/60 rounded-3xl shadow-2xl p-8 flex flex-col items-center transition-transform duration-300 hover:-translate-y-4">
              <div className="flex items-center justify-center mb-5">
                <ShieldCheck className="h-14 w-14 text-yellow-100 group-hover:text-yellow-300 transition-colors duration-300 drop-shadow-lg" />
              </div>
              <h3 className="font-playfair text-2xl font-bold text-yellow-100 mb-2 text-center drop-shadow">
                {t?.homepage?.whyChooseUs?.features?.expert?.title || 'Expert Guides'}
              </h3>
              <p className="text-white/90 text-center">
                {t?.homepage?.whyChooseUs?.features?.expert?.description || 'Local knowledge and professional expertise at your service.'}
              </p>
            </div>
            
            <div className="group relative bg-white/20 backdrop-blur-lg border border-yellow-400/60 rounded-3xl shadow-2xl p-8 flex flex-col items-center transition-transform duration-300 hover:-translate-y-2">
              <div className="flex items-center justify-center mb-5">
                <Wallet className="h-14 w-14 text-yellow-100 group-hover:text-yellow-300 transition-colors duration-300 drop-shadow-lg" />
              </div>
              <h3 className="font-playfair text-2xl font-bold text-yellow-100 mb-2 text-center drop-shadow">
                {t?.homepage?.whyChooseUs?.features?.pricing?.title || 'Transparent Pricing'}
              </h3>
              <p className="text-white/90 text-center">
                {t?.homepage?.whyChooseUs?.features?.pricing?.description || 'No hidden fees. What you see is what you pay.'}
              </p>
            </div>
            
            <div className="group relative bg-white/20 backdrop-blur-lg border border-yellow-400/60 rounded-3xl shadow-2xl p-8 flex flex-col items-center transition-transform duration-300 hover:-translate-y-4">
              <div className="flex items-center justify-center mb-5">
                <Car className="h-14 w-14 text-yellow-100 group-hover:text-yellow-300 transition-colors duration-300 drop-shadow-lg" />
              </div>
              <h3 className="font-playfair text-2xl font-bold text-yellow-100 mb-2 text-center drop-shadow">
                {t?.homepage?.whyChooseUs?.features?.comfort?.title || 'Comfort & Safety'}
              </h3>
              <p className="text-white/90 text-center">
                {t?.homepage?.whyChooseUs?.features?.comfort?.description || 'Safe, comfortable vehicles and professional service.'}
              </p>
            </div>
          </div>
          
          <div className="mt-12 flex flex-col items-center">
            <span className="inline-block bg-yellow-400/90 text-yellow-900 font-bold px-6 py-2 rounded-full shadow-lg text-lg tracking-wide uppercase">
              {t?.homepage?.whyChooseUs?.trustBadge || '4.9★ Rated'}
            </span>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-montserrat text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {t?.testimonials?.title || 'What Our Guests Say'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Review 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-gray-700 mb-4 italic">
                "{t?.testimonials?.reviews?.sarah?.text || 'Amazing experience with professional service!'}"
              </blockquote>
              <div className="text-sm font-semibold text-gray-900">
                {t?.testimonials?.reviews?.sarah?.author || 'Sarah T.'}
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-gray-700 mb-4 italic">
                "{t?.testimonials?.reviews?.michael?.text || 'Exceptional tour with great guides!'}"
              </blockquote>
              <div className="text-sm font-semibold text-gray-900">
                {t?.testimonials?.reviews?.michael?.author || 'Michael S.'}
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-gray-700 mb-4 italic">
                "{t?.testimonials?.reviews?.anika?.text || 'Unforgettable wildlife adventure!'}"
              </blockquote>
              <div className="text-sm font-semibold text-gray-900">
                {t?.testimonials?.reviews?.anika?.author || 'Anika M.'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 sm:py-24 bg-brand-primary text-brand-light">
        <div className="container text-center">
          <h2 className="font-montserrat mb-4 text-center text-3xl font-bold md:text-4xl">{t?.homepage?.cta?.title || 'Ready for Your Adventure?'}</h2>
          <p className="text-center text-lg text-brand-secondary mb-8 max-w-3xl mx-auto">
            {t?.homepage?.cta?.subtitle || 'Book your private safari tour today!'}
          </p>
          <a
            href={getLocalizedHref("/contact")}
            className="inline-block px-12 py-5 bg-brand-accent text-white rounded-full font-bold text-2xl shadow-xl hover:bg-opacity-90 transition"
          >
            {t?.homepage?.cta?.button || 'Contact Us'}
          </a>
        </div>
      </section>
    </>
  );
}