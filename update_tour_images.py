import os
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise Exception("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment variables.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# Update Signal Hill Tandem Paragliding
paragliding = supabase.table("tours").select("id").eq("url_slug", "cape-town-paragliding").execute()
if hasattr(paragliding, "data") and paragliding.data:
    supabase.table("tours").update({"image_url": "images/signal-hill-paragliding-4k.webp"}).eq("id", paragliding.data[0]["id"]).execute()
    print("Updated Signal Hill Tandem Paragliding image.")

# Update Delaire Graff Estate
delaire = supabase.table("tours").select("id").eq("url_slug", "delaire-graff-estate").execute()
if hasattr(delaire, "data") and delaire.data:
    supabase.table("tours").update({"image_url": "images/delaire-graff-estate-4k.webp"}).eq("id", delaire.data[0]["id"]).execute()
    print("Updated Delaire Graff Estate image.")
