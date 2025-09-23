import CustomTourPlanner from "@/components/tours/CustomTourPlanner";
import { supabase } from "@/lib/supabaseClient";
import { getTranslations } from "@/lib/i18n/get-translations";
import { Locale } from "@/lib/i18n/config";
import { Metadata } from "next";

type Props = {
  params: { locale: Locale };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations(params.locale);
  
  return {
    title: t.customTour?.meta?.title || "Custom Tour Planner - Cape Town Safari Tours",
    description: t.customTour?.meta?.description || "Create your perfect Cape Town adventure with our custom tour planning service. Select tours, customize your schedule, and book your personalized itinerary.",
  };
}

// Server Component: fetch tours and render planner
export default async function CustomTourPage({ params }: Props) {
  const t = await getTranslations(params.locale);
  
  // Fetch tours from Supabase
  const { data: tours, error } = await supabase
    .from("tours")
    .select("id, title, description, price, image_url");

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
        <div className="text-red-600 text-center">
          {t.customTour?.error || "Failed to load tours"}: {error.message}
        </div>
      </div>
    );
  }

  // Map to expected prop shape
  const availableTours =
    tours?.map((tour) => ({
      id: tour.id,
      name: tour.title,
      description: tour.description,
      price: Number(tour.price),
      imageUrl: tour.image_url,
    })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 px-4 md:px-6 lg:px-8">
          {t.customTour?.title || "Create Your Custom Tour Package"}
        </h1>
        <p className="text-gray-600 mb-6 px-4 md:px-6 lg:px-8">
          {t.customTour?.subtitle || "Build your perfect Cape Town adventure by selecting and scheduling tours across multiple days"}
        </p>
        <CustomTourPlanner availableTours={availableTours} translations={t} />
      </div>
    </div>
  );
}