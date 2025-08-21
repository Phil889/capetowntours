import os
from supabase import create_client, Client

# Direct configuration (using your .env values)
SUPABASE_URL = "https://orogsbgpdvpzraujtekx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yb2dzYmdwZHZwenJhdWp0ZWt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MTU3NjcsImV4cCI6MjA3MDQ5MTc2N30.RHS6eIqS84ofiif6OujRrQ-NUxXdcObZsW40ES-gk0I"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# Map tour slugs to image URLs
image_mapping = {
    "aquila-safari-tour": "/safari-elephants-river.png",
    "inverdoorn-safari-tour": "/safari-giraffe-sunset.webp",
    "hermanus-whale-watching-tour": "/images/tour-whale.png",
    "atlantis-dunes-sandboard-and-atv": "/images/tour-atv.png",
    "signal-hill-tandem-paragliding": "/images/tour-paragliding.png",
    "cape-town-tandem-skydive": "/images/tour-skydive.png",
    "gansbaai-shark-cage-diving": "/shark-cage-diving.png",
    "winelands-sunrise-balloon-flight": "/images/tour-balloon.png",
    "muizenberg-beach": "/images/tour-beach.png",
    "simon's-town": "/images/tour-simons-town.png",
    "boulders-beach-penguin-colony": "/boulders-beach-penguins.png",
    "cape-of-good-hope": "/cape-town-hero.png",
    "cape-point-lighthouse": "/images/tour-lighthouse.png",
    "chapman's-peak-drive": "/images/tour-chapmans.png",
    "hout-bay-harbour": "/images/tour-hout-bay.png",
    "vanda-waterfront": "/images/tour-waterfront.png",
    "sea-point-promenade": "/images/tour-promenade.png",
    "maiden's-cove": "/images/tour-maidens-cove.png",
    "camps-bay-beach": "/images/tour-camps-bay.png",
    "table-mountain-cableway": "/table-mountain-view.png",
    "bo-kaap-heritage-quarter": "/images/tour-bo-kaap.png",
    "babylonstoren-wine-estate": "/images/tour-wine.png",
    "boschendal-wine-estate": "/images/tour-wine-estate.png",
    "delaire-graff-estate": "/images/tour-delaire.png",
    "tokara-wine-estate": "/images/tour-tokara.png"
}

# Default images by category
category_defaults = {
    "safari": "/safari-giraffe-sunset.webp",
    "marine": "/shark-cage-diving.png",
    "mountain": "/table-mountain-view.png",
    "cultural": "/cape-town-hero.png",
    "winelands": "/images/tour-wine.png",
    "vineyard": "/images/tour-wine.png"
}

print("Updating tour images...")

# Fetch all tours
response = supabase.table("tours").select("id, slug, category, title").execute()
tours = response.data

updated_count = 0
for tour in tours:
    # Get image URL from mapping or use category default
    image_url = image_mapping.get(tour['slug'])
    
    if not image_url:
        # Use category default
        category = tour.get('category', 'safari')
        image_url = category_defaults.get(category, "/safari-elephants-river.png")
    
    # Update the tour with the image URL
    try:
        supabase.table("tours").update({"image_url": image_url}).eq("id", tour['id']).execute()
        print(f"✓ Updated image for: {tour['title']} -> {image_url}")
        updated_count += 1
    except Exception as e:
        print(f"✗ Failed to update {tour['title']}: {str(e)}")

print(f"\n✅ Successfully updated {updated_count}/{len(tours)} tour images!")
print("\nRefresh http://localhost:3000/tours to see the images")
