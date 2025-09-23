"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedBooking } from "@/types/booking-management";
import { format } from "date-fns";
import { logError, logInfo } from "@/lib/error-logger";
import { 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Clock,
  DollarSign,
  Users,
  FileText,
  MessageSquare,
  Edit,
  Save,
  X
} from "lucide-react";

interface BookingDetailModalProps {
  booking: EnhancedBooking | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export default function BookingDetailModal({ 
  booking, 
  isOpen, 
  onClose, 
  onRefresh 
}: BookingDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  if (!booking) return null;

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({
      customer_name: booking.customer.name,
      customer_email: booking.customer.email,
      customer_phone: booking.customer.phone,
      whatsapp_number: booking.customer.whatsapp,
      tour_date: booking.date,
      pickup_time: booking.operations?.pickup_time || "",
      pickup_location: booking.operations?.pickup_location || "",
      number_of_adults: booking.guest_breakdown?.adults || 0,
      number_of_children: booking.guest_breakdown?.children || 0,
      special_requirements: booking.special_requirements || "",
      total_amount: booking.financial.total_amount,
      status: booking.status
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      logInfo('Saving booking', {
        component: 'BookingDetailModal',
        function: 'handleSave',
        bookingId: booking.id,
        editedData
      });
      
      const response = await fetch("/api/admin/bookings/operations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "edit",
          bookingId: booking.id,
          data: editedData
        })
      });

      const data = await response.json();
      
      logInfo('Save booking response received', {
        component: 'BookingDetailModal',
        function: 'handleSave',
        responseStatus: response.status,
        responseData: data
      });
      
      if (data.success) {
        setIsEditing(false);
        onRefresh();
        alert("Booking updated successfully!");
      } else {
        logError('Booking update failed', new Error(data.error || 'Unknown error'), {
          component: 'BookingDetailModal',
          function: 'handleSave',
          bookingId: booking.id,
          responseData: data
        });
        alert(`Error: ${data.error || "Failed to update booking"}`);
      }
    } catch (error: any) {
      logError('Save booking error', error, {
        component: 'BookingDetailModal',
        function: 'handleSave',
        bookingId: booking.id,
        editedData
      });
      alert(`Failed to update booking: ${error.message || "Unknown error"}`);
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Booking {booking.booking_reference}</span>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditing(false)}
                    disabled={saving}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSave}
                    disabled={saving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tour_date">Tour Date</Label>
                {isEditing ? (
                  <Input
                    id="tour_date"
                    type="date"
                    value={editedData.tour_date}
                    onChange={(e) => setEditedData({...editedData, tour_date: e.target.value})}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{format(new Date(booking.date), "PPP")}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="pickup_time">Pickup Time</Label>
                {isEditing ? (
                  <Input
                    id="pickup_time"
                    type="time"
                    value={editedData.pickup_time}
                    onChange={(e) => setEditedData({...editedData, pickup_time: e.target.value})}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{booking.operations?.pickup_time || "Not set"}</span>
                  </div>
                )}
              </div>

              <div className="col-span-2">
                <Label htmlFor="pickup_location">Pickup Location</Label>
                {isEditing ? (
                  <Input
                    id="pickup_location"
                    value={editedData.pickup_location}
                    onChange={(e) => setEditedData({...editedData, pickup_location: e.target.value})}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{booking.operations?.pickup_location || "Not set"}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="adults">Adults</Label>
                {isEditing ? (
                  <Input
                    id="adults"
                    type="number"
                    value={editedData.number_of_adults}
                    onChange={(e) => setEditedData({...editedData, number_of_adults: parseInt(e.target.value)})}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{booking.guest_breakdown?.adults || 0}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="children">Children</Label>
                {isEditing ? (
                  <Input
                    id="children"
                    type="number"
                    value={editedData.number_of_children}
                    onChange={(e) => setEditedData({...editedData, number_of_children: parseInt(e.target.value)})}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{booking.guest_breakdown?.children || 0}</span>
                  </div>
                )}
              </div>

              <div className="col-span-2">
                <Label htmlFor="status">Status</Label>
                {isEditing ? (
                  <select
                    id="status"
                    className="w-full p-2 border rounded"
                    value={editedData.status}
                    onChange={(e) => setEditedData({...editedData, status: e.target.value})}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="deposit_paid">Deposit Paid</option>
                    <option value="paid_full">Paid Full</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                ) : (
                  <div className="p-2">
                    <Badge>{booking.status}</Badge>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="customer" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer_name">Name</Label>
                {isEditing ? (
                  <Input
                    id="customer_name"
                    value={editedData.customer_name}
                    onChange={(e) => setEditedData({...editedData, customer_name: e.target.value})}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{booking.customer.name}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="customer_email">Email</Label>
                {isEditing ? (
                  <Input
                    id="customer_email"
                    type="email"
                    value={editedData.customer_email}
                    onChange={(e) => setEditedData({...editedData, customer_email: e.target.value})}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{booking.customer.email}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="customer_phone">Phone</Label>
                {isEditing ? (
                  <Input
                    id="customer_phone"
                    value={editedData.customer_phone}
                    onChange={(e) => setEditedData({...editedData, customer_phone: e.target.value})}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{booking.customer.phone || "Not provided"}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="whatsapp_number">WhatsApp</Label>
                {isEditing ? (
                  <Input
                    id="whatsapp_number"
                    value={editedData.whatsapp_number}
                    onChange={(e) => setEditedData({...editedData, whatsapp_number: e.target.value})}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    <span>{booking.customer.whatsapp || "Not provided"}</span>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="total_amount">Total Amount</Label>
                {isEditing ? (
                  <Input
                    id="total_amount"
                    type="number"
                    value={editedData.total_amount}
                    onChange={(e) => setEditedData({...editedData, total_amount: parseFloat(e.target.value)})}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-lg font-semibold">{formatCurrency(booking.financial.total_amount)}</span>
                  </div>
                )}
              </div>

              <div>
                <Label>Payment Status</Label>
                <div className="p-2">
                <Badge variant={booking.financial.payment_status === "paid" ? "default" : "secondary"}>
                    {booking.financial.payment_status}
                  </Badge>
                </div>
              </div>

              {/* Deposit amount if applicable */}

              {booking.financial.balance_due && (
                <div>
                  <Label>Balance Due</Label>
                  <div className="p-2">
                    <span>{formatCurrency(booking.financial.balance_due)}</span>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <div>
              <Label htmlFor="special_requirements">Special Requirements</Label>
              {isEditing ? (
                <Textarea
                  id="special_requirements"
                  value={editedData.special_requirements}
                  onChange={(e) => setEditedData({...editedData, special_requirements: e.target.value})}
                  rows={4}
                />
              ) : (
                <div className="p-2 border rounded bg-muted/30">
                  <p className="text-sm">{booking.special_requirements || "None"}</p>
                </div>
              )}
            </div>

            {booking.dietary_restrictions && (
              <div>
                <Label>Dietary Restrictions</Label>
                <div className="p-2 border rounded bg-muted/30">
                  <p className="text-sm">{booking.dietary_restrictions}</p>
                </div>
              </div>
            )}

            {booking.accessibility_needs && (
              <div>
                <Label>Accessibility Needs</Label>
                <div className="p-2 border rounded bg-muted/30">
                  <p className="text-sm">{booking.accessibility_needs}</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
