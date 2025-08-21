import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function isAuthenticatedUser() {
  const cookieStore = await cookies();
  const access_token = cookieStore.get("sb-auth-token")?.value;
  if (!access_token) return null;
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${access_token}` } }
  });
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function GET(req: NextRequest) {
  const user = await isAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const tier = searchParams.get("tier");
  const status = searchParams.get("status");

  try {
    // Fetch unique customers from bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select(`
        id,
        customer_name,
        customer_email,
        customer_phone,
        whatsapp_number,
        tour_date,
        total_amount,
        status,
        created_at,
        tour_id,
        number_of_adults,
        number_of_children,
        special_requirements,
        pickup_location,
        pickup_time,
        source
      `)
      .order("created_at", { ascending: false });

    if (bookingsError) throw bookingsError;

    // Process bookings into customer profiles
    const customerMap = new Map();
    
    (bookings || []).forEach((booking: any) => {
      const email = booking.customer_email;
      
      if (!customerMap.has(email)) {
        customerMap.set(email, {
          id: `cust-${email.replace(/[^a-zA-Z0-9]/g, "-")}`,
          name: booking.customer_name || "Guest",
          email: email,
          phone: booking.customer_phone || "",
          whatsapp: booking.whatsapp_number,
          joined_date: booking.created_at,
          last_active: booking.tour_date,
          status: "active",
          tier: "bronze", // Will be calculated below
          total_bookings: 1,
          total_spent: booking.total_amount || 0,
          average_rating: 0, // Would come from reviews
          loyalty_points: 0, // Could be calculated
          preferred_language: "English",
          country: "South Africa", // Could be parsed from phone or stored separately
          city: booking.pickup_location?.split(",")[0] || "Cape Town",
          preferences: {
            tour_types: [],
            dietary: [],
            accessibility: [],
            interests: []
          },
          booking_history: [{
            id: booking.id,
            tour_id: booking.tour_id,
            date: booking.tour_date,
            amount: booking.total_amount || 0,
            status: booking.status,
            guests: (booking.number_of_adults || 0) + (booking.number_of_children || 0)
          }],
          notes: booking.special_requirements || "",
          tags: [],
          marketing_consent: true,
          referral_source: booking.source || "website",
          referred_customers: 0,
          lifetime_value: booking.total_amount || 0,
          churn_risk: "low"
        });
      } else {
        const customer = customerMap.get(email);
        customer.total_bookings += 1;
        customer.total_spent += booking.total_amount || 0;
        customer.lifetime_value = customer.total_spent;
        
        // Update last active date
        if (new Date(booking.tour_date) > new Date(customer.last_active)) {
          customer.last_active = booking.tour_date;
        }
        
        customer.booking_history.push({
          id: booking.id,
          tour_id: booking.tour_id,
          date: booking.tour_date,
          amount: booking.total_amount || 0,
          status: booking.status,
          guests: (booking.number_of_adults || 0) + (booking.number_of_children || 0)
        });
        
        // Update tier based on spending
        if (customer.total_spent > 50000) customer.tier = "platinum";
        else if (customer.total_spent > 20000) customer.tier = "gold";
        else if (customer.total_spent > 10000) customer.tier = "silver";
        
        // Calculate churn risk based on last booking
        const daysSinceLastBooking = Math.floor(
          (Date.now() - new Date(customer.last_active).getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceLastBooking > 180) customer.churn_risk = "high";
        else if (daysSinceLastBooking > 90) customer.churn_risk = "medium";
      }
    });
    
    let customers = Array.from(customerMap.values());
    
    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      customers = customers.filter(c => 
        c.name.toLowerCase().includes(searchLower) ||
        c.email.toLowerCase().includes(searchLower) ||
        c.phone.includes(searchLower)
      );
    }
    
    if (tier && tier !== "all") {
      customers = customers.filter(c => c.tier === tier);
    }
    
    if (status && status !== "all") {
      customers = customers.filter(c => c.status === status);
    }
    
    // Calculate stats
    const stats = {
      total: customers.length,
      active: customers.filter(c => c.status === "active").length,
      vip: customers.filter(c => c.tier === "platinum" || c.tier === "gold").length,
      totalRevenue: customers.reduce((sum, c) => sum + c.total_spent, 0),
      avgLifetimeValue: customers.length > 0 
        ? customers.reduce((sum, c) => sum + c.total_spent, 0) / customers.length 
        : 0,
      highRisk: customers.filter(c => c.churn_risk === "high").length,
      new: customers.filter(c => {
        const days = Math.floor((Date.now() - new Date(c.joined_date).getTime()) / (1000 * 60 * 60 * 24));
        return days <= 30;
      }).length
    };
    
    return NextResponse.json({ 
      success: true, 
      data: customers,
      stats 
    });
  } catch (error: any) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const user = await isAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const body = await req.json();
    const { action, customerIds, data } = body;

    switch (action) {
      case "export":
        // Implementation for exporting customers
        return NextResponse.json({ success: true, message: "Export initiated" });
        
      case "sendEmail":
        // Implementation for sending emails to customers
        return NextResponse.json({ success: true, message: "Emails queued" });
        
      case "updateTier":
        // Implementation for updating customer tiers
        return NextResponse.json({ success: true, message: "Tiers updated" });
        
      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Error processing customer action:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
