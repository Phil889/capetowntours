import { createClient } from "@supabase/supabase-js";
import { cache } from "react";
import { TourDatabase } from "@/types/tour-detail";

// Singleton Supabase client for server-side operations
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables");
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    });
  }

  return supabaseInstance;
}

// Cache the database queries at the request level
export const getTourBySlug = cache(async (slug: string): Promise<TourDatabase | null> => {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("tours")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching tour:", error);
    return null;
  }

  return data as unknown as TourDatabase;
});
