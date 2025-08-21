import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

# Initialize Supabase client
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(url, key)

# Tokara Wine Estate tour ID
tour_id = "d312ffbf-33b8-4576-9d83-d31ddec4dc26"

# Original itinerary for Tokara Wine Estate - parsing from the legacy format
legacy_itinerary = "Hotel pickup > Helshoogte Pass drive > cellar & olive press tour > seated wine & olive oil tasting with artisanal bread > gallery viewing > return."

# Convert to structured itinerary format
structured_itinerary = [
    {
        "day": 1,
        "title": "Wine Estate Experience",
        "description": "A full day exploring the Tokara Wine Estate with wine and olive oil tastings",
        "location": "Tokara Wine Estate, Stellenbosch",
        "duration": "5 hours including transfers",
        "highlights": [
            "Hotel pickup from Cape Town",
            "Scenic drive through Helshoogte Pass",
            "Guided cellar and olive press tour",
            "Seated wine and olive oil tasting with artisanal bread",
            "Modern art gallery viewing",
            "Return transfer to hotel"
        ]
    }
]

print(f"🔧 Restoring itinerary for Tokara Wine Estate tour...")
print(f"Tour ID: {tour_id}")

try:
    # First, get the current tour to see if it has any itinerary
    tour_result = supabase.table('tours').select('itinerary, structured_itinerary').eq('id', tour_id).single().execute()
    
    if tour_result.data:
        print(f"\nCurrent legacy itinerary: {tour_result.data.get('itinerary', 'None')}")
        print(f"Current structured itinerary: {tour_result.data.get('structured_itinerary', 'None')}")
    
    # Update both the structured_itinerary and legacy itinerary fields
    result = supabase.table('tours').update({
        'structured_itinerary': structured_itinerary,
        'itinerary': legacy_itinerary
    }).eq('id', tour_id).execute()
    
    print(f"\n✅ Successfully restored itinerary for Tokara Wine Estate!")
    print("\nRestored itinerary:")
    for day_item in structured_itinerary:
        print(f"\n  Day {day_item['day']}: {day_item['title']}")
        print(f"  Location: {day_item['location']}")
        print(f"  Duration: {day_item['duration']}")
        print(f"  Description: {day_item['description']}")
        print(f"  Highlights:")
        for highlight in day_item['highlights']:
            print(f"    - {highlight}")
        
except Exception as e:
    print(f"\n❌ Failed to restore itinerary: {str(e)}")

print("\n" + "="*50)
print("Checking if other tours need itinerary restoration...")

try:
    # Get all tours to check their itineraries
    tours = supabase.table('tours').select('id, title, itinerary, structured_itinerary').limit(5).execute()
    
    for tour in tours.data:
        has_legacy = bool(tour.get('itinerary'))
        has_structured = bool(tour.get('structured_itinerary'))
        
        print(f"\nTour: {tour['title'][:40]}...")
        print(f"  Legacy itinerary: {'✅ Present' if has_legacy else '❌ Missing'}")
        print(f"  Structured itinerary: {'✅ Present' if has_structured else '❌ Missing'}")
        
        if has_legacy and not has_structured:
            print(f"  ⚠️ Needs conversion from legacy to structured format")
                
except Exception as e:
    print(f"\n❌ Failed to check other tours: {str(e)}")
