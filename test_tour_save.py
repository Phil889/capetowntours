import os
from supabase import create_client, Client
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv('.env.local')

# Initialize Supabase client
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(url, key)

# Test updating a tour with new fields
tour_id = "d312ffbf-33b8-4576-9d83-d31ddec4dc26"  # Tokara Wine Estate

# Minimal update to test
test_data = {
    "structured_highlights": ["Test highlight 1", "Test highlight 2"],
    "structured_faqs": [
        {"question": "Test question?", "answer": "Test answer", "order": 1}
    ]
}

print("Testing tour update...")
print(f"Tour ID: {tour_id}")
print(f"Test data: {json.dumps(test_data, indent=2)}")

try:
    result = supabase.table('tours').update(test_data).eq('id', tour_id).execute()
    print("\n✅ Update successful!")
    print(f"Updated fields: {list(test_data.keys())}")
except Exception as e:
    print(f"\n❌ Update failed: {str(e)}")
    
# Now try fetching to see what columns exist
try:
    print("\n" + "="*50)
    print("Fetching tour to see current data...")
    result = supabase.table('tours').select('*').eq('id', tour_id).limit(1).execute()
    if result.data:
        tour = result.data[0]
        print(f"\n✅ Tour fetched successfully")
        print(f"Tour has {len(tour.keys())} columns")
        
        # Check specific columns
        important_cols = ['cancellation_policy', 'structured_highlights', 'structured_faqs', 'structured_itinerary']
        for col in important_cols:
            if col in tour:
                value = tour[col]
                if value:
                    if isinstance(value, list):
                        print(f"  ✅ {col}: {len(value)} items")
                    else:
                        print(f"  ✅ {col}: exists (type: {type(value).__name__})")
                else:
                    print(f"  ⚠️ {col}: exists but empty")
            else:
                print(f"  ❌ {col}: missing")
except Exception as e:
    print(f"❌ Fetch failed: {str(e)}")
