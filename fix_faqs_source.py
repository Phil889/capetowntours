import os
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise Exception("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment variables.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

def clean_faqs(faqs: str) -> str:
    if not faqs:
        return faqs
    return faqs.replace("&#124;", "|")

# Fetch all tours with faqs
response = supabase.table("tours").select("id, faqs").execute()
if hasattr(response, "data"):
    tours = response.data
else:
    print("Failed to fetch tours.")
    exit(1)

updated = 0
for tour in tours:
    faqs = tour.get("faqs")
    if faqs and "&#124;" in faqs:
        cleaned = clean_faqs(faqs)
        supabase.table("tours").update({"faqs": cleaned}).eq("id", tour["id"]).execute()
        updated += 1

print(f"Updated {updated} tours' faqs fields to remove HTML entities.")
