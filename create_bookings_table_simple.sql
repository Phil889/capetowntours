-- Simplified version without foreign key constraints
-- Use this if you haven't created the tours table yet

-- Create the bookings table for Cape Town Safari Tours
CREATE TABLE IF NOT EXISTS public.bookings (
    -- Primary key
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Tour and user references (no foreign keys)
    tour_id UUID,
    user_id UUID,
    
    -- Booking details
    booking_reference VARCHAR(20) UNIQUE,
    date DATE NOT NULL,
    guests INTEGER NOT NULL CHECK (guests > 0 AND guests <= 20),
    status VARCHAR(50) DEFAULT 'confirmed',
    
    -- Guest information
    guest_email VARCHAR(255) NOT NULL,
    guest_name VARCHAR(255),
    guest_phone VARCHAR(50),
    pickup_location TEXT,
    special_requirements TEXT,
    
    -- Pricing (optional, for future use)
    total_amount DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'ZAR',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Email validation
    CONSTRAINT bookings_email_check CHECK (guest_email ~* '^.+@.+\..+$')
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_tour_id ON public.bookings(tour_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_guest_email ON public.bookings(guest_email);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_reference ON public.bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);

-- Enable Row Level Security (RLS) - but set permissive for testing
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow all operations for testing (make more restrictive in production)
CREATE POLICY "Allow all operations" ON public.bookings
    FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON public.bookings TO anon;
GRANT ALL ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;

-- Add some test data (optional - uncomment to use)
/*
INSERT INTO public.bookings (
    tour_id, 
    booking_reference, 
    date, 
    guests, 
    status, 
    guest_email, 
    guest_name, 
    guest_phone, 
    pickup_location
) VALUES (
    gen_random_uuid(), -- Random tour ID for testing
    'CTT-2025-TEST01',
    CURRENT_DATE + INTERVAL '7 days',
    2,
    'confirmed',
    'test@example.com',
    'Test User',
    '+27123456789',
    'Test Hotel, Cape Town'
);
*/
