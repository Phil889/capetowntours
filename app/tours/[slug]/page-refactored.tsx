import { notFound } from "next/navigation";
import { Metadata } from "next";
import { TourRepository } from "@/lib/tour-data/tour-repository";
import { TourMetadataGenerator } from "@/lib/tour-data/tour-metadata";
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
export const revalidate = TOUR_PAGE_CONFIG.cacheRevalidate;

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
      
      {/* Main Tour Page Template */}
      <TourPageTemplate tour={tour}>
        <TourOverview tour={tour} />
        <TourItinerary tour={tour} />
        <TourInclusions tour={tour} />
        <TourImportantInfo tour={tour} />
        <TourFAQ tour={tour} />
        <TourLocation tour={tour} />
        <TourReviews tourSlug={tour.slug} />
      </TourPageTemplate>
    </>
  );
}
