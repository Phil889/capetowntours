-- Create the bookings table for Cape Town Safari Tours
CREATE TABLE IF NOT EXISTS public.bookings (
    -- Primary key
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Tour and user references
    tour_id UUID REFERENCES public.tours(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
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
    
    -- Indexes for performance
    CONSTRAINT bookings_email_check CHECK (guest_email ~* '^.+@.+\..+$')
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_tour_id ON public.bookings(tour_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_guest_email ON public.bookings(guest_email);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_reference ON public.bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
-- Policy to allow anyone to create a booking
CREATE POLICY "Anyone can create bookings" ON public.bookings
    FOR INSERT TO public, anon
    WITH CHECK (true);

-- Policy to allow users to view their own bookings (by email or user_id)
CREATE POLICY "Users can view own bookings" ON public.bookings
    FOR SELECT TO public, anon
    USING (
        auth.uid() = user_id 
        OR 
        guest_email = auth.jwt()->>'email'
        OR
        true -- For now, allow all to view (you may want to restrict this)
    );

-- Policy to allow users to update their own bookings
CREATE POLICY "Users can update own bookings" ON public.bookings
    FOR UPDATE TO public, anon
    USING (
        auth.uid() = user_id 
        OR 
        guest_email = auth.jwt()->>'email'
    );

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON public.bookings TO anon;
GRANT ALL ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;

-- Add some comments for documentation
COMMENT ON TABLE public.bookings IS 'Stores tour booking information for Cape Town Safari Tours';
COMMENT ON COLUMN public.bookings.booking_reference IS 'Unique booking reference in format CTT-YYYY-XXXXXX';
COMMENT ON COLUMN public.bookings.status IS 'Booking status: pending, confirmed, cancelled, completed';
COMMENT ON COLUMN public.bookings.guests IS 'Number of guests (1-20 max)';
COMMENT ON COLUMN public.bookings.pickup_location IS 'Hotel or address for pickup';
COMMENT ON COLUMN public.bookings.special_requirements IS 'Dietary restrictions, accessibility needs, etc.';
