"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Phone, 
  Mail, 
  Download, 
  Printer,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  FileDown,
  Share2,
  CreditCard
} from "lucide-react";
// PDF libraries - optional, will gracefully degrade if not installed
let html2canvas: any;
let jsPDF: any;

try {
  html2canvas = require('html2canvas');
  jsPDF = require('jspdf').jsPDF;
} catch (e) {
  console.log('PDF libraries not installed. Download PDF feature will be disabled.');
}

type Tour = {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  duration_days?: number;
  image_url?: string;
  category?: string;
  highlights?: string[];
};

type Booking = {
  id: string;
  tour_id: string;
  date: string;
  guests: number;
  status: string;
  guest_email?: string;
  guest_name?: string;
  guest_phone?: string;
  special_requirements?: string;
  pickup_location?: string;
  booking_reference?: string;
  created_at?: string;
  updated_at?: string;
};

export default function BookingConfirmedPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      return;
    }
    const fetchBookingAndTour = async () => {
      // Already loading from initial state
      setError(null);
      try {
        // Fetch booking details
        const bookingRes = await fetch(`/api/bookings/${bookingId}`);
        if (!bookingRes.ok) {
          throw new Error("Failed to fetch booking");
        }
        const bookingData = await bookingRes.json();
        const bookingInfo = bookingData.booking || null;
        setBooking(bookingInfo);

        // Fetch tour details
        let tourInfo = null;
        if (bookingInfo?.tour_id) {
          const tourRes = await fetch(`/api/tours/${bookingInfo.tour_id}`);
          if (tourRes.ok) {
            const tourData = await tourRes.json();
            tourInfo = tourData.tour || null;
            setTour(tourInfo);
          }
        }

        // Send confirmation email if booking is confirmed and email hasn't been sent yet
        if (bookingInfo?.status === 'confirmed' && bookingInfo?.guest_email) {
          // Check if we need to send email (you might want to track this in DB)
          await sendConfirmationEmail(bookingInfo, tourInfo);
        }
      } catch (err: any) {
        setError(err.message);
      }
      setLoading(false);
    };
    fetchBookingAndTour();
  }, [bookingId]);

  const sendConfirmationEmail = async (bookingData: Booking, tourData?: Tour) => {
    try {
      const response = await fetch('/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          booking: bookingData,
          tour: tourData 
        }),
      });
      if (!response.ok) {
        console.error('Failed to send confirmation email');
      }
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    }
  };

  const generateBookingReference = (id: string) => {
    const date = new Date();
    const year = date.getFullYear();
    const shortId = id.substring(0, 6).toUpperCase();
    return `CTT-${year}-${shortId}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!confirmationRef.current) return;
    
    // Check if PDF libraries are available
    if (!html2canvas || !jsPDF) {
      alert('PDF download is temporarily unavailable. Please use the Print option instead - it works perfectly for saving your booking confirmation!');
      handlePrint();
      return;
    }
    
    try {
      const canvas = await html2canvas(confirmationRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`booking-${booking?.booking_reference || bookingId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('PDF generation failed. Please use the Print option instead.');
      handlePrint();
    }
  };

  const handleAddToCalendar = () => {
    if (!booking || !tour) return;
    
    const startDate = new Date(booking.date);
    const endDate = new Date(booking.date);
    endDate.setDate(endDate.getDate() + (tour.duration_days || 1));
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${tour.title} - Cape Town Safari Tours
DTSTART:${startDate.toISOString().replace(/[-:]/g, '').replace('.000', '')}
DTEND:${endDate.toISOString().replace(/[-:]/g, '').replace('.000', '')}
DESCRIPTION:Booking Reference: ${booking.booking_reference || generateBookingReference(booking.id)}\\nGuests: ${booking.guests}\\nPayment: On-site at pickup
LOCATION:Cape Town, South Africa
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cape-town-safari-${booking.booking_reference || bookingId}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleWhatsApp = () => {
    const message = `Hi, I've just booked the ${tour?.title} tour. My booking reference is ${booking?.booking_reference || generateBookingReference(booking?.id || '')}`;
    const phoneNumber = '+27123456789'; // Replace with your actual WhatsApp business number
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your booking confirmation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Error Loading Booking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{error}</p>
            <Button className="mt-4" onClick={() => window.location.href = '/'}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Don't show "not found" while still loading
  if (!loading && !booking && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Booking Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">We couldn't find this booking. Please contact support if you need assistance.</p>
            <Button className="mt-4" onClick={() => window.location.href = '/'}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading or error before showing content
  if (loading || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your booking confirmation...</p>
        </div>
      </div>
    );
  }

  const bookingReference = booking.booking_reference || generateBookingReference(booking.id);
  const bookingDate = new Date(booking.date);
  const formattedDate = bookingDate.toLocaleDateString('en-ZA', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Action Buttons - Always visible */}
        <div className="mb-6 flex flex-wrap gap-2 justify-center print:hidden">
          <Button onClick={handleDownloadPDF} variant="default" className="gap-2">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
          <Button onClick={handlePrint} variant="outline" className="gap-2">
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button onClick={handleAddToCalendar} variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Add to Calendar
          </Button>
          <Button onClick={handleWhatsApp} variant="outline" className="gap-2 bg-green-500 text-white hover:bg-green-600">
            <MessageCircle className="w-4 h-4" />
            WhatsApp Us
          </Button>
        </div>

        {/* Main Confirmation Card */}
        <div ref={confirmationRef}>
          <Card className="shadow-xl border-green-200">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-10 h-10" />
                  <div>
                    <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
                    <p className="text-green-100">Thank you for choosing Cape Town Safari Tours</p>
                  </div>
                </div>
                <Badge className="bg-white text-green-600 text-lg px-3 py-1">
                  {bookingReference}
                </Badge>
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Tour Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Tour Details
                </h2>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Tour Name</p>
                    <p className="font-semibold text-lg">{tour?.title || `Tour #${booking.tour_id}`}</p>
                  </div>
                  {tour?.description && (
                    <div>
                      <p className="text-sm text-gray-600">Description</p>
                      <p className="text-gray-700">{tour.description.substring(0, 150)}...</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-medium">{tour?.duration_days || 1} Day{(tour?.duration_days || 1) > 1 ? 's' : ''}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Category</p>
                      <p className="font-medium">{tour?.category || 'Safari Tour'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Booking Details */}
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  Booking Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-medium">{formattedDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Pickup Time</p>
                        <p className="font-medium">7:00 AM (We'll confirm 24h before)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Number of Guests</p>
                        <p className="font-medium">{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Pickup Location</p>
                        <p className="font-medium">{booking.pickup_location || 'Your hotel/accommodation'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{booking.guest_email || 'Not provided'}</p>
                      </div>
                    </div>
                    {booking.guest_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium">{booking.guest_phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Payment Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </h3>
                <div className="space-y-2">
                  <p className="text-blue-800">
                    <span className="font-medium">Payment Method:</span> Card or Cash on Pickup
                  </p>
                  <p className="text-blue-800">
                    <span className="font-medium">Total Amount:</span> {tour ? `R${(tour.price * booking.guests).toFixed(0)}` : 'To be confirmed'}
                  </p>
                  <p className="text-sm text-blue-700 mt-2">
                    ✓ No advance payment required<br />
                    ✓ Pay safely and conveniently when we pick you up<br />
                    ✓ We accept card payments or cash on pickup in ZAR, USD, EUR, or GBP
                  </p>
                </div>
              </div>

              <Separator />

              {/* Important Information */}
              <div>
                <h3 className="font-semibold mb-3">Important Information</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 text-yellow-600" />
                    <p><strong>Cancellation Policy:</strong> Free cancellation up to 24 hours before the tour. Full refund guaranteed.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 text-yellow-600" />
                    <p><strong>What to Bring:</strong> Comfortable clothing, sunscreen, hat, camera, and water bottle.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 text-yellow-600" />
                    <p><strong>Weather:</strong> Tours operate in all weather conditions. Rain ponchos provided if needed.</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Need Help?</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium mb-1">Phone Support</p>
                    <p className="text-gray-600">+27 (0) 21 123 4567</p>
                    <p className="text-gray-600">Mon-Sun: 7:00 AM - 8:00 PM</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">WhatsApp</p>
                    <p className="text-gray-600">+27 12 345 6789</p>
                    <p className="text-gray-600">Quick responses 24/7</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Email</p>
                    <p className="text-gray-600">bookings@capetownsafari.tours</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Emergency (Tour Day)</p>
                    <p className="text-gray-600">+27 98 765 4321</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Message */}
        <div className="mt-8 text-center text-gray-600 print:hidden">
          <p className="mb-2">We're looking forward to showing you the best of Cape Town!</p>
          <p className="text-sm">
            Follow us on social media for updates and special offers.
          </p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
