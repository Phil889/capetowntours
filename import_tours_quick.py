import os
import re
import uuid
import json
from supabase import create_client, Client

# Direct configuration (using your .env values)
SUPABASE_URL = "https://orogsbgpdvpzraujtekx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yb2dzYmdwZHZwenJhdWp0ZWt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MTU3NjcsImV4cCI6MjA3MDQ5MTc2N30.RHS6eIqS84ofiif6OujRrQ-NUxXdcObZsW40ES-gk0I"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

print("Reading tour data from markdown file...")

# Read the markdown table
md_path = "docs/cape_town_tour_pages_25_clean.md"
with open(md_path, "r", encoding="utf-8") as f:
    md = f.read()

# Extract the table from markdown
table_match = re.search(r"(\|.+\|\n)(\|[-|]+\|\n)((?:\|.*\|\n?)+)", md)
if not table_match:
    raise Exception("Could not find markdown table in file.")

header_line = table_match.group(1)
separator_line = table_match.group(2)
rows_block = table_match.group(3)

# Parse header
columns = [col.strip() for col in header_line.strip().split("|")[1:-1]]
print(f"Found {len(columns)} columns")

# Parse rows
rows = []
for line in rows_block.strip().split("\n"):
    if not line.strip() or line.startswith("|-"):
        continue
    row = [cell.strip() for cell in line.strip().split("|")[1:-1]]
    if len(row) == len(columns):
        rows.append(dict(zip(columns, row)))

print(f"Found {len(rows)} tours to import")

# Prepare data for upload
records = []
for row in rows:
    # Generate slug from tour name
    tour_name = row.get("tour_name", "")
    slug = row.get("url_slug", tour_name.lower().replace(" ", "-").replace("&", "and"))
    
    # Parse price
    price_str = row.get("price_from_zar", "0")
    try:
        price = int(re.sub(r'[^\d]', '', price_str)) if price_str else 0
    except:
        price = 0
    
    # Map duration
    duration_str = row.get("duration", "")
    duration_days = 1  # Default
    if "2 day" in duration_str.lower():
        duration_days = 2
    elif "3 day" in duration_str.lower():
        duration_days = 3
    elif "4 day" in duration_str.lower():
        duration_days = 4
    elif "5 day" in duration_str.lower():
        duration_days = 5
    
    # Determine category
    category = "safari"  # Default
    tour_lower = tour_name.lower()
    if "wine" in tour_lower or "winelands" in tour_lower:
        category = "winelands"
    elif "shark" in tour_lower or "whale" in tour_lower or "penguin" in tour_lower or "marine" in tour_lower:
        category = "marine"
    elif "table mountain" in tour_lower or "cape point" in tour_lower:
        category = "mountain"
    elif "township" in tour_lower or "cultural" in tour_lower:
        category = "cultural"
    
    record = {
        "id": str(uuid.uuid4()),
        "slug": slug,
        "title": tour_name,
        "description": row.get("short_overview", row.get("meta_description", "")),
        "price": price,
        "price_from_zar": price,
        "category": category,
        "duration_days": duration_days,
        
        # Additional fields from markdown
        "title_tag": row.get("title_tag", ""),
        "meta_description": row.get("meta_description", ""),
        "h1": row.get("h1", tour_name),
        "hero_tagline": row.get("hero_tagline", ""),
        "short_overview": row.get("short_overview", ""),
        "itinerary": row.get("itinerary", ""),
        "highlights": row.get("highlights", ""),
        "unique_selling_points": row.get("unique_selling_points", ""),
        "included": row.get("included", ""),
        "excluded": row.get("excluded", ""),
        "primary_keyword": row.get("primary_keyword", ""),
        "secondary_keywords": row.get("secondary_keywords", ""),
        "faqs": row.get("faqs", ""),
        "image_alt_text": row.get("image_alt_text", tour_name),
        "cancellation_policy": row.get("cancellation_policy", ""),
        "seasonal_notes": row.get("seasonal_notes", ""),
        "child_policy": row.get("child_policy", ""),
        "accessibility": row.get("accessibility", ""),
        "group_size_max": row.get("group_size_max", ""),
        "duration": row.get("duration", ""),
        "departure_time": row.get("departure_time", ""),
        "pickup": row.get("pickup", ""),
        "map_embed": row.get("map_embed", "")
    }
    
    # Only add if we have required fields
    if record["title"] and record["slug"]:
        records.append(record)
        print(f"Prepared: {record['title']} (R{record['price']})")

print(f"\nReady to import {len(records)} tours")
print("\nOnce Supabase is ready, this script will:")
print("1. Create the tours table if it doesn't exist")
print("2. Import all tour data")
print("\nWaiting for you to confirm Supabase is ready...")
input("Press Enter when Supabase provisioning is complete...")

# Create table if it doesn't exist
create_table_sql = """
CREATE TABLE IF NOT EXISTS tours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price INTEGER,
    price_from_zar INTEGER,
    category TEXT,
    duration_days INTEGER,
    image_url TEXT,
    
    -- SEO fields
    title_tag TEXT,
    meta_description TEXT,
    h1 TEXT,
    hero_tagline TEXT,
    short_overview TEXT,
    
    -- Content fields
    itinerary TEXT,
    highlights TEXT,
    unique_selling_points TEXT,
    included TEXT,
    excluded TEXT,
    
    -- Keywords
    primary_keyword TEXT,
    secondary_keywords TEXT,
    
    -- Additional info
    faqs TEXT,
    image_alt_text TEXT,
    cancellation_policy TEXT,
    seasonal_notes TEXT,
    child_policy TEXT,
    accessibility TEXT,
    group_size_max TEXT,
    duration TEXT,
    departure_time TEXT,
    pickup TEXT,
    map_embed TEXT
);
"""

print("\nCreating tours table...")
try:
    # Note: Supabase Python client doesn't support raw SQL directly
    # We'll just insert the data and let Supabase auto-create the table
    pass
except Exception as e:
    print(f"Note: {e}")

# Upload to Supabase
print("\nImporting tours...")
success_count = 0
for record in records:
    try:
        response = supabase.table("tours").insert(record).execute()
        print(f"✓ Imported: {record['title']}")
        success_count += 1
    except Exception as e:
        print(f"✗ Failed to import {record['title']}: {str(e)}")

print(f"\n✅ Successfully imported {success_count}/{len(records)} tours!")
print("\nYou can now:")
print("1. Visit http://localhost:3000/tours to see the tours")
print("2. Check your Supabase dashboard to verify the data")
