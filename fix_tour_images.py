import os
from supabase import create_client, Client

# Direct configuration (using your .env values)
SUPABASE_URL = "https://orogsbgpdvpzraujtekx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yb2dzYmdwZHZwenJhdWp0ZWt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MTU3NjcsImV4cCI6MjA3MDQ5MTc2N30.RHS6eIqS84ofiif6OujRrQ-NUxXdcObZsW40ES-gk0I"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# Map tour titles to actual existing image files
image_mapping = {
    "Aquila Big 5 Day Safari": "/images/aquila-safari-4k.webp",
    "Inverdoorn Exclusive Day Safari": "/images/inverdoorn-safari-4k.webp",
    "Hermanus Whale Watching Cruise": "/images/tour-whale.png",
    "Atlantis Dunes Sandboard & ATV": "/images/atlantis-dunes-atv-4k.webp",
    "Signal Hill Tandem Paragliding": "/images/signal-hill-paragliding-4k.webp",
    "Cape Town Tandem Skydive": "/images/cape-town-skydive-4k.webp",
    "Gansbaai Shark Cage Diving": "/images/gansbaai-shark-dive-4k.webp",
    "Winelands Sunrise Balloon Flight": "/images/winelands-balloon-flight-4k.webp",
    "Muizenberg Beach": "/images/muizenberg-beach-4k.webp",
    "Simon's Town": "/images/simons-town-4k.webp",
    "Boulders Beach Penguin Colony": "/images/boulders-beach-penguins-4k.webp",
    "Cape of Good Hope": "/images/cape-of-good-hope-4k.webp",
    "Cape Point Lighthouse": "/images/cape-point-lighthouse-4k.webp",
    "Chapman's Peak Drive": "/images/chapmans-peak-drive-4k.webp",
    "Hout Bay Harbour": "/images/hout-bay-harbour-4k.webp",
    "V&A Waterfront": "/images/va-waterfront-4k.webp",
    "Sea Point Promenade": "/images/sea-point-promenade-4k.webp",
    "Maiden's Cove": "/images/maidens-cove-4k.webp",
    "Camps Bay Beach": "/images/camps-bay-beach-4k.webp",
    "Table Mountain Cableway": "/images/table-mountain-cableway-4k.webp",
    "Bo-Kaap Heritage Quarter": "/images/bo-kaap-heritage-quarter-4k.webp",
    "Babylonstoren Wine Estate": "/images/babylonstoren-wine-estate-4k.webp",
    "Boschendal Wine Estate": "/images/boschendal-wine-estate-4k.webp",
    "Delaire Graff Estate": "/images/delaire-graff-estate-4k.webp",
    "Tokara Wine Estate": "/images/tokara-wine-estate.webp"
}

print("Fixing tour images with correct paths...")

# Fetch all tours
response = supabase.table("tours").select("id, title").execute()
tours = response.data

updated_count = 0
for tour in tours:
    # Get the correct image URL for this tour
    image_url = image_mapping.get(tour['title'])
    
    if image_url:
        # Update the tour with the correct image URL
        try:
            supabase.table("tours").update({"image_url": image_url}).eq("id", tour['id']).execute()
            print(f"✓ Fixed image for: {tour['title']} -> {image_url}")
            updated_count += 1
        except Exception as e:
            print(f"✗ Failed to update {tour['title']}: {str(e)}")
    else:
        print(f"⚠ No mapping for: {tour['title']}")

print(f"\n✅ Successfully fixed {updated_count}/{len(tours)} tour images!")
print("\nRefresh http://localhost:3000/tours to see the correct images")
