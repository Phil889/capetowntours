import { createClient } from "@supabase/supabase-js";
import TourHeroGallery from "@/components/tours/TourHeroGallery";
import PremiumBookingWidget from "@/components/tours/PremiumBookingWidget";
import {
  Clock,
  Users,
  MapPin,
  Sun,
  Zap,
  CheckCircle,
  XCircle,
  Info,
  HelpCircle,
  Calendar,
  Star,
  Award,
  Shield,
  TrendingUp,
  Sparkles,
  Heart,
  Camera,
  Navigation,
  Compass,
} from "lucide-react";
import { notFound } from "next/navigation";
import styles from "@/styles/tour-detail.module.css";

type Tour = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: string;
  category?: string;
  duration_days?: number;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
  highlights?: string;
  itinerary?: string;
  included?: string;
  excluded?: string;
  map_embed?: string;
  unique_selling_points?: string;
  faqs?: string;
  review_snippet?: string;
  cancellation_policy?: string;
  seasonal_notes?: string;
  child_policy?: string;
  accessibility?: string;
  group_size_max?: number;
  duration?: string;
  departure_time?: string;
  pickup?: string;
};

function decodeHtmlEntities(str: string): string {
  if (!str) return "";
  return str
    .replace(/&#124;/g, "|")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function decodeFaqs(faqs: string): { q: string; a: string }[] {
  const decoded = decodeHtmlEntities(faqs);
  return decoded
    .split("||")
    .map((pair) => {
      const [q, a] = pair.split("A:");
      return {
        q: q ? q.replace(/^Q:/, "").trim() : "",
        a: a ? a.trim() : "",
      };
    })
    .filter((faq) => faq.q || faq.a);
}

async function getTourBySlug(slug: string): Promise<Tour | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data, error } = await supabase
    .from("tours")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    slug: data.slug,
    title: data.name || data.title,
    description: data.description,
    price: data.price || data.price_per_person_cents,
    category: data.category,
    duration_days: data.duration_days,
    image_url: data.image_url || data.main_image_url,
    created_at: data.created_at,
    updated_at: data.updated_at,
    highlights: data.highlights,
    itinerary: data.itinerary,
    included: data.included,
    excluded: data.excluded,
    map_embed: data.map_embed,
    unique_selling_points: data.unique_selling_points,
    faqs: data.faqs,
    review_snippet: data.review_snippet,
    cancellation_policy: data.cancellation_policy,
    seasonal_notes: data.seasonal_notes,
    child_policy: data.child_policy,
    accessibility: data.accessibility,
    group_size_max: data.group_size_max,
    duration: data.duration,
    departure_time: data.departure_time,
    pickup: data.pickup,
  };
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PremiumTourDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);

  if (!tour) {
    notFound();
  }

  // Prepare images for gallery (using placeholder for now)
  const tourImages = tour.image_url 
    ? [`/${tour.image_url}`] 
    : ["/placeholder.jpg"];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Hero Gallery Section */}
      <TourHeroGallery 
        title={tour.title}
        images={tourImages}
        badges={[
          { icon: <Award className="w-4 h-4" />, label: "Best", value: "Seller" },
          { icon: <Shield className="w-4 h-4" />, label: "Verified", value: "Tour" },
          { icon: <Star className="w-4 h-4" />, label: "4.9", value: "Rating" },
          { icon: <Heart className="w-4 h-4" />, label: "Guest", value: "Favorite" },
        ]}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs with enhanced styling */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <span className="hover:text-purple-600 cursor-pointer transition-colors">Home</span>
          <span>/</span>
          <span className="hover:text-purple-600 cursor-pointer transition-colors">Tours</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">{tour.title}</span>
        </div>

        {/* Trust Indicators Bar */}
        <div className={styles.trustSection}>
          <div className={styles.trustGrid}>
            <div className={styles.trustItem}>
              <Star className={styles.trustIcon} />
              <div className={styles.trustValue}>4.9/5</div>
              <div className={styles.trustLabel}>Guest Rating</div>
            </div>
            <div className={styles.trustItem}>
              <Shield className={styles.trustIcon} />
              <div className={styles.trustValue}>100%</div>
              <div className={styles.trustLabel}>Verified Reviews</div>
            </div>
            <div className={styles.trustItem}>
              <TrendingUp className={styles.trustIcon} />
              <div className={styles.trustValue}>2,847</div>
              <div className={styles.trustLabel}>Happy Guests</div>
            </div>
            <div className={styles.trustItem}>
              <Award className={styles.trustIcon} />
              <div className={styles.trustValue}>#1</div>
              <div className={styles.trustLabel}>Tour Operator</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2">
            {/* Overview Section with Premium Styling */}
            <div className={styles.contentCard}>
              <h2 className={styles.sectionTitle}>
                <div className={styles.sectionIcon}>
                  <Sparkles className="w-4 h-4" />
                </div>
                About this Experience
              </h2>
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                {tour.description}
              </p>
              
              {/* Highlights with Enhanced Cards */}
              {tour.highlights && (
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center text-gray-800">
                    <Zap className="w-5 h-5 mr-2 text-yellow-500" /> 
                    Tour Highlights
                  </h3>
                  <div className={styles.highlightsGrid}>
                    {tour.highlights.split("|").map((item, idx) => (
                      <div key={idx} className={styles.highlightCard}>
                        <div className={styles.highlightIcon}>
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div className={styles.highlightContent}>
                          <p>{item.trim().replace(/^-\s*/, "")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Itinerary */}
            {tour.itinerary && (
              <div className={styles.contentCard}>
                <h2 className={styles.sectionTitle}>
                  <div className={styles.sectionIcon}>
                    <Navigation className="w-4 h-4" />
                  </div>
                  Your Journey
                </h2>
                <div className={styles.itineraryTimeline}>
                  {tour.itinerary.split(">").map((step, idx) => (
                    <div key={idx} className={styles.itineraryStep}>
                      <div className={styles.itineraryMarker}>{idx + 1}</div>
                      <div className={styles.itineraryContent}>
                        <h3 className={styles.itineraryTitle}>Stop {idx + 1}</h3>
                        <p className={styles.itineraryDescription}>
                          {step.trim()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What's Included/Excluded with Premium Design */}
            {(tour.included || tour.excluded) && (
              <div className={styles.contentCard}>
                <h2 className={styles.sectionTitle}>
                  <div className={styles.sectionIcon}>
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  Inclusions & Exclusions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {tour.included && (
                    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                      <h3 className="font-semibold text-lg mb-4 flex items-center text-green-800">
                        <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                        What's Included
                      </h3>
                      <ul className="space-y-2">
                        {tour.included.split("|").map((item, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle className="w-4 h-4 mr-3 mt-1 text-green-600 flex-shrink-0" />
                            <span className="text-gray-700">
                              {item.trim().replace(/^-\s*/, "")}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {tour.excluded && (
                    <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                      <h3 className="font-semibold text-lg mb-4 flex items-center text-red-800">
                        <XCircle className="w-5 h-5 mr-2 text-red-600" />
                        Not Included
                      </h3>
                      <ul className="space-y-2">
                        {tour.excluded.split("|").map((item, idx) => (
                          <li key={idx} className="flex items-start">
                            <XCircle className="w-4 h-4 mr-3 mt-1 text-red-600 flex-shrink-0" />
                            <span className="text-gray-700">
                              {item.trim().replace(/^-\s*/, "")}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Good to Know Section */}
            {(tour.seasonal_notes || tour.child_policy || tour.accessibility || tour.cancellation_policy) && (
              <div className={styles.contentCard}>
                <h2 className={styles.sectionTitle}>
                  <div className={styles.sectionIcon}>
                    <Info className="w-4 h-4" />
                  </div>
                  Important Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tour.seasonal_notes && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-start gap-3">
                        <Sun className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-1">Seasonal Notes</h4>
                          <p className="text-sm text-gray-600">{tour.seasonal_notes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {tour.child_policy && (
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-1">Child Policy</h4>
                          <p className="text-sm text-gray-600">{tour.child_policy}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {tour.accessibility && (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-1">Accessibility</h4>
                          <p className="text-sm text-gray-600">{tour.accessibility}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {tour.cancellation_policy && (
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-1">Cancellation Policy</h4>
                          <p className="text-sm text-gray-600">{tour.cancellation_policy}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* FAQs with Enhanced Accordion */}
            {tour.faqs && (
              <div className={styles.contentCard}>
                <h2 className={styles.sectionTitle}>
                  <div className={styles.sectionIcon}>
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {decodeFaqs(tour.faqs).map((faq, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-5 hover:bg-gray-100 transition-colors">
                      <h3 className="font-semibold text-gray-800 flex items-start mb-2">
                        <HelpCircle className="w-5 h-5 mr-3 mt-0.5 text-purple-600 flex-shrink-0" />
                        {faq.q}
                      </h3>
                      <p className="text-gray-600 ml-8">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Map Section */}
            {tour.map_embed && (
              <div className={styles.contentCard}>
                <h2 className={styles.sectionTitle}>
                  <div className={styles.sectionIcon}>
                    <Compass className="w-4 h-4" />
                  </div>
                  Tour Location
                </h2>
                <div className="rounded-xl overflow-hidden shadow-lg">
                  {tour.map_embed.includes("<iframe") ? (
                    <div
                      className="w-full h-96"
                      dangerouslySetInnerHTML={{ __html: tour.map_embed }}
                    />
                  ) : tour.map_embed.startsWith("https://") ? (
                    <iframe
                      src={tour.map_embed}
                      width="100%"
                      height="384"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : (
                    <div className="text-red-500 p-8 text-center">
                      Invalid map embed/link.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Guest Reviews Section */}
            <div className={styles.contentCard}>
              <h2 className={styles.sectionTitle}>
                <div className={styles.sectionIcon}>
                  <Star className="w-4 h-4" />
                </div>
                Guest Reviews
              </h2>
              <div className={styles.reviewsContainer}>
                {/* Sample reviews - you can fetch real ones from database */}
                <div className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewAuthor}>
                      <div className={styles.reviewAvatar}>JD</div>
                      <div>
                        <div className={styles.reviewName}>John Doe</div>
                        <div className={styles.reviewDate}>2 weeks ago</div>
                      </div>
                    </div>
                    <div className={styles.reviewRating}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${styles.star}`} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <p className={styles.reviewText}>
                    Amazing experience! The guide was knowledgeable and the tour exceeded all expectations.
                    Would definitely recommend to anyone visiting Cape Town.
                  </p>
                </div>
                <div className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewAuthor}>
                      <div className={styles.reviewAvatar}>SM</div>
                      <div>
                        <div className={styles.reviewName}>Sarah Miller</div>
                        <div className={styles.reviewDate}>1 month ago</div>
                      </div>
                    </div>
                    <div className={styles.reviewRating}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${styles.star}`} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <p className={styles.reviewText}>
                    Fantastic tour with breathtaking views. The small group size made it feel very personal
                    and exclusive. Worth every penny!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Booking Widget */}
          <div className="lg:col-span-1">
            <PremiumBookingWidget
              tourId={tour.id}
              price={tour.price}
              tourName={tour.title}
              duration={tour.duration}
              groupSize={tour.group_size_max}
              departureTime={tour.departure_time}
              pickup={tour.pickup}
              reviewSnippet={tour.review_snippet}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
