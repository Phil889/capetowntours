import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { logError, logInfo } from '@/lib/error-logger';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to: string, subject: string, html: string) {
  try {
    await resend.emails.send({
      from: "Cape Town Safari Tours <bookings@capetownsafari.tours>",
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    logError('Failed to send confirmation email', error, {
      component: 'SendConfirmationAPI',
      function: 'sendEmail',
      action: 'email_send'
    });
    return false;
  }
}

export async function POST(req: NextRequest) {
  const { booking, tour } = await req.json();
  
  if (!booking || !booking.guest_email) {
    return NextResponse.json({ error: "Missing booking or guest_email" }, { status: 400 });
  }

  // Format date
  const bookingDate = new Date(booking.date);
  const formattedDate = bookingDate.toLocaleDateString('en-ZA', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Generate booking reference if not present
  const bookingReference = booking.booking_reference || `CTT-${new Date().getFullYear()}-${booking.id.substring(0, 6).toUpperCase()}`;

  // Compose professional HTML email
  const subject = `Booking Confirmation - ${bookingReference} - Cape Town Safari Tours`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { margin: 0; font-size: 28px; }
        .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.95; }
        .booking-ref { background: white; color: #16a34a; padding: 8px 16px; border-radius: 5px; display: inline-block; font-weight: bold; margin-top: 15px; font-size: 18px; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px; }
        .section { margin-bottom: 25px; }
        .section h2 { color: #16a34a; font-size: 20px; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; }
        .info-grid { display: grid; gap: 10px; }
        .info-item { padding: 8px 0; }
        .info-label { font-weight: bold; color: #6b7280; font-size: 14px; }
        .info-value { color: #111827; font-size: 16px; margin-top: 2px; }
        .payment-box { background: #dbeafe; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .payment-box h3 { color: #1e40af; margin-top: 0; }
        .benefits { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; margin: 20px 0; }
        .benefits ul { margin: 10px 0; padding-left: 20px; }
        .benefits li { margin: 5px 0; }
        .important-info { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .important-info h3 { color: #d97706; margin-top: 0; }
        .important-info ul { margin: 10px 0; padding-left: 20px; }
        .important-info li { margin: 8px 0; }
        .contact-section { background: #f9fafb; border-radius: 8px; padding: 20px; margin-top: 25px; }
        .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px; }
        .contact-item { text-align: center; }
        .contact-item h4 { color: #16a34a; margin: 0 0 5px 0; }
        .contact-item p { margin: 3px 0; font-size: 14px; }
        .whatsapp-btn { background: #25d366; color: white; text-decoration: none; padding: 12px 24px; border-radius: 5px; display: inline-block; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
        @media (max-width: 600px) {
          .contact-grid { grid-template-columns: 1fr; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🦁 Booking Confirmed!</h1>
          <p>Thank you for choosing Cape Town Safari Tours</p>
          <div class="booking-ref">${bookingReference}</div>
        </div>
        
        <div class="content">
          <div class="section">
            <h2>📍 Tour Details</h2>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Tour Name</div>
                <div class="info-value">${tour?.title || `Tour #${booking.tour_id}`}</div>
              </div>
              ${tour?.description ? `
              <div class="info-item">
                <div class="info-label">Description</div>
                <div class="info-value">${tour.description.substring(0, 200)}...</div>
              </div>
              ` : ''}
              <div class="info-item">
                <div class="info-label">Duration</div>
                <div class="info-value">${tour?.duration_days || 1} Day${(tour?.duration_days || 1) > 1 ? 's' : ''}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>📅 Booking Information</h2>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Date</div>
                <div class="info-value">${formattedDate}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Pickup Time</div>
                <div class="info-value">7:00 AM (We'll confirm 24 hours before)</div>
              </div>
              <div class="info-item">
                <div class="info-label">Number of Guests</div>
                <div class="info-value">${booking.guests} ${booking.guests === 1 ? 'Guest' : 'Guests'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Pickup Location</div>
                <div class="info-value">${booking.pickup_location || 'Your hotel/accommodation (to be confirmed)'}</div>
              </div>
              ${booking.guest_name ? `
              <div class="info-item">
                <div class="info-label">Guest Name</div>
                <div class="info-value">${booking.guest_name}</div>
              </div>
              ` : ''}
              ${booking.guest_phone ? `
              <div class="info-item">
                <div class="info-label">Contact Phone</div>
                <div class="info-value">${booking.guest_phone}</div>
              </div>
              ` : ''}
            </div>
          </div>

          <div class="payment-box">
            <h3>💳 Payment Information</h3>
            <p><strong>Payment Method:</strong>Card or Cash on Pickup</p>
            <p><strong>Total Amount:</strong> ${tour ? `R${(tour.price * booking.guests).toFixed(0)}` : 'To be confirmed'}</p>
            <div class="benefits">
              <strong>Your Benefits:</strong>
              <ul>
                <li>✅ No advance payment required</li>
                <li>✅ Pay safely when we pick you up</li>
                <li>✅ We accept ZAR, USD, EUR, or GBP</li>
                <li>✅ Free cancellation up to 24 hours before</li>
              </ul>
            </div>
          </div>

          <div class="important-info">
            <h3>⚠️ Important Information</h3>
            <ul>
              <li><strong>What to Bring:</strong> Comfortable clothing, sunscreen, hat, camera, and water bottle</li>
              <li><strong>Weather:</strong> Tours operate in all weather conditions. Rain ponchos provided if needed</li>
              <li><strong>Cancellation:</strong> Free cancellation up to 24 hours before the tour</li>
              <li><strong>Meeting Point:</strong> We'll pick you up from your accommodation</li>
            </ul>
          </div>

          <div class="contact-section">
            <h2>📞 Need Help?</h2>
            <center>
              <a href="https://wa.me/27123456789?text=Hi,%20I%20have%20a%20booking%20${bookingReference}" class="whatsapp-btn">
                💬 Chat on WhatsApp
              </a>
            </center>
            <div class="contact-grid">
              <div class="contact-item">
                <h4>Phone Support</h4>
                <p>+27 (0) 21 123 4567</p>
                <p>Mon-Sun: 7:00 AM - 8:00 PM</p>
              </div>
              <div class="contact-item">
                <h4>Emergency (Tour Day)</h4>
                <p>+27 98 765 4321</p>
                <p>Available 24/7</p>
              </div>
            </div>
          </div>

          <div class="footer">
            <p><strong>Cape Town Safari Tours</strong></p>
            <p>The best way to experience Cape Town's wildlife and natural beauty</p>
            <p style="margin-top: 15px;">
              <a href="https://capetownsafari.tours/booking/confirmed/${booking.id}" style="color: #16a34a;">View booking online</a> |
              <a href="https://capetownsafari.tours" style="color: #16a34a;">Visit our website</a>
            </p>
            <p style="margin-top: 15px; font-size: 12px;">
              This email confirms your booking. Please save it for your records.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  // Send email
  const success = await sendEmail(booking.guest_email, subject, html);

  if (!success) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
