"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  FileText, 
  Calendar,
  DollarSign,
  UserPlus,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Tag,
  MapPin,
  Users
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface QuickActionsProps {
  selectedBookings: string[];
  onAction: (action: string, data?: any) => void;
}

export default function QuickActions({ selectedBookings, onAction }: QuickActionsProps) {
  const handleWhatsApp = () => {
    const phoneNumber = "+27123456789"; // Replace with actual number
    const message = encodeURIComponent("Hello! This is Cape Town Safari Tours. How can we assist you today?");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  const handleEmail = () => {
    onAction("email", { bookingIds: selectedBookings });
  };

  const handleCall = () => {
    onAction("call", { bookingIds: selectedBookings });
  };

  const actions = [
    {
      label: "WhatsApp",
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-50 hover:bg-green-100",
      onClick: handleWhatsApp,
      description: "Send WhatsApp message"
    },
    {
      label: "Email",
      icon: Mail,
      color: "text-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100",
      onClick: handleEmail,
      description: "Send email"
    },
    {
      label: "Call",
      icon: Phone,
      color: "text-purple-600",
      bgColor: "bg-purple-50 hover:bg-purple-100",
      onClick: handleCall,
      description: "Make phone call"
    },
    {
      label: "Invoice",
      icon: FileText,
      color: "text-gray-600",
      bgColor: "bg-gray-50 hover:bg-gray-100",
      onClick: () => onAction("invoice"),
      description: "Generate invoice"
    },
    {
      label: "Schedule",
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50 hover:bg-orange-100",
      onClick: () => onAction("schedule"),
      description: "Schedule follow-up"
    },
    {
      label: "Payment",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50 hover:bg-green-100",
      onClick: () => onAction("payment"),
      description: "Record payment"
    },
  ];

  const statusActions = [
    { label: "Confirm Booking", status: "confirmed", icon: CheckCircle, color: "text-green-600" },
    { label: "Mark as Pending", status: "pending", icon: Clock, color: "text-yellow-600" },
    { label: "Cancel Booking", status: "cancelled", icon: XCircle, color: "text-red-600" },
    { label: "Mark as Completed", status: "completed", icon: CheckCircle, color: "text-blue-600" },
  ];

  const bulkActions = [
    { label: "Send Confirmation Emails", action: "bulk_email", icon: Send },
    { label: "Send Reminders", action: "bulk_reminder", icon: Clock },
    { label: "Export Selected", action: "export", icon: FileText },
    { label: "Assign to Staff", action: "assign", icon: UserPlus },
    { label: "Add Tags", action: "tag", icon: Tag },
    { label: "Update Pickup Location", action: "pickup", icon: MapPin },
    { label: "Update Guest Count", action: "guests", icon: Users },
  ];

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {/* Primary Quick Actions */}
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                variant="outline"
                size="sm"
                className={`${action.bgColor} border-0`}
                onClick={action.onClick}
                title={action.description}
              >
                <Icon className={`w-4 h-4 mr-2 ${action.color}`} />
                {action.label}
              </Button>
            );
          })}
        </div>

        <div className="flex gap-2">
          {/* Status Change Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                Change Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Update Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {statusActions.map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem
                    key={item.status}
                    onClick={() => onAction("status_change", { status: item.status })}
                  >
                    <Icon className={`w-4 h-4 mr-2 ${item.color}`} />
                    {item.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Bulk Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Users className="w-4 h-4 mr-2" />
                Bulk Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                {selectedBookings.length > 0 
                  ? `${selectedBookings.length} selected`
                  : "Select bookings first"
                }
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {bulkActions.map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem
                    key={item.action}
                    onClick={() => onAction(item.action)}
                    disabled={selectedBookings.length === 0}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Quick Templates Bar */}
      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-muted-foreground mb-2">Quick Templates:</p>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => onAction("template", { type: "confirmation" })}
          >
            📧 Booking Confirmation
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => onAction("template", { type: "reminder" })}
          >
            ⏰ 24h Reminder
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => onAction("template", { type: "directions" })}
          >
            📍 Pickup Directions
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => onAction("template", { type: "weather" })}
          >
            ☀️ Weather Update
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => onAction("template", { type: "thank_you" })}
          >
            🙏 Thank You Message
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => onAction("template", { type: "review" })}
          >
            ⭐ Review Request
          </Button>
        </div>
      </div>
    </div>
  );
}
