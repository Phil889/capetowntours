import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: NextRequest) {
  const { groups, itinerary, userInfo, total } = await req.json();

  if (!userInfo?.email || !itinerary || itinerary.length === 0) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Generate booking reference
  const generateBookingReference = () => {
    const date = new Date();
    const year = date.getFullYear();
    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `CTT-${year}-${randomId}`;
  };

  const bookingReference = generateBookingReference();

  // Create a summary of the custom tour package
  const tourSummary = groups.map((g: any) => {
    const dayItems = g.items.map((item: any) => 
      `${item.name} (${item.pax.adults + item.pax.children} guests)`
    ).join(", ");
    return `${g.label}: ${dayItems || 'No tours'}`;
  }).join(" | ");

  // Get the earliest date from the itinerary
  const dates = itinerary
    .map((item: any) => item.date)
    .filter((date: string) => date)
    .sort();
  const firstDate = dates[0] || new Date().toISOString().split('T')[0];

  // Count total guests (take max from all items)
  let maxGuests = 1;
  itinerary.forEach((item: any) => {
    const guests = (item.pax?.adults || 0) + (item.pax?.children || 0);
    if (guests > maxGuests) maxGuests = guests;
  });

  // Create special requirements text with full itinerary details
  const specialRequirements = `CUSTOM TOUR PACKAGE:\n\n${groups.map((g: any) => {
    return `${g.label}${g.date ? ` (${g.date})` : ''}:\n${
      g.items.map((item: any) => 
        `  - ${item.name}\n    Time: ${item.time || 'TBD'}\n    Guests: ${item.pax.adults} adults, ${item.pax.children} children${item.pax.infants ? `, ${item.pax.infants} infants` : ''}\n    Price: R${item.price}/person\n${item.notes ? `    Notes: ${item.notes}\n` : ''}`
      ).join('\n')
    }`;
  }).join('\n\n')}\n\nTotal Package: R${total}`;

  // Combine user's special requirements with the package details
  const combinedRequirements = `CUSTOM TOUR PACKAGE:\n\n${groups.map((g: any) => {
    return `${g.label}${g.date ? ` (${g.date})` : ''}:\n${
      g.items.map((item: any) => 
        `  - ${item.name}\n    Time: ${item.time || 'TBD'}\n    Guests: ${item.pax.adults} adults, ${item.pax.children} children${item.pax.infants ? `, ${item.pax.infants} infants` : ''}\n    Price: R${item.price}/person\n${item.notes ? `    Notes: ${item.notes}\n` : ''}`
      ).join('\n')
    }`;
  }).join('\n\n')}\n\nTotal Package: R${total}${userInfo.special_requirements ? `\n\nSpecial Requirements:\n${userInfo.special_requirements}` : ''}`;

  try {
    // Insert booking into the bookings table
    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          tour_id: null, // Custom tour, no specific tour ID
          user_id: null, // Guest booking
          date: firstDate,
          status: "confirmed",
          guests: maxGuests,
          guest_email: userInfo.email,
          guest_name: userInfo.name || null,
          guest_phone: userInfo.phone || null,
          pickup_location: userInfo.pickup_location || "Various - See itinerary details",
          special_requirements: combinedRequirements,
          booking_reference: bookingReference,
          total_amount: total,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Custom booking API error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send confirmation email immediately
    try {
      // Create a custom tour object for the email
      const customTour = {
        title: "Custom Tour Package",
        description: tourSummary,
        price: total / maxGuests, // Average price per person
        duration_days: groups.length,
        category: "Custom Package"
      };

      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/send-confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          booking: data,
          tour: customTour 
        }),
      });

      if (!emailResponse.ok) {
        console.error('Failed to send custom tour confirmation email');
      }
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the booking if email fails
    }

    return NextResponse.json({ 
      success: true, 
      booking: data,
      message: "Custom tour package booked successfully!"
    });
    
  } catch (err: any) {
    console.error("Error creating custom booking:", err);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
