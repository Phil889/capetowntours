"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users, MapPin, Clock } from "lucide-react";
import { EnhancedBooking } from "@/types/booking-management";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from "date-fns";
import { cn } from "@/lib/utils";

interface BookingCalendarProps {
  bookings: EnhancedBooking[];
  onBookingSelect: (booking: EnhancedBooking) => void;
  onDateChange?: (date: string) => void;
}

export default function BookingCalendar({ bookings, onBookingSelect, onDateChange }: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Group bookings by date
  const bookingsByDate = useMemo(() => {
    const grouped: Record<string, EnhancedBooking[]> = {};
    bookings.forEach((booking) => {
      const dateKey = format(new Date(booking.date), "yyyy-MM-dd");
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(booking);
    });
    return grouped;
  }, [bookings]);

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    if (onDateChange) {
      onDateChange(format(date, "yyyy-MM-dd"));
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      confirmed: "bg-green-100 text-green-800 border-green-300",
      deposit_paid: "bg-blue-100 text-blue-800 border-blue-300",
      paid_full: "bg-green-200 text-green-900 border-green-400",
      in_progress: "bg-purple-100 text-purple-800 border-purple-300",
      completed: "bg-gray-100 text-gray-800 border-gray-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
      refunded: "bg-orange-100 text-orange-800 border-orange-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getDayBookings = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return bookingsByDate[dateKey] || [];
  };

  const selectedDateBookings = selectedDate ? getDayBookings(selectedDate) : [];

  // Get the first day of the week (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = monthStart.getDay();
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
      {/* Calendar View */}
      <div className="xl:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold">
                {format(currentMonth, "MMMM yyyy")}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentMonth(new Date());
                    setSelectedDate(new Date());
                  }}
                >
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={handleNextMonth}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
              {/* Weekday headers */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-xs sm:text-sm font-medium text-muted-foreground p-1 sm:p-2">
                  <span className="hidden sm:inline">{day}</span>
                  <span className="sm:hidden">{day.slice(0, 1)}</span>
                </div>
              ))}

              {/* Empty cells for alignment */}
              {emptyDays.map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square" />
              ))}

              {/* Calendar days */}
              {monthDays.map((date) => {
                const dayBookings = getDayBookings(date);
                const hasBookings = dayBookings.length > 0;
                const isSelected = selectedDate && isSameDay(date, selectedDate);
                const isTodayDate = isToday(date);

                return (
                  <div
                    key={date.toISOString()}
                    className={cn(
                      "aspect-square border rounded-md sm:rounded-lg p-1 sm:p-2 cursor-pointer transition-all hover:shadow-md",
                      isSelected && "ring-2 ring-primary",
                      isTodayDate && "bg-blue-50",
                      !hasBookings && "bg-gray-50"
                    )}
                    onClick={() => handleDateClick(date)}
                  >
                    <div className="h-full flex flex-col">
                      <div className="flex justify-between items-start">
                        <span
                          className={cn(
                            "text-xs sm:text-sm font-medium",
                            isTodayDate && "text-blue-600",
                            isSelected && "text-primary"
                          )}
                        >
                          {format(date, "d")}
                        </span>
                        {hasBookings && (
                          <Badge variant="secondary" className="text-[10px] sm:text-xs px-0.5 sm:px-1 h-4 sm:h-5">
                            {dayBookings.length}
                          </Badge>
                        )}
                      </div>
                      {hasBookings && (
                        <div className="mt-0.5 sm:mt-1 space-y-0.5 sm:space-y-1 flex-1 overflow-hidden">
                          <div className="hidden sm:block">
                            {dayBookings.slice(0, 3).map((booking, index) => (
                              <div
                                key={booking.id}
                                className={cn(
                                  "text-xs p-1 rounded truncate border",
                                  getStatusColor(booking.status)
                                )}
                                title={`${booking.booking_reference} - ${booking.customer.name || "Guest"}`}
                              >
                                {booking.booking_reference}
                              </div>
                            ))}
                            {dayBookings.length > 3 && (
                              <div className="text-xs text-muted-foreground text-center">
                                +{dayBookings.length - 3} more
                              </div>
                            )}
                          </div>
                          <div className="sm:hidden">
                            {dayBookings.slice(0, 2).map((booking, index) => (
                              <div
                                key={booking.id}
                                className={cn(
                                  "h-1.5 rounded-full",
                                  getStatusColor(booking.status).split(' ')[0]
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t">
              <p className="text-xs sm:text-sm font-medium mb-2">Status Legend:</p>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {[
                  { status: "pending", label: "Pending" },
                  { status: "confirmed", label: "Confirmed" },
                  { status: "deposit_paid", label: "Deposit Paid" },
                  { status: "in_progress", label: "In Progress" },
                  { status: "completed", label: "Completed" },
                  { status: "cancelled", label: "Cancelled" },
                ].map(({ status, label }) => (
                  <div key={status} className="flex items-center gap-0.5 sm:gap-1">
                    <div className={cn("w-2 h-2 sm:w-3 sm:h-3 rounded border", getStatusColor(status))} />
                    <span className="text-[10px] sm:text-xs text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Day Details */}
      <div className="order-first xl:order-last">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedDate ? format(selectedDate, "EEEE, MMMM d") : "Select a date"}
            </CardTitle>
            {selectedDate && (
              <p className="text-sm text-muted-foreground">
                {selectedDateBookings.length} booking{selectedDateBookings.length !== 1 ? "s" : ""}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              selectedDateBookings.length > 0 ? (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {selectedDateBookings.map((booking) => (
                    <Card
                      key={booking.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => onBookingSelect(booking)}
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-sm">{booking.booking_reference}</span>
                          <Badge className={cn("text-xs", getStatusColor(booking.status))}>
                            {booking.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{booking.customer.name || "Guest"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            <span>{booking.tour_name || "Custom Package"}</span>
                          </div>
                          {booking.operations?.pickup_time && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{booking.operations.pickup_time}</span>
                            </div>
                          )}
                          {booking.operations?.pickup_location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{booking.operations.pickup_location}</span>
                            </div>
                          )}
                          <div className="pt-1">
                            <span className="font-medium">
                              {booking.total_guests} guest{booking.total_guests !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No bookings on this date</p>
                </div>
              )
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Select a date to view bookings</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats for Selected Date */}
        {selectedDate && selectedDateBookings.length > 0 && (
          <Card className="mt-4 hidden xl:block">
            <CardHeader>
              <CardTitle className="text-sm">Day Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Guests:</span>
                <span className="font-medium">
                  {selectedDateBookings.reduce((sum, b) => sum + b.total_guests, 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Revenue:</span>
                <span className="font-medium">
                  R{selectedDateBookings.reduce((sum, b) => sum + b.financial.total_amount, 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Confirmed:</span>
                <span className="font-medium">
                  {selectedDateBookings.filter((b) => b.status === "confirmed").length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pending:</span>
                <span className="font-medium">
                  {selectedDateBookings.filter((b) => b.status === "pending").length}
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
