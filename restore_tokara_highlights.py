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

# Original highlights for Tokara Wine Estate
original_highlights = [
    "Comparative wine & olive oil tasting",
    "Modern art gallery access",
    "Elevated terrace viewpoint"
]

print(f"🔧 Restoring original highlights for Tokara Wine Estate tour...")
print(f"Tour ID: {tour_id}")
print(f"Number of highlights to restore: {len(original_highlights)}")

try:
    # Update the structured_highlights field with the original highlights
    result = supabase.table('tours').update({
        'structured_highlights': original_highlights,
        # Also update the legacy highlights field for backward compatibility
        'highlights': ' | '.join(original_highlights)
    }).eq('id', tour_id).execute()
    
    print(f"\n✅ Successfully restored {len(original_highlights)} highlights for Tokara Wine Estate!")
    print("\nRestored highlights:")
    for i, highlight in enumerate(original_highlights, 1):
        print(f"  {i}. {highlight}")
        
except Exception as e:
    print(f"\n❌ Failed to restore highlights: {str(e)}")

# Also restore highlights for other tours that might have been affected
print("\n" + "="*50)
print("Checking other tours for test data...")

try:
    # Get all tours with test highlights
    tours = supabase.table('tours').select('id, title, structured_highlights').execute()
    
    for tour in tours.data:
        if tour.get('structured_highlights'):
            highlights = tour['structured_highlights']
            if isinstance(highlights, list) and any('Test highlight' in str(h) for h in highlights):
                print(f"\n⚠️ Found test data in tour: {tour['title']} (ID: {tour['id']})")
                print("  Current highlights:", highlights)
                print("  Please update this tour manually through the admin panel")
                
except Exception as e:
    print(f"\n❌ Failed to check other tours: {str(e)}")
