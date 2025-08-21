import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function isAuthenticatedUser() {
  // For development, return a mock admin user
  // In production, implement proper authentication
  return { id: "admin-user", email: "admin@capetownsafari.com" };
}

export async function POST(req: NextRequest) {
  const user = await isAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
  );

  try {
    const body = await req.json();
    const { action, bookingId, data } = body;
    
    console.log(`Processing action: ${action} for booking: ${bookingId}`);

    switch (action) {
      case "update_status": {
        const { data: booking, error } = await supabase
          .from("bookings")
          .update({ 
            status: data.status,
            updated_at: new Date().toISOString()
          })
          .eq("id", bookingId)
          .select()
          .single();

        if (error) throw error;

        // Try to log to audit trail (table might not exist)
        try {
          await supabase.from("audit_log").insert({
            user_id: user.id,
            action: `booking.status_updated`,
            target: bookingId,
            details: {
              old_status: data.oldStatus,
              new_status: data.status,
              user_email: user.email
            },
            timestamp: new Date().toISOString()
          });
        } catch (auditError) {
          console.log("Audit log insert failed (table may not exist):", auditError);
        }

        return NextResponse.json({ success: true, data: booking });
      }

      case "edit": {
        try {
          // First get the current booking to see what columns actually exist
          const { data: currentBooking, error: fetchError } = await supabase
            .from("bookings")
            .select("*")
            .eq("id", bookingId)
            .single();
            
          if (fetchError) {
            console.error("Fetch error:", fetchError);
            throw fetchError;
          }
          
          if (!currentBooking) {
            throw new Error("Booking not found");
          }
          
          const updateData: any = {};
          
          // Only update fields that exist in the current booking
          // Map from frontend names to database column names
          if (data.customer_name !== undefined && 'guest_name' in currentBooking) {
            updateData.guest_name = data.customer_name;
          }
          if (data.customer_email !== undefined && 'guest_email' in currentBooking) {
            updateData.guest_email = data.customer_email;
          }
          if (data.customer_phone !== undefined && 'guest_phone' in currentBooking) {
            updateData.guest_phone = data.customer_phone;
          }
          if (data.tour_date !== undefined && 'date' in currentBooking) {
            updateData.date = data.tour_date;
          }
          if (data.pickup_location !== undefined && 'pickup_location' in currentBooking) {
            updateData.pickup_location = data.pickup_location;
          }
          
          // Handle guests count - combine adults and children
          if ((data.number_of_adults !== undefined || data.number_of_children !== undefined) && 'guests' in currentBooking) {
            const adults = data.number_of_adults || 0;
            const children = data.number_of_children || 0;
            updateData.guests = adults + children;
          }
          
          if (data.special_requirements !== undefined && 'special_requirements' in currentBooking) {
            updateData.special_requirements = data.special_requirements;
          }
          if (data.total_amount !== undefined && 'total_amount' in currentBooking) {
            updateData.total_amount = data.total_amount;
          }
          if (data.status !== undefined && 'status' in currentBooking) {
            updateData.status = data.status;
          }
          
          // Only add updated_at if it exists in the current booking
          if ('updated_at' in currentBooking) {
            updateData.updated_at = new Date().toISOString();
          }
          
          // Log what we're updating for debugging
          console.log("Current booking columns:", Object.keys(currentBooking));
          console.log("Updating booking with data:", updateData);
          
          // Only update if there's something to update
          if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ success: true, data: currentBooking, message: "No changes to save" });
          }

          // Perform the update
          const { data: updatedBookings, error: updateError } = await supabase
            .from("bookings")
            .update(updateData)
            .eq("id", bookingId)
            .select();

          if (updateError) {
            console.error("Update error details:", {
              error: updateError,
              updateData,
              bookingId
            });
            throw updateError;
          }

          // Handle the response
          if (!updatedBookings || updatedBookings.length === 0) {
            // If update didn't return data, fetch the updated booking
            const { data: refetchedBooking, error: refetchError } = await supabase
              .from("bookings")
              .select("*")
              .eq("id", bookingId)
              .single();
              
            if (refetchError) throw refetchError;
            
            const booking = refetchedBooking;
            console.log("Update successful, refetched booking");
            return NextResponse.json({ success: true, data: booking });
          }
          
          const booking = updatedBookings[0];
          console.log("Update successful");

          // Try to log to audit trail (table might not exist)
          try {
            await supabase.from("audit_log").insert({
              user_id: user.id,
              action: `booking.edited`,
              target: bookingId,
              details: {
                changes: Object.keys(updateData),
                user_email: user.email
              },
              timestamp: new Date().toISOString()
            });
          } catch (auditError) {
            console.log("Audit log insert failed (table may not exist):", auditError);
          }

          return NextResponse.json({ success: true, data: booking });
        } catch (error: any) {
          console.error("Edit booking error:", error);
          throw error;
        }
      }

      case "duplicate": {
        // Get original booking
        const { data: original, error: fetchError } = await supabase
          .from("bookings")
          .select("*")
          .eq("id", bookingId)
          .single();

        if (fetchError) throw fetchError;

        // Create duplicate with new reference
        const newReference = `CTT-${Date.now().toString(36).toUpperCase()}-DUP`;
        const duplicateData = {
          ...original,
          id: undefined,
          booking_reference: newReference,
          status: "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        delete duplicateData.id;

        const { data: newBooking, error: insertError } = await supabase
          .from("bookings")
          .insert(duplicateData)
          .select()
          .single();

        if (insertError) throw insertError;

        // Try to log to audit trail (table might not exist)
        try {
          await supabase.from("audit_log").insert({
            user_id: user.id,
            action: `booking.duplicated`,
            target: bookingId,
            details: {
              new_booking_id: newBooking.id,
              new_reference: newReference,
              user_email: user.email
            },
            timestamp: new Date().toISOString()
          });
        } catch (auditError) {
          console.log("Audit log insert failed (table may not exist):", auditError);
        }

        return NextResponse.json({ success: true, data: newBooking });
      }

      case "reschedule": {
        const { newDate, newTime } = data;
        
        // Note: pickup_time doesn't exist in database, only date can be updated
        const { data: booking, error } = await supabase
          .from("bookings")
          .update({ 
            date: newDate,
            // pickup_time: newTime, // This column doesn't exist
            updated_at: new Date().toISOString()
          })
          .eq("id", bookingId)
          .select()
          .single();

        if (error) throw error;

        // Try to log to audit trail (table might not exist)
        try {
          await supabase.from("audit_log").insert({
            user_id: user.id,
            action: `booking.rescheduled`,
            target: bookingId,
            details: {
              old_date: data.oldDate,
              new_date: newDate,
              new_time: newTime,
              user_email: user.email
            },
            timestamp: new Date().toISOString()
          });
        } catch (auditError) {
          console.log("Audit log insert failed (table may not exist):", auditError);
        }

        return NextResponse.json({ success: true, data: booking });
      }

      case "cancel": {
        const { reason, refundAmount } = data;
        
        // Note: cancellation_reason, cancellation_date, refund_amount columns don't exist
        // Only update status and special_requirements can store the reason
        const { data: booking, error } = await supabase
          .from("bookings")
          .update({ 
            status: "cancelled",
            special_requirements: `CANCELLED: ${reason}. Refund: ${refundAmount || 0}`,
            updated_at: new Date().toISOString()
          })
          .eq("id", bookingId)
          .select()
          .single();

        if (error) throw error;

        // Try to log to audit trail (table might not exist)
        try {
          await supabase.from("audit_log").insert({
            user_id: user.id,
            action: `booking.cancelled`,
            target: bookingId,
            details: {
              reason,
              refund_amount: refundAmount,
              user_email: user.email
            },
            timestamp: new Date().toISOString()
          });
        } catch (auditError) {
          console.log("Audit log insert failed (table may not exist):", auditError);
        }

        return NextResponse.json({ success: true, data: booking });
      }

      case "generate_invoice": {
        // Get booking details
        const { data: booking, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("id", bookingId)
          .single();

        if (error) throw error;

        // Generate invoice data (using ACTUAL column names from database)
        const invoiceData = {
          invoice_number: `INV-${Date.now().toString(36).toUpperCase()}`,
          booking_reference: booking.booking_reference,
          customer_name: booking.guest_name,
          customer_email: booking.guest_email,
          date: new Date().toISOString(),
          tour_date: booking.date,
          tour_name: "Custom Tour Package",
          guests: booking.guests || 1,
          total_amount: booking.total_amount,
          payment_status: booking.status || "pending",
          items: [
            {
              description: "Custom Tour Package",
              quantity: booking.guests || 1,
              unit_price: booking.total_amount / (booking.guests || 1),
              total: booking.total_amount
            }
          ]
        };

        // Store invoice record
        const { data: invoice, error: invoiceError } = await supabase
          .from("invoices")
          .insert({
            booking_id: bookingId,
            invoice_number: invoiceData.invoice_number,
            amount: invoiceData.total_amount,
            status: "generated",
            data: invoiceData,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (invoiceError) {
          // If invoices table doesn't exist, just return the data
          console.log("Invoice table may not exist, returning data only");
        }

        // Try to log to audit trail (table might not exist)
        try {
          await supabase.from("audit_log").insert({
            user_id: user.id,
            action: `invoice.generated`,
            target: bookingId,
            details: {
              invoice_number: invoiceData.invoice_number,
              amount: invoiceData.total_amount,
              user_email: user.email
            },
            timestamp: new Date().toISOString()
          });
        } catch (auditError) {
          console.log("Audit log insert failed (table may not exist):", auditError);
        }

        return NextResponse.json({ 
          success: true, 
          data: invoiceData,
          message: "Invoice generated successfully"
        });
      }

      case "send_confirmation": {
        const { data: booking, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("id", bookingId)
          .single();

        if (error) throw error;

        // Call existing send-confirmation API
        const confirmationResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-confirmation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ bookingId })
        });

        if (!confirmationResponse.ok) {
          throw new Error("Failed to send confirmation email");
        }

        // Try to log to audit trail (table might not exist)
        try {
          await supabase.from("audit_log").insert({
            user_id: user.id,
            action: `email.confirmation_sent`,
            target: bookingId,
            details: {
              recipient: booking.guest_email,
              user_email: user.email
            },
            timestamp: new Date().toISOString()
          });
        } catch (auditError) {
          console.log("Audit log insert failed (table may not exist):", auditError);
        }

        return NextResponse.json({ 
          success: true, 
          message: "Confirmation email sent successfully"
        });
      }

      case "add_note": {
        const { note } = data;
        
        // Database doesn't have admin_notes column, use special_requirements
        const { data: booking, error: fetchError } = await supabase
          .from("bookings")
          .select("special_requirements")
          .eq("id", bookingId)
          .single();

        if (fetchError) throw fetchError;

        const existingNotes = booking.special_requirements || "";
        const newNotes = existingNotes 
          ? `${existingNotes}\n\n[ADMIN NOTE ${new Date().toISOString()}] ${user.email}:\n${note}`
          : `[ADMIN NOTE ${new Date().toISOString()}] ${user.email}:\n${note}`;

        const { data: updatedBooking, error: updateError } = await supabase
          .from("bookings")
          .update({ 
            special_requirements: newNotes,
            updated_at: new Date().toISOString()
          })
          .eq("id", bookingId)
          .select()
          .single();

        if (updateError) throw updateError;

        // Try to log to audit trail (table might not exist)
        try {
          await supabase.from("audit_log").insert({
            user_id: user.id,
            action: `booking.note_added`,
            target: bookingId,
            details: {
              note: note.substring(0, 100),
              user_email: user.email
            },
            timestamp: new Date().toISOString()
          });
        } catch (auditError) {
          console.log("Audit log insert failed (table may not exist):", auditError);
        }

        return NextResponse.json({ success: true, data: updatedBooking });
      }

      case "mark_paid": {
        const { amount, paymentMethod } = data;
        
        // Database doesn't have payment_status, payment_amount, payment_method, payment_date columns
        // Only has total_amount and status
        const { data: booking, error } = await supabase
          .from("bookings")
          .update({ 
            total_amount: amount,
            status: "confirmed",
            updated_at: new Date().toISOString()
          })
          .eq("id", bookingId)
          .select()
          .single();

        if (error) throw error;

        // Try to log to audit trail (table might not exist)
        try {
          await supabase.from("audit_log").insert({
            user_id: user.id,
            action: `payment.marked_paid`,
            target: bookingId,
            details: {
              amount,
              payment_method: paymentMethod,
              user_email: user.email
            },
            timestamp: new Date().toISOString()
          });
        } catch (auditError) {
          console.log("Audit log insert failed (table may not exist):", auditError);
        }

        return NextResponse.json({ success: true, data: booking });
      }

      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Booking operation error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve booking details
export async function GET(req: NextRequest) {
  const user = await isAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
  );

  const { searchParams } = new URL(req.url);
  const bookingId = searchParams.get("id");

  if (!bookingId) {
    return NextResponse.json(
      { success: false, error: "Booking ID required" },
      { status: 400 }
    );
  }

  try {
    const { data: booking, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data: booking });
  } catch (error: any) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
