import os
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise Exception("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment variables.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

FIELDS = [
    "highlights",
    "unique_selling_points",
    "included",
    "excluded",
    "itinerary",
    "faqs",
]

def clean_field(val: str) -> str:
    if not val:
        return val
    return val.replace("&#124;", "|")

response = supabase.table("tours").select("id," + ",".join(FIELDS)).execute()
if hasattr(response, "data"):
    tours = response.data
else:
    print("Failed to fetch tours.")
    exit(1)

updated = 0
for tour in tours:
    update_data = {}
    for field in FIELDS:
        val = tour.get(field)
        if val and "&#124;" in val:
            update_data[field] = clean_field(val)
    if update_data:
        supabase.table("tours").update(update_data).eq("id", tour["id"]).execute()
        updated += 1

print(f"Updated {updated} tours to clean HTML entities from all relevant fields.")
