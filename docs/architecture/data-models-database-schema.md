# Data Models & Database Schema

The "Pragmatic MVP" schema is our definitive data foundation. It focuses on the core entities required for launch while being extensible for the future.

```sql
-- Enable the UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: tours
CREATE TABLE tours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    name TEXT NOT NULL,
    description TEXT,
    itinerary TEXT,
    duration_days INT NOT NULL CHECK (duration_days > 0),
    category TEXT NOT NULL CHECK (category IN ('safari', 'marine', 'mountain', 'cultural')),
    is_active BOOLEAN NOT NULL DEFAULT false
);

-- Table: tour_images
CREATE TABLE tour_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    sort_order INT NOT NULL DEFAULT 0
);

-- Table: scheduled_tours
CREATE TABLE scheduled_tours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
    tour_date DATE NOT NULL,
    price_per_person_cents INT NOT NULL CHECK (price_per_person_cents >= 0),
    total_slots INT NOT NULL CHECK (total_slots >= 0),
    booked_slots INT NOT NULL DEFAULT 0 CHECK (booked_slots >= 0),
    UNIQUE(tour_id, tour_date)
);

-- Table: bookings
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    scheduled_tour_id UUID NOT NULL REFERENCES scheduled_tours(id),
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    group_size INT NOT NULL CHECK (group_size > 0),
    total_price_cents INT NOT NULL CHECK (total_price_cents >= 0),
    payment_id TEXT NOT NULL UNIQUE
);
```
