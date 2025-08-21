import os
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise Exception("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment variables.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# Fetch all tours
response = supabase.table("tours").select("*").execute()
if hasattr(response, "data"):
    tours = response.data
else:
    print("Failed to fetch tours.")
    exit(1)

deleted = []
for tour in tours:
    title = (tour.get("title") or "").strip().lower()
    tour_name = (tour.get("tour_name") or "").strip().lower()
    description = (tour.get("description") or "").strip().lower()
    # Delete if "test" in title/tour_name/description, or exact match for "test tour" or "a test tour"
    if (
        "test" in title
        or "test" in tour_name
        or "test" in description
        or title == "test tour"
        or tour_name == "test tour"
        or description == "a test tour"
    ):
        supabase.table("tours").delete().eq("id", tour["id"]).execute()
        deleted.append(tour["title"] or tour["id"])

if deleted:
    print("Deleted test tours/safaris:")
    for t in deleted:
        print("-", t)
else:
    print("No test tours/safaris found.")
