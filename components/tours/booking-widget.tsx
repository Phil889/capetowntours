"use client";
import { useState } from "react";
import { Calendar, Users, Mail, Phone, MapPin, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

type BookingWidgetProps = {
  tourId: string;
  price: string | number;
  tourName?: string;
};

export default function BookingWidget({ tourId, price, tourName }: BookingWidgetProps) {
  const [formData, setFormData] = useState({
    date: "",
    guests: 1,
    guest_email: "",
    guest_name: "",
    guest_phone: "",
    pickup_location: "",
    special_requirements: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? Number(value) : value
    }));
  };

  const calculateTotal = () => {
    if (typeof price === 'number') {
      return price * formData.guests;
    }
    return price;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Validate required fields
      if (!formData.date || !formData.guest_email || formData.guests < 1) {
        throw new Error("Please fill in all required fields");
      }

      // Send booking request to API
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId,
          ...formData
        }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Booking failed");
      }
      
      const data = await res.json();
      console.log("Booking API response:", data);
      
      // Show success message briefly before redirect
      setSuccess("Booking confirmed! Redirecting to confirmation page...");
      
      // Redirect to booking confirmation page
      setTimeout(() => {
        if (data.booking && data.booking.id) {
          window.location.href = `/booking/confirmed/${data.booking.id}`;
        }
      }, 1500);
      
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Get tomorrow's date as minimum date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-green-600" />
          Book Your Tour
        </CardTitle>
        <CardDescription>
          {tourName ? `Reserve your spot for ${tourName}` : 'Reserve your spot today'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date and Guests Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Tour Date *
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                min={minDate}
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guests" className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                Guests *
              </Label>
              <Input
                id="guests"
                name="guests"
                type="number"
                min={1}
                max={20}
                value={formData.guests}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="guest_name">
              Full Name
            </Label>
            <Input
              id="guest_name"
              name="guest_name"
              type="text"
              placeholder="John Doe"
              value={formData.guest_name}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="guest_email" className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              Email Address *
            </Label>
            <Input
              id="guest_email"
              name="guest_email"
              type="email"
              placeholder="your@email.com"
              value={formData.guest_email}
              onChange={handleInputChange}
              required
              className="w-full"
            />
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="guest_phone" className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              Phone Number
            </Label>
            <Input
              id="guest_phone"
              name="guest_phone"
              type="tel"
              placeholder="+27 12 345 6789"
              value={formData.guest_phone}
              onChange={handleInputChange}
              className="w-full"
            />
            <p className="text-xs text-gray-500">Include country code for international numbers</p>
          </div>

          {/* Pickup Location */}
          <div className="space-y-2">
            <Label htmlFor="pickup_location" className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Pickup Location
            </Label>
            <Input
              id="pickup_location"
              name="pickup_location"
              type="text"
              placeholder="Your hotel name or address"
              value={formData.pickup_location}
              onChange={handleInputChange}
              className="w-full"
            />
            <p className="text-xs text-gray-500">We offer free pickup from most Cape Town hotels</p>
          </div>

          {/* Special Requirements */}
          <div className="space-y-2">
            <Label htmlFor="special_requirements" className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              Special Requirements
            </Label>
            <Textarea
              id="special_requirements"
              name="special_requirements"
              placeholder="Any dietary restrictions, accessibility needs, or special requests?"
              value={formData.special_requirements}
              onChange={handleInputChange}
              rows={3}
              className="w-full"
            />
          </div>

          {/* Price Display */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Price per person:</span>
              <span className="font-medium">R{typeof price === 'number' ? price : price}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Amount:</span>
              <span className="text-green-600">R{calculateTotal()}</span>
            </div>
            <Alert className="mt-2 bg-blue-50 border-blue-200">
              <AlertDescription className="text-sm text-blue-800">
                💰 <strong>Payment on pickup</strong> - No advance payment required!
              </AlertDescription>
            </Alert>
          </div>

          {/* Error Message */}
          {error && (
            <Alert className="bg-red-50 border-red-200">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Success Message */}
          {success && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800 font-medium">
                ✓ {success}
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Booking...
              </>
            ) : (
              <>
                Book Now - Pay on Pickup
              </>
            )}
          </Button>

          {/* Trust Badges */}
          <div className="pt-4 space-y-2 text-center">
            <p className="text-xs text-gray-500">
              ✓ Instant confirmation • ✓ Free cancellation • ✓ Best price guarantee
            </p>
            <p className="text-xs text-gray-500">
              🔒 Your information is secure and will never be shared
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
