import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { BookingStats } from "@/types/booking-management";

// GET: Fetch booking statistics
export async function GET(req: NextRequest) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Start of this week (Monday)
    const startOfWeek = new Date(today);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    const weekStartStr = startOfWeek.toISOString().split('T')[0];

    // End of this week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    const weekEndStr = endOfWeek.toISOString().split('T')[0];

    // Start of this month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthStartStr = startOfMonth.toISOString().split('T')[0];

    // End of this month
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const monthEndStr = endOfMonth.toISOString().split('T')[0];

    // Fetch various statistics
    const [
      totalBookingsResult,
      todayBookingsResult,
      weekBookingsResult,
      monthBookingsResult,
      pendingBookingsResult,
      revenueResult,
    ] = await Promise.all([
      // Total bookings
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true }),

      // Today's bookings
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .gte("date", todayStr)
        .lt("date", tomorrowStr),

      // This week's bookings
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .gte("date", weekStartStr)
        .lte("date", weekEndStr),

      // This month's bookings
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .gte("date", monthStartStr)
        .lte("date", monthEndStr),

      // Pending bookings
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),

      // Total revenue this month
      supabase
        .from("bookings")
        .select("total_amount")
        .gte("created_at", monthStartStr)
        .in("status", ["confirmed", "deposit_paid", "paid_full", "completed"]),
    ]);

    // Calculate statistics
    const totalBookings = totalBookingsResult.count || 0;
    const todayBookings = todayBookingsResult.count || 0;
    const weekBookings = weekBookingsResult.count || 0;
    const monthBookings = monthBookingsResult.count || 0;
    const pendingBookings = pendingBookingsResult.count || 0;

    // Calculate total revenue
    let totalRevenue = 0;
    if (revenueResult.data) {
      totalRevenue = revenueResult.data.reduce((sum, booking) => sum + (booking.total_amount || 0), 0);
    }

    // Calculate average booking value
    const averageBookingValue = monthBookings > 0 ? totalRevenue / monthBookings : 0;

    // Calculate conversion rate (confirmed / total inquiries)
    const { count: confirmedCount } = await supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .in("status", ["confirmed", "deposit_paid", "paid_full", "completed"]);

    const conversionRate = totalBookings > 0 ? ((confirmedCount || 0) / totalBookings) * 100 : 0;

    const stats: BookingStats = {
      total_bookings: totalBookings,
      total_revenue: totalRevenue,
      pending_bookings: pendingBookings,
      today_bookings: todayBookings,
      this_week_bookings: weekBookings,
      this_month_bookings: monthBookings,
      average_booking_value: averageBookingValue,
      conversion_rate: conversionRate,
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error("Error fetching booking stats:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
