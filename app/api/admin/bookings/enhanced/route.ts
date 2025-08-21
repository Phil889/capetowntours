import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { EnhancedBooking, BookingFilter } from "@/types/booking-management";

// GET: Fetch enhanced bookings with filters
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    
    // Build query
    let query = supabase.from("bookings").select(`
      *,
      tours (
        id,
        title,
        duration_days,
        category
      )
    `);

    // Apply filters
    const status = searchParams.get("status");
    if (status) {
      const statuses = status.split(",");
      query = query.in("status", statuses);
    }

    const priority = searchParams.get("priority");
    if (priority) {
      const priorities = priority.split(",");
      query = query.in("priority", priorities);
    }

    const dateFrom = searchParams.get("date_from");
    if (dateFrom) {
      query = query.gte("date", dateFrom);
    }

    const dateTo = searchParams.get("date_to");
    if (dateTo) {
      query = query.lte("date", dateTo);
    }

    const search = searchParams.get("search");
    if (search) {
      query = query.or(`booking_reference.ilike.%${search}%,guest_email.ilike.%${search}%,guest_name.ilike.%${search}%,guest_phone.ilike.%${search}%`);
    }

    // Sort by date descending by default
    query = query.order("date", { ascending: false });

    const { data: bookings, error } = await query;

    if (error) {
      console.error("Error fetching bookings:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Transform bookings to EnhancedBooking format
    const enhancedBookings: EnhancedBooking[] = (bookings || []).map(booking => ({
      id: booking.id,
      booking_reference: booking.booking_reference || `BOOK-${booking.id.slice(0, 8)}`,
      created_at: booking.created_at,
      updated_at: booking.updated_at || booking.created_at,
      
      customer: {
        name: booking.guest_name || "",
        email: booking.guest_email || "",
        phone: booking.guest_phone || "",
        whatsapp: booking.guest_phone || "",
      },
      
      tour_type: booking.tour_id ? "standard" : "custom",
      tour_id: booking.tour_id,
      tour_name: booking.tours?.title || null,
      itinerary: booking.special_requirements || "",
      date: booking.date,
      total_guests: booking.guests || 1,
      guest_breakdown: {
        adults: booking.guests || 1,
        children: 0,
        infants: 0,
      },
      special_requirements: booking.special_requirements || "",
      dietary_restrictions: [],
      accessibility_needs: [],
      
      status: booking.status || "pending",
      priority: booking.priority || "medium",
      assigned_to: booking.assigned_to || null,
      workflow_stage: booking.workflow_stage || null,
      follow_up_date: booking.follow_up_date || null,
      
      financial: {
        total_amount: booking.total_amount || 0,
        deposit_paid: booking.deposit_paid || 0,
        balance_due: (booking.total_amount || 0) - (booking.deposit_paid || 0),
        payment_method: booking.payment_method || null,
        payment_status: booking.payment_status || "pending",
        payment_date: booking.payment_date || null,
        currency: "ZAR",
      },
      
      operations: {
        pickup_location: booking.pickup_location || null,
        pickup_time: booking.pickup_time || null,
        driver_assigned: booking.driver_assigned || null,
        guide_assigned: booking.guide_assigned || null,
        vehicle_assigned: booking.vehicle_assigned || null,
      },
      
      internal_notes: booking.internal_notes || null,
      last_contacted: booking.last_contacted || null,
      source: booking.source || "website",
      tags: booking.tags || [],
    }));

    // Also fetch custom itineraries for custom bookings
    const { data: customBookings, error: customError } = await supabase
      .from("custom_itineraries")
      .select("*")
      .order("created_at", { ascending: false });

    if (!customError && customBookings) {
      // Add custom bookings to the list
      const enhancedCustomBookings: EnhancedBooking[] = customBookings.map(booking => ({
        id: booking.id,
        booking_reference: `CUSTOM-${booking.id.slice(0, 8)}`,
        created_at: booking.created_at,
        updated_at: booking.created_at,
        
        customer: {
          name: "Custom Inquiry",
          email: booking.user_id || "pending@email.com",
          phone: "",
        },
        
        tour_type: "custom",
        tour_id: undefined,
        tour_name: "Custom Package",
        itinerary: booking.itinerary || "",
        date: new Date().toISOString().split("T")[0],
        total_guests: 1,
        special_requirements: booking.itinerary || "",
        
        status: booking.status || "inquiry",
        priority: "medium",
        
        financial: {
          total_amount: 0,
          deposit_paid: 0,
          balance_due: 0,
          payment_status: "pending",
        },
        
        tags: ["custom", "inquiry"],
      }));

      enhancedBookings.push(...enhancedCustomBookings);
    }

    return NextResponse.json({ success: true, data: enhancedBookings });
  } catch (error) {
    console.error("Error in enhanced bookings API:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

// PUT: Update booking
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Booking ID required" }, { status: 400 });
    }

    // Update the booking
    const { data, error } = await supabase
      .from("bookings")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating booking:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

// POST: Create new booking
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Generate booking reference
    const generateBookingReference = () => {
      const date = new Date();
      const year = date.getFullYear();
      const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
      return `CTT-${year}-${randomId}`;
    };

    const bookingData = {
      ...body,
      booking_reference: generateBookingReference(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: body.status || "pending",
    };

    const { data, error } = await supabase
      .from("bookings")
      .insert([bookingData])
      .select()
      .single();

    if (error) {
      console.error("Error creating booking:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

// DELETE: Delete booking
export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Booking ID required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting booking:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
