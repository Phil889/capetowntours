"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Users, Clock, TrendingUp, AlertCircle, CheckCircle2, XCircle, MessageSquare, Phone, Mail, Filter, Download } from "lucide-react";
import BookingsTable from "@/components/admin/bookings/BookingsTable";
import BookingCalendar from "@/components/admin/bookings/BookingCalendar";
import BookingStats from "@/components/admin/bookings/BookingStats";
import QuickActions from "@/components/admin/bookings/QuickActions";
import BookingDetailModal from "@/components/admin/bookings/BookingDetailModal";
import { EnhancedBooking, BookingStats as Stats, BookingFilter } from "@/types/booking-management";
import { format } from "date-fns";
import { logError, logInfo } from "@/lib/error-logger";

export default function BookingsDashboard() {
  const [bookings, setBookings] = useState<EnhancedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<EnhancedBooking | null>(null);
  const [view, setView] = useState<"table" | "calendar" | "kanban">("table");
  const [filter, setFilter] = useState<BookingFilter>({});
  const [stats, setStats] = useState<Stats | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch bookings and stats
  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, [filter, refreshTrigger]);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filter).forEach(([key, value]) => {
        if (value) {
          if (Array.isArray(value)) {
            queryParams.append(key, value.join(','));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });

      const res = await fetch(`/api/admin/bookings/enhanced?${queryParams}`);
      const data = await res.json();
      
      if (data.success) {
        setBookings(data.data);
      } else {
        setError(data.error || "Failed to fetch bookings");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/bookings/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      logError('Failed to fetch booking stats', err as Error, {
        component: 'BookingsDashboard',
        function: 'fetchStats'
      });
    }
  };

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Priority bookings that need attention
  const urgentBookings = useMemo(() => {
    return bookings.filter(b => 
      b.priority === 'urgent' || 
      b.priority === 'high' ||
      (b.status === 'pending' && new Date(b.date) <= new Date(Date.now() + 48 * 60 * 60 * 1000))
    );
  }, [bookings]);

  const todaysBookings = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return bookings.filter(b => b.date === today);
  }, [bookings]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Booking Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage all your bookings efficiently</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={refreshData} className="flex-1 sm:flex-initial">
            <Clock className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Refresh</span>
            <span className="sm:hidden">Sync</span>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-initial">
            <Download className="w-4 h-4 mr-1 sm:mr-2" />
            Export
          </Button>
          <Button size="sm" className="flex-1 sm:flex-initial">
            <Filter className="w-4 h-4 mr-1 sm:mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Alert Banner for Urgent Items */}
      {urgentBookings.length > 0 && (
        <Card className="border-orange-500 bg-orange-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <CardTitle className="text-lg">Attention Required</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-800">
              You have {urgentBookings.length} booking{urgentBookings.length > 1 ? 's' : ''} that need immediate attention.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards */}
      {stats && <BookingStats stats={stats} />}

      {/* Quick Actions Bar */}
      <QuickActions 
        selectedBookings={[]} 
        onAction={async (action: string, data?: any) => {
          logInfo('Quick action triggered', {
            component: 'BookingsDashboard',
            function: 'onAction',
            action,
            data
          });
          
          try {
            switch (action) {
              case 'status_change':
                // Handle bulk status change
                if (data?.status) {
                  alert(`Status change to ${data.status} - feature coming soon`);
                  // You can implement bulk status updates here
                }
                break;
                
              case 'invoice':
                alert('Bulk invoice generation - feature coming soon');
                break;
                
              case 'email':
                alert('Bulk email - feature coming soon');
                break;
                
              case 'template':
                if (data?.type === 'confirmation') {
                  alert('Sending confirmation emails - feature coming soon');
                } else if (data?.type === 'reminder') {
                  alert('Sending reminder emails - feature coming soon');
                } else if (data?.type === 'directions') {
                  alert('Sending pickup directions - feature coming soon');
                } else if (data?.type === 'weather') {
                  alert('Sending weather updates - feature coming soon');
                } else if (data?.type === 'thank_you') {
                  alert('Sending thank you messages - feature coming soon');
                } else if (data?.type === 'review') {
                  alert('Sending review requests - feature coming soon');
                }
                break;
                
              case 'schedule':
                alert('Schedule follow-up - feature coming soon');
                break;
                
              case 'payment':
                alert('Record payment - feature coming soon');
                break;
                
              case 'export':
                alert('Export selected bookings - feature coming soon');
                break;
                
              case 'assign':
                alert('Assign to staff - feature coming soon');
                break;
                
              case 'tag':
                alert('Add tags - feature coming soon');
                break;
                
              case 'pickup':
                alert('Update pickup location - feature coming soon');
                break;
                
              case 'guests':
                alert('Update guest count - feature coming soon');
                break;
                
              default:
                logError('Unhandled quick action', new Error('Action not implemented'), {
                  component: 'BookingsDashboard',
                  function: 'onAction',
                  action,
                  data
                });
            }
          } catch (error) {
            logError('Error handling quick action', error as Error, {
              component: 'BookingsDashboard',
              function: 'onAction',
              action,
              data
            });
            alert('An error occurred while processing the action');
          }
          
          refreshData();
        }}
      />

      {/* Main Content Area */}
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <TabsList className="w-full lg:w-auto overflow-x-auto">
            <TabsTrigger value="all">
              All Bookings
              <Badge className="ml-2" variant="secondary">{bookings.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="today">
              Today
              <Badge className="ml-2" variant="secondary">{todaysBookings.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending
              <Badge className="ml-2" variant="secondary">
                {bookings.filter(b => b.status === 'pending').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="confirmed">
              Confirmed
              <Badge className="ml-2" variant="secondary">
                {bookings.filter(b => b.status === 'confirmed').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="custom">
              Custom Tours
              <Badge className="ml-2" variant="secondary">
                {bookings.filter(b => b.tour_type === 'custom').length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* View Toggle */}
          <div className="flex gap-2 w-full lg:w-auto">
            <Button
              variant={view === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("table")}
              className="flex-1 lg:flex-initial"
            >
              <span className="hidden sm:inline">Table</span>
              <span className="sm:hidden">📋</span>
            </Button>
            <Button
              variant={view === "calendar" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("calendar")}
              className="flex-1 lg:flex-initial"
            >
              <span className="hidden sm:inline">Calendar</span>
              <span className="sm:hidden">📅</span>
            </Button>
            <Button
              variant={view === "kanban" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("kanban")}
              className="flex-1 lg:flex-initial"
            >
              <span className="hidden sm:inline">Kanban</span>
              <span className="sm:hidden">📊</span>
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          {view === "table" && (
            <BookingsTable 
              bookings={bookings}
              loading={loading}
              error={error}
              onBookingSelect={setSelectedBooking}
              onRefresh={refreshData}
              filter={filter}
              onFilterChange={setFilter}
            />
          )}
          {view === "calendar" && (
            <BookingCalendar 
              bookings={bookings}
              onBookingSelect={setSelectedBooking}
              onDateChange={(date: string) => {
                setFilter({ ...filter, date_from: date, date_to: date });
              }}
            />
          )}
          {view === "kanban" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {['pending', 'confirmed', 'deposit_paid', 'in_progress', 'completed'].map(status => (
                <div key={status} className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <h3 className="font-semibold mb-3 capitalize">{status.replace('_', ' ')}</h3>
                  <div className="space-y-2">
                    {bookings
                      .filter(b => b.status === status)
                      .map(booking => (
                        <Card 
                          key={booking.id} 
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <CardContent className="p-3">
                            <p className="font-medium text-sm">{booking.booking_reference}</p>
                            <p className="text-xs text-muted-foreground">{booking.customer.name}</p>
                            <p className="text-xs mt-1">{format(new Date(booking.date), 'MMM dd')}</p>
                            {booking.priority === 'urgent' && (
                              <Badge variant="destructive" className="mt-2 text-xs">Urgent</Badge>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="today" className="space-y-4">
          <BookingsTable 
            bookings={todaysBookings}
            loading={loading}
            error={error}
            onBookingSelect={setSelectedBooking}
            onRefresh={refreshData}
            filter={filter}
            onFilterChange={setFilter}
          />
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <BookingsTable 
            bookings={bookings.filter(b => b.status === 'pending')}
            loading={loading}
            error={error}
            onBookingSelect={setSelectedBooking}
            onRefresh={refreshData}
            filter={filter}
            onFilterChange={setFilter}
          />
        </TabsContent>

        <TabsContent value="confirmed" className="space-y-4">
          <BookingsTable 
            bookings={bookings.filter(b => b.status === 'confirmed')}
            loading={loading}
            error={error}
            onBookingSelect={setSelectedBooking}
            onRefresh={refreshData}
            filter={filter}
            onFilterChange={setFilter}
          />
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <BookingsTable 
            bookings={bookings.filter(b => b.tour_type === 'custom')}
            loading={loading}
            error={error}
            onBookingSelect={setSelectedBooking}
            onRefresh={refreshData}
            filter={filter}
            onFilterChange={setFilter}
          />
        </TabsContent>
      </Tabs>

      {/* Booking Detail Modal */}
      <BookingDetailModal
        booking={selectedBooking}
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onRefresh={refreshData}
      />
    </div>
  );
}
