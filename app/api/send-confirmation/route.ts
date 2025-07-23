import { NextRequest, NextResponse } from "next/server";

// In production, use Resend, nodemailer, or another email provider
async function sendEmail(to: string, subject: string, text: string) {
  // Placeholder: log the email
  console.log("Sending email to:", to, "Subject:", subject, "Text:", text);
  return true;
}

export async function POST(req: NextRequest) {
  const { booking } = await req.json();
  if (!booking || !booking.guest_email) {
    return NextResponse.json({ error: "Missing booking or guest_email" }, { status: 400 });
  }

  // Compose email
  const subject = "Your Booking Confirmation";
  const text = `Thank you for your booking!
Booking ID: ${booking.id}
Tour ID: ${booking.tour_id}
Date: ${booking.date}
Guests: ${booking.guests}
Status: ${booking.status}
`;

  // Send email (placeholder)
  const success = await sendEmail(booking.guest_email, subject, text);

  if (!success) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
