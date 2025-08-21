// Enhanced Booking Management Types

export interface CustomerProfile {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  country?: string;
  language?: string;
  preferences?: {
    dietary?: string[];
    accessibility?: string[];
    interests?: string[];
    communication_preference?: 'email' | 'whatsapp' | 'phone' | 'sms';
  };
  tags?: string[];
  lifetime_value?: number;
  booking_count?: number;
  first_booking_date?: string;
  last_booking_date?: string;
  notes?: string;
}

export interface TourItem {
  id?: string;
  name: string;
  date: string;
  time?: string;
  pax: {
    adults: number;
    children: number;
    infants?: number;
  };
  price: number;
  notes?: string;
}

export interface BookingFinancials {
  total_amount: number;
  deposit_paid?: number;
  balance_due?: number;
  payment_method?: string;
  payment_status: 'pending' | 'partial' | 'paid' | 'refunded';
  payment_date?: string;
  currency?: string;
  discount_applied?: number;
  commission_amount?: number;
}

export interface BookingOperations {
  pickup_location?: string;
  pickup_time?: string;
  dropoff_location?: string;
  driver_assigned?: string;
  driver_phone?: string;
  guide_assigned?: string;
  guide_phone?: string;
  vehicle_assigned?: string;
  vehicle_type?: string;
  route_notes?: string;
  emergency_contact?: string;
}

export interface CommunicationLog {
  id: string;
  timestamp: string;
  type: 'email' | 'whatsapp' | 'phone' | 'sms' | 'note';
  direction: 'inbound' | 'outbound';
  subject?: string;
  content: string;
  sender: string;
  recipient?: string;
  status?: 'sent' | 'delivered' | 'read' | 'failed';
  attachments?: string[];
}

export interface Task {
  id: string;
  booking_id: string;
  title: string;
  description?: string;
  assigned_to?: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  completed_at?: string;
  notes?: string;
}

export interface EnhancedBooking {
  // Core Information
  id: string;
  booking_reference: string;
  created_at: string;
  updated_at: string;
  
  // Customer Details
  customer: CustomerProfile;
  
  // Booking Details
  tour_type: 'standard' | 'custom' | 'private';
  tour_id?: string;
  tour_name?: string;
  tours?: TourItem[]; // For custom packages
  itinerary?: string; // Full itinerary text
  date: string;
  total_guests: number;
  guest_breakdown?: {
    adults: number;
    children: number;
    infants?: number;
  };
  special_requirements?: string;
  dietary_restrictions?: string[];
  accessibility_needs?: string[];
  
  // Status & Workflow
  status: 'inquiry' | 'pending' | 'confirmed' | 'deposit_paid' | 'paid_full' | 'in_progress' | 'completed' | 'cancelled' | 'refunded';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  workflow_stage?: string;
  follow_up_date?: string;
  cancellation_reason?: string;
  
  // Financial
  financial: BookingFinancials;
  
  // Operations
  operations?: BookingOperations;
  
  // Communication
  communications?: CommunicationLog[];
  internal_notes?: string;
  last_contacted?: string;
  
  // Source & Marketing
  source?: 'website' | 'phone' | 'whatsapp' | 'email' | 'partner' | 'walk-in' | 'other';
  marketing_source?: string;
  partner_ref?: string;
  
  // Metadata
  ip_address?: string;
  user_agent?: string;
  tags?: string[];
}

export interface BookingFilter {
  search?: string;
  status?: string[];
  date_from?: string;
  date_to?: string;
  priority?: string[];
  assigned_to?: string;
  source?: string[];
  min_amount?: number;
  max_amount?: number;
  payment_status?: string[];
  tags?: string[];
}

export interface BookingStats {
  total_bookings: number;
  total_revenue: number;
  pending_bookings: number;
  today_bookings: number;
  this_week_bookings: number;
  this_month_bookings: number;
  average_booking_value: number;
  conversion_rate: number;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: 'confirmation' | 'reminder' | 'follow_up' | 'cancellation' | 'custom';
  language: string;
  variables: string[]; // e.g., {{customer_name}}, {{booking_reference}}
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  message: string;
  category: 'greeting' | 'confirmation' | 'reminder' | 'follow_up' | 'support';
  language: string;
  quick_replies?: string[];
}
