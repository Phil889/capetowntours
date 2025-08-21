import CustomTourPlanner from "@/components/tours/CustomTourPlanner";
import { supabase } from "@/lib/supabaseClient";

// Server Component: fetch tours and render planner
export default async function CustomTourPage() {
  // Fetch tours from Supabase
  const { data: tours, error } = await supabase
    .from("tours")
    .select("id, title, description, price, image_url");

  if (error) {
    return <div className="text-red-600">Failed to load tours: {error.message}</div>;
  }

  // Map to expected prop shape
  const availableTours =
    tours?.map((t) => ({
      id: t.id,
      name: t.title,
      description: t.description,
      price: Number(t.price),
      imageUrl: t.image_url,
    })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 px-4 md:px-6 lg:px-8">
          Create Your Custom Tour Package
        </h1>
        <p className="text-gray-600 mb-6 px-4 md:px-6 lg:px-8">
          Build your perfect Cape Town adventure by selecting and scheduling tours across multiple days
        </p>
        <CustomTourPlanner availableTours={availableTours} />
      </div>
    </div>
  );
}
