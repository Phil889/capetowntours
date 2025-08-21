import os
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise Exception("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment variables.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# Print faqs for all tours
response = supabase.table("tours").select("id, title, url_slug, faqs").execute()
if hasattr(response, "data"):
    tours = response.data
else:
    print("Failed to fetch tours.")
    exit(1)

for tour in tours:
    print(f"Title: {tour.get('title')}\nSlug: {tour.get('url_slug')}\nFAQs: {tour.get('faqs')}\n{'-'*40}")
