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

# Original excludes for Tokara Wine Estate
original_excludes = [
    {
        "category": "other",
        "item": "Lunch at restaurant",
        "description": ""
    },
    {
        "category": "other", 
        "item": "Gratuities",
        "description": ""
    }
]

# Legacy format for backward compatibility
legacy_excludes = "Lunch at restaurant, gratuities"

print(f"🔧 Restoring original excludes for Tokara Wine Estate tour...")
print(f"Tour ID: {tour_id}")
print(f"Number of excluded items to restore: {len(original_excludes)}")

try:
    # Update both structured and legacy excludes fields
    result = supabase.table('tours').update({
        'structured_excludes': original_excludes,
        'excluded': legacy_excludes
    }).eq('id', tour_id).execute()
    
    print(f"\n✅ Successfully restored {len(original_excludes)} excluded items for Tokara Wine Estate!")
    print("\nRestored excluded items:")
    for i, exclude in enumerate(original_excludes, 1):
        print(f"  {i}. {exclude['item']}")
        
except Exception as e:
    print(f"\n❌ Failed to restore excludes: {str(e)}")

print("\n" + "="*50)
print("Checking if includes also need restoration...")

try:
    # Get current includes
    tour = supabase.table('tours').select('structured_includes, included').eq('id', tour_id).single().execute()
    
    if tour.data:
        includes = tour.data.get('structured_includes', [])
        if not includes or (isinstance(includes, list) and len(includes) == 0):
            print("\n⚠️ Includes also appear to be missing. Restoring includes...")
            
            original_includes = [
                {
                    "category": "other",
                    "item": "Transport",
                    "description": ""
                },
                {
                    "category": "other",
                    "item": "Cellar & press tour",
                    "description": ""
                },
                {
                    "category": "other",
                    "item": "Tasting",
                    "description": ""
                },
                {
                    "category": "other",
                    "item": "Gift bottle",
                    "description": ""
                },
                {
                    "category": "other",
                    "item": "Guide",
                    "description": ""
                }
            ]
            
            legacy_includes = "Transport, cellar & press tour, tasting, gift bottle, guide"
            
            result = supabase.table('tours').update({
                'structured_includes': original_includes,
                'included': legacy_includes
            }).eq('id', tour_id).execute()
            
            print(f"✅ Also restored {len(original_includes)} included items!")
            for i, include in enumerate(original_includes, 1):
                print(f"  {i}. {include['item']}")
        else:
            print("\n✅ Includes are already present")
            
except Exception as e:
    print(f"\n❌ Failed to check/restore includes: {str(e)}")
