import os
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise Exception("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment variables.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

response = supabase.table("tours").select("id, title, url_slug, tour_name").execute()
if hasattr(response, "data"):
    tours = response.data
else:
    print("Failed to fetch tours.")
    exit(1)

for tour in tours:
    print(f"ID: {tour.get('id')}\nTitle: {tour.get('title')}\nSlug: {tour.get('url_slug')}\nTour Name: {tour.get('tour_name')}\n")
