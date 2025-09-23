import { notFound } from "next/navigation";
import { Metadata } from "next";
import { TourRepository } from "@/lib/tour-data/tour-repository";
import { TourMetadataGenerator } from "@/lib/tour-data/tour-metadata";
import { TranslationService } from "@/lib/i18n/translation-service";
import { TranslationProvider } from "@/lib/i18n/translation-context";
import { POPULAR_TOUR_SLUGS, TOUR_PAGE_CONFIG } from "@/lib/tour-data/tour-constants";
import TourPageTemplate from "@/components/tours/TourPageTemplate";
import TourOverview from "@/components/tours/sections/TourOverview";
import TourItinerary from "@/components/tours/sections/TourItinerary";
import TourInclusions from "@/components/tours/sections/TourInclusions";
import TourImportantInfo from "@/components/tours/sections/TourImportantInfo";
import TourFAQ from "@/components/tours/sections/TourFAQ";
import TourLocation from "@/components/tours/sections/TourLocation";
import TourReviews from "@/components/tours/sections/TourReviews";
import TourSchema from "@/components/tours/TourSchema";
import BreadcrumbSchema from "@/components/tours/BreadcrumbSchema";
import FAQSchema from "@/components/tours/FAQSchema";

// Cache page for 1 hour, revalidate in background
export const revalidate = 3600;

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const tour = await TourRepository.getBySlug(slug);
    return TourMetadataGenerator.generate(tour, slug);
  } catch (error) {
    console.error('[Tour Detail Error - generateMetadata]:', error);
    return TourMetadataGenerator.generate(null, '');
  }
}

// Pre-generate static pages for popular tours
export async function generateStaticParams() {
  return POPULAR_TOUR_SLUGS.map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function TourDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  // Fetch tour data from repository (with caching)
  let tour;
  try {
    tour = await TourRepository.getBySlug(slug);
  } catch (error) {
    console.error('[Tour Detail Error - getTour]:', error);
    notFound();
  }

  if (!tour) {
    notFound();
  }

  // Load translations server-side for English locale (default)
  const locale = 'en';
  const translationService = TranslationService.getInstance();
  const [
    tourDetailTranslations,
    accessibilityTranslations,
    badgesTranslations,
    trustIndicatorsTranslations,
    bookingTranslations,
    allTranslations
  ] = await Promise.all([
    translationService.getStaticTranslations(locale, 'tour_detail'),
    translationService.getStaticTranslations(locale, 'accessibility'),
    translationService.getStaticTranslations(locale, 'badges'),
    translationService.getStaticTranslations(locale, 'trust_indicators'),
    translationService.getStaticTranslations(locale, 'booking'),
    translationService.getStaticTranslations(locale) // Get all translations flattened
  ]);

  // Prepare FAQ data for schema
  const faqsForSchema = tour.faqs?.map(faq => ({
    question: faq.question,
    answer: faq.answer,
  })) || [];

  return (
    <>
      {/* Structured Data for SEO */}
      <TourSchema 
        tour={tour}
        tourImages={[]}
        locationInfo={{
          name: tour.title,
          address: '',
          departureTime: tour.departureTime || '',
          pickup: tour.pickup || '',
          duration: tour.duration || '',
          mapsQuery: tour.title
        }}
      />
      <BreadcrumbSchema 
        tourTitle={tour.title}
        tourSlug={tour.slug}
      />
      {tour.faqs && tour.faqs.length > 0 && (
        <FAQSchema 
          tourTitle={tour.title}
          tourUrl={`https://capetownsafaritours.com/tours/${tour.slug}`}
          faqs={faqsForSchema}
        />
      )}
      
      {/* Main Tour Page Template wrapped with TranslationProvider */}
      <TranslationProvider 
        locale={locale} 
        translations={allTranslations}
      >
        <TourPageTemplate 
          tour={tour}
          translations={{
            badges: {
              best_seller: badgesTranslations['best_seller'] || allTranslations['badges.best_seller'],
              verified_tour: badgesTranslations['verified_tour'] || allTranslations['badges.verified_tour'], 
              rating: badgesTranslations['rating'] || allTranslations['badges.rating'],
              guest_favorite: badgesTranslations['guest_favorite'] || allTranslations['badges.guest_favorite']
            },
            trustIndicators: {
              guest_rating: trustIndicatorsTranslations['guest_rating'] || allTranslations['trust_indicators.guest_rating'],
              verified_reviews: trustIndicatorsTranslations['verified_reviews'] || allTranslations['trust_indicators.verified_reviews'],
              happy_guests: trustIndicatorsTranslations['happy_guests'] || allTranslations['trust_indicators.happy_guests'],
              tour_operator: trustIndicatorsTranslations['tour_operator'] || allTranslations['trust_indicators.tour_operator']
            },
            booking: {
              per_person: bookingTranslations['per_person'] || allTranslations['booking.per_person'],
              best_price_guarantee: bookingTranslations['best_price_guarantee'] || allTranslations['booking.best_price_guarantee'],
              people_viewing_now: bookingTranslations['people_viewing_now'] || allTranslations['booking.people_viewing_now'],
              booked_today: bookingTranslations['booked_today'] || allTranslations['booking.booked_today'],
              max_group_size: bookingTranslations['max_group_size'] || allTranslations['booking.max_group_size'],
              top_rated: bookingTranslations['top_rated'] || allTranslations['booking.top_rated'],
              verified_operator: bookingTranslations['verified_operator'] || allTranslations['booking.verified_operator'],
              operator: bookingTranslations['operator'] || allTranslations['booking.operator'],
              rating: bookingTranslations['rating'] || allTranslations['booking.rating'],
              chat_with_us: bookingTranslations['chat_with_us'] || allTranslations['booking.chat_with_us'],
              call_us: bookingTranslations['call_us'] || allTranslations['booking.call_us'],
              free_cancellation_24h: bookingTranslations['free_cancellation_24h'] || allTranslations['booking.free_cancellation_24h'],
              recent_guest_review: bookingTranslations['recent_guest_review'] || allTranslations['booking.recent_guest_review'],
              from: bookingTranslations['from'] || allTranslations['booking.from'],
              check_availability: bookingTranslations['check_availability'] || allTranslations['booking.check_availability'],
              max: bookingTranslations['max'] || allTranslations['booking.max'],
              book_your_tour: bookingTranslations['book_your_tour'] || allTranslations['booking.book_your_tour']
            },
            tour_detail: {
              duration: tourDetailTranslations['duration'] || allTranslations['tour_detail.duration'],
              departure: tourDetailTranslations['departure'] || allTranslations['tour_detail.departure'],
              pickup: tourDetailTranslations['pickup'] || allTranslations['tour_detail.pickup'],
              your_journey: tourDetailTranslations['your_journey'] || allTranslations['tour_detail.your_journey'],
              stop_number: tourDetailTranslations['stop_number'] || allTranslations['tour_detail.stop_number'],
              important_information: tourDetailTranslations['important_information'] || allTranslations['tour_detail.important_information'],
              seasonal_notes: tourDetailTranslations['seasonal_notes'] || allTranslations['tour_detail.seasonal_notes'],
              child_policy: tourDetailTranslations['child_policy'] || allTranslations['tour_detail.child_policy'],
              accessibility: tourDetailTranslations['accessibility'] || allTranslations['tour_detail.accessibility'],
              cancellation_policy: tourDetailTranslations['cancellation_policy'] || allTranslations['tour_detail.cancellation_policy'],
              tour_location: tourDetailTranslations['tour_location'] || allTranslations['tour_detail.tour_location'],
              getting_there: tourDetailTranslations['getting_there'] || allTranslations['tour_detail.getting_there'],
              meeting_point: tourDetailTranslations['meeting_point'] || allTranslations['tour_detail.meeting_point'],
              pickup_included: tourDetailTranslations['pickup_included'] || allTranslations['tour_detail.pickup_included'],
              self_drive: tourDetailTranslations['self_drive'] || allTranslations['tour_detail.self_drive'],
              details_after_booking: tourDetailTranslations['details_after_booking'] || allTranslations['tour_detail.details_after_booking']
            }
          }}
        >
          <TourOverview tour={tour} />
          <TourItinerary 
            tour={tour} 
            translations={{
              your_journey: tourDetailTranslations['your_journey'] || allTranslations['tour_detail.your_journey'],
              stop_number: tourDetailTranslations['stop_number'] || allTranslations['tour_detail.stop_number']
            }}
          />
          <TourInclusions tour={tour} />
          <TourImportantInfo 
            tour={tour}
            translations={{
              important_information: tourDetailTranslations['important_information'] || allTranslations['tour_detail.important_information'],
              seasonal_notes: tourDetailTranslations['seasonal_notes'] || allTranslations['tour_detail.seasonal_notes'],
              child_policy: tourDetailTranslations['child_policy'] || allTranslations['tour_detail.child_policy'],
              accessibility: tourDetailTranslations['accessibility'] || allTranslations['tour_detail.accessibility'],
              cancellation_policy: tourDetailTranslations['cancellation_policy'] || allTranslations['tour_detail.cancellation_policy']
            }}
          />
          <TourFAQ tour={tour} />
          <TourLocation 
            tour={tour}
            translations={{
              tour_location: tourDetailTranslations['tour_location'] || allTranslations['tour_detail.tour_location'],
              departure: tourDetailTranslations['departure'] || allTranslations['tour_detail.departure'],
              pickup: tourDetailTranslations['pickup'] || allTranslations['tour_detail.pickup'],
              getting_there: tourDetailTranslations['getting_there'] || allTranslations['tour_detail.getting_there'],
              duration: tourDetailTranslations['duration'] || allTranslations['tour_detail.duration'],
              meeting_point: tourDetailTranslations['meeting_point'] || allTranslations['tour_detail.meeting_point'],
              pickup_included: tourDetailTranslations['pickup_included'] || allTranslations['tour_detail.pickup_included'],
              self_drive: tourDetailTranslations['self_drive'] || allTranslations['tour_detail.self_drive'],
              details_after_booking: tourDetailTranslations['details_after_booking'] || allTranslations['tour_detail.details_after_booking']
            }}
          />
          <TourReviews tourSlug={tour.slug} locale="en" />
        </TourPageTemplate>
      </TranslationProvider>
    </>
  );
}
