"use client";
import { useState } from "react";
import { Calendar, Users, Mail, Phone, MapPin, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslations } from "@/lib/i18n/hooks";
import { logError, logInfo } from "@/lib/error-logger";

type BookingWidgetProps = {
  tourId: string;
  price: string | number;
  tourName?: string;
  translations?: {
    booking?: {
      book_your_tour?: string;
      reserve_spot_for_tour?: string;
      reserve_spot_today?: string;
      tour_date?: string;
      guests?: string;
      full_name?: string;
      name_placeholder?: string;
      email_address?: string;
      email_placeholder?: string;
      phone_number?: string;
      phone_placeholder?: string;
      phone_help_text?: string;
      pickup_location?: string;
      pickup_placeholder?: string;
      pickup_help_text?: string;
      special_requirements?: string;
      special_requirements_placeholder?: string;
      price_per_person?: string;
      total_amount?: string;
      payment_on_pickup?: string;
      no_advance_payment?: string;
      processing_booking?: string;
      book_now_pay_pickup?: string;
      instant_confirmation?: string;
      free_cancellation?: string;
      best_price_guarantee?: string;
      secure_information?: string;
      please_fill_required_fields?: string;
      booking_confirmed_redirecting?: string;
    };
  };
};

export default function BookingWidget({ tourId, price, tourName, translations }: BookingWidgetProps) {
  const { t } = useTranslations('booking');
  
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
        throw new Error(t('please_fill_required_fields'));
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
      
      logInfo('Booking API response received', {
        component: 'BookingWidget',
        function: 'handleSubmit',
        tourId,
        responseData: data
      });
      
      // Show success message briefly before redirect
      setSuccess(translations?.booking?.booking_confirmed_redirecting || t('booking_confirmed_redirecting'));
      
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
          {translations?.booking?.book_your_tour || t('book_your_tour')}
        </CardTitle>
        <CardDescription>
          {tourName ? (translations?.booking?.reserve_spot_for_tour || t('reserve_spot_for_tour', { tourName })) : (translations?.booking?.reserve_spot_today || t('reserve_spot_today'))}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date and Guests Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {translations?.booking?.tour_date || t('tour_date')} *
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
                {t('guests')} *
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
              {translations?.booking?.full_name || t('full_name')}
            </Label>
            <Input
              id="guest_name"
              name="guest_name"
              type="text"
              placeholder={translations?.booking?.name_placeholder || t('name_placeholder')}
              value={formData.guest_name}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="guest_email" className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              {translations?.booking?.email_address || t('email_address')} *
            </Label>
            <Input
              id="guest_email"
              name="guest_email"
              type="email"
              placeholder={translations?.booking?.email_placeholder || t('email_placeholder')}
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
              {translations?.booking?.phone_number || t('phone_number')}
            </Label>
            <Input
              id="guest_phone"
              name="guest_phone"
              type="tel"
              placeholder={translations?.booking?.phone_placeholder || t('phone_placeholder')}
              value={formData.guest_phone}
              onChange={handleInputChange}
              className="w-full"
            />
            <p className="text-xs text-gray-500">{translations?.booking?.phone_help_text || t('phone_help_text')}</p>
          </div>

          {/* Pickup Location */}
          <div className="space-y-2">
            <Label htmlFor="pickup_location" className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {translations?.booking?.pickup_location || t('pickup_location')}
            </Label>
            <Input
              id="pickup_location"
              name="pickup_location"
              type="text"
              placeholder={translations?.booking?.pickup_placeholder || t('pickup_placeholder')}
              value={formData.pickup_location}
              onChange={handleInputChange}
              className="w-full"
            />
            <p className="text-xs text-gray-500">{translations?.booking?.pickup_help_text || t('pickup_help_text')}</p>
          </div>

          {/* Special Requirements */}
          <div className="space-y-2">
            <Label htmlFor="special_requirements" className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              {translations?.booking?.special_requirements || t('special_requirements')}
            </Label>
            <Textarea
              id="special_requirements"
              name="special_requirements"
              placeholder={translations?.booking?.special_requirements_placeholder || t('special_requirements_placeholder')}
              value={formData.special_requirements}
              onChange={handleInputChange}
              rows={3}
              className="w-full"
            />
          </div>

          {/* Price Display */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{translations?.booking?.price_per_person || t('price_per_person')}:</span>
              <span className="font-medium">R{typeof price === 'number' ? price : price}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold">
              <span>{translations?.booking?.total_amount || t('total_amount')}:</span>
              <span className="text-green-600">R{calculateTotal()}</span>
            </div>
            <Alert className="mt-2 bg-blue-50 border-blue-200">
              <AlertDescription className="text-sm text-blue-800">
                💰 <strong>{translations?.booking?.payment_on_pickup || t('payment_on_pickup')}</strong> - {translations?.booking?.no_advance_payment || t('no_advance_payment')}!
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
                {translations?.booking?.processing_booking || t('processing_booking')}...
              </>
            ) : (
              <>
                {translations?.booking?.book_now_pay_pickup || t('book_now_pay_pickup')}
              </>
            )}
          </Button>

          {/* Trust Badges */}
          <div className="pt-4 space-y-2 text-center">
            <p className="text-xs text-gray-500">
              ✓ {translations?.booking?.instant_confirmation || t('instant_confirmation')} • ✓ {translations?.booking?.free_cancellation || t('free_cancellation')} • ✓ {translations?.booking?.best_price_guarantee || t('best_price_guarantee')}
            </p>
            <p className="text-xs text-gray-500">
              🔒 {translations?.booking?.secure_information || t('secure_information')}
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
