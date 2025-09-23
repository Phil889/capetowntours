"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  ChevronDown,
  Phone,
  Mail,
  MessageSquare,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Calendar,
  Clock,
  User,
  MapPin,
  DollarSign,
  AlertCircle,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  Users,
  Tag,
  FileText,
  TrendingUp,
} from "lucide-react";
import { EnhancedBooking, BookingFilter } from "@/types/booking-management";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { logInfo } from "@/lib/error-logger";

interface BookingsTableProps {
  bookings: EnhancedBooking[];
  loading: boolean;
  error: string | null;
  onBookingSelect: (booking: EnhancedBooking) => void;
  onRefresh: () => void;
  filter: BookingFilter;
  onFilterChange: (filter: BookingFilter) => void;
}

export default function BookingsTable({
  bookings,
  loading,
  error,
  onBookingSelect,
  onRefresh,
  filter,
  onFilterChange,
}: BookingsTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter and sort bookings
  const processedBookings = useMemo(() => {
    let filtered = [...bookings];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((booking) => {
        return (
          booking.booking_reference?.toLowerCase().includes(term) ||
          booking.customer.name?.toLowerCase().includes(term) ||
          booking.customer.email?.toLowerCase().includes(term) ||
          booking.customer.phone?.toLowerCase().includes(term) ||
          booking.tour_name?.toLowerCase().includes(term) ||
          booking.itinerary?.toLowerCase().includes(term)
        );
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField as keyof EnhancedBooking];
      let bValue: any = b[sortField as keyof EnhancedBooking];

      // Handle nested fields
      if (sortField === "customer.name") {
        aValue = a.customer.name;
        bValue = b.customer.name;
      } else if (sortField === "financial.total_amount") {
        aValue = a.financial.total_amount;
        bValue = b.financial.total_amount;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [bookings, searchTerm, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === processedBookings.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(processedBookings.map((b) => b.id));
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; icon: any }> = {
      pending: { variant: "secondary", icon: Clock },
      confirmed: { variant: "default", icon: CheckCircle },
      deposit_paid: { variant: "outline", icon: DollarSign },
      paid_full: { variant: "success", icon: CheckCircle },
      in_progress: { variant: "default", icon: Users },
      completed: { variant: "success", icon: CheckCircle },
      cancelled: { variant: "destructive", icon: XCircle },
      refunded: { variant: "secondary", icon: DollarSign },
    };

    const config = statusConfig[status] || { variant: "secondary", icon: AlertCircle };
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null;

    const priorityConfig: Record<string, { variant: any; className: string }> = {
      urgent: { variant: "destructive", className: "animate-pulse" },
      high: { variant: "destructive", className: "" },
      medium: { variant: "secondary", className: "" },
      low: { variant: "outline", className: "" },
    };

    const config = priorityConfig[priority] || { variant: "outline", className: "" };

    return (
      <Badge variant={config.variant} className={cn("gap-1", config.className)}>
        {priority === "urgent" && <AlertCircle className="w-3 h-3" />}
        {priority}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={onRefresh}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full lg:flex-1">
          <div className="relative w-full sm:flex-1 sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by reference, name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select
            value={filter.status?.[0] || "all"}
            onValueChange={(value) => {
              if (value === "all") {
                onFilterChange({ ...filter, status: undefined });
              } else {
                onFilterChange({ ...filter, status: [value] });
              }
            }}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="deposit_paid">Deposit Paid</SelectItem>
              <SelectItem value="paid_full">Paid Full</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filter.priority?.[0] || "all"}
            onValueChange={(value) => {
              if (value === "all") {
                onFilterChange({ ...filter, priority: undefined });
              } else {
                onFilterChange({ ...filter, priority: [value] });
              }
            }}
          >
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          {selectedIds.length > 0 && (
            <span className="font-medium">{selectedIds.length} selected • </span>
          )}
          {processedBookings.length} results
        </div>
      </div>

      {/* Table - Scrollable on mobile */}
      <div className="border rounded-lg overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12 hidden sm:table-cell">
                <Checkbox
                  checked={selectedIds.length === processedBookings.length && processedBookings.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("booking_reference")}>
                <div className="flex items-center gap-1">
                  Reference
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("customer.name")}>
                <div className="flex items-center gap-1">
                  Customer
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </TableHead>
              <TableHead>Tour Details</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                <div className="flex items-center gap-1">
                  Date
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </TableHead>
              <TableHead>Guests</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("financial.total_amount")}>
                <div className="flex items-center gap-1">
                  Amount
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedBookings.map((booking) => (
              <TableRow
                key={booking.id}
                className={cn(
                  "cursor-pointer hover:bg-muted/50 transition-colors",
                  selectedIds.includes(booking.id) && "bg-muted/30"
                )}
                onClick={() => onBookingSelect(booking)}
              >
                <TableCell onClick={(e) => e.stopPropagation()} className="hidden sm:table-cell">
                  <Checkbox
                    checked={selectedIds.includes(booking.id)}
                    onCheckedChange={() => handleSelectOne(booking.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {booking.booking_reference}
                    {booking.tour_type === "custom" && (
                      <Badge variant="outline" className="text-xs">
                        Custom
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm sm:text-base">{booking.customer.name || "Guest"}</p>
                    <p className="text-xs text-muted-foreground">{booking.customer.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <p className="font-medium text-sm truncate">
                      {booking.tour_name || "Custom Package"}
                    </p>
                    {booking.operations?.pickup_location && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {booking.operations.pickup_location}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{format(new Date(booking.date), "MMM dd, yyyy")}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(booking.date), { addSuffix: true })}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{booking.total_guests}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{formatCurrency(booking.financial.total_amount)}</p>
                    {booking.financial.payment_status !== "pending" && (
                      <p className="text-xs text-muted-foreground capitalize">
                        {booking.financial.payment_status}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(booking.status)}</TableCell>
                <TableCell>{getPriorityBadge(booking.priority)}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()} className="hidden md:table-cell">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        const phone = booking.customer.whatsapp || booking.customer.phone;
                        if (phone) {
                          const message = encodeURIComponent(
                            `Hello ${booking.customer.name || ""}! This is Cape Town Safari Tours regarding your booking ${booking.booking_reference}.`
                          );
                          window.open(`https://wa.me/${phone.replace(/\D/g, "")}?text=${message}`, "_blank");
                        }
                      }}
                      disabled={!booking.customer.phone && !booking.customer.whatsapp}
                    >
                      <MessageSquare className="w-4 h-4 text-green-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `mailto:${booking.customer.email}?subject=Booking ${booking.booking_reference}`;
                      }}
                    >
                      <Mail className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (booking.customer.phone) {
                          window.location.href = `tel:${booking.customer.phone}`;
                        }
                      }}
                      disabled={!booking.customer.phone}
                    >
                      <Phone className="w-4 h-4 text-purple-600" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onBookingSelect(booking)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        // This will open the modal where user can click Edit button
                        onBookingSelect(booking);
                      }}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Booking
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={async () => {
                        try {
                          const res = await fetch("/api/admin/bookings/operations", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              action: "duplicate",
                              bookingId: booking.id
                            })
                          });
                          const data = await res.json();
                          if (data.success) {
                            alert(`Booking duplicated successfully! New reference: ${data.data.booking_reference}`);
                            onRefresh();
                          } else {
                            alert(`Error: ${data.error}`);
                          }
                        } catch (error) {
                          alert("Failed to duplicate booking");
                        }
                      }}>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={async () => {
                        try {
                          const res = await fetch("/api/admin/bookings/operations", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              action: "generate_invoice",
                              bookingId: booking.id
                            })
                          });
                          const data = await res.json();
                          if (data.success) {
                            alert(`Invoice generated successfully! Invoice #${data.data.invoice_number}`);
                            // You can open a PDF preview or download here
                            logInfo('Invoice generated successfully', {
                              component: 'BookingsTable',
                              function: 'generateInvoiceAction',
                              bookingId: booking.id,
                              invoiceData: data.data
                            });
                          } else {
                            alert(`Error: ${data.error}`);
                          }
                        } catch (error) {
                          alert("Failed to generate invoice");
                        }
                      }}>
                        <FileText className="w-4 h-4 mr-2" />
                        Generate Invoice
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={async () => {
                        const newDate = prompt("Enter new date (YYYY-MM-DD):", booking.date);
                        const newTime = prompt("Enter new pickup time:", booking.operations?.pickup_time || "09:00");
                        
                        if (newDate && newTime) {
                          try {
                            const res = await fetch("/api/admin/bookings/operations", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                action: "reschedule",
                                bookingId: booking.id,
                                data: {
                                  oldDate: booking.date,
                                  newDate,
                                  newTime
                                }
                              })
                            });
                            const data = await res.json();
                            if (data.success) {
                              alert("Booking rescheduled successfully!");
                              onRefresh();
                            } else {
                              alert(`Error: ${data.error}`);
                            }
                          } catch (error) {
                            alert("Failed to reschedule booking");
                          }
                        }
                      }}>
                        <Calendar className="w-4 h-4 mr-2" />
                        Reschedule
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={async () => {
                          const reason = prompt("Cancellation reason:");
                          const refundAmount = prompt("Refund amount (ZAR):", booking.financial.total_amount.toString());
                          
                          if (reason && confirm(`Are you sure you want to cancel booking ${booking.booking_reference}?`)) {
                            try {
                              const res = await fetch("/api/admin/bookings/operations", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  action: "cancel",
                                  bookingId: booking.id,
                                  data: {
                                    reason,
                                    refundAmount: parseFloat(refundAmount || "0")
                                  }
                                })
                              });
                              const data = await res.json();
                              if (data.success) {
                                alert("Booking cancelled successfully!");
                                onRefresh();
                              } else {
                                alert(`Error: ${data.error}`);
                              }
                            } catch (error) {
                              alert("Failed to cancel booking");
                            }
                          }
                        }}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancel Booking
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {processedBookings.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No bookings found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
