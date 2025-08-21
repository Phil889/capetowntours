import os
import re
import uuid
import pandas as pd
from supabase import create_client, Client

# Load environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise Exception("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment variables.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# Read the markdown table
md_path = "docs/cape_town_tour_pages_25_clean.md"
with open(md_path, "r", encoding="utf-8") as f:
    md = f.read()

# Extract the table from markdown
table_match = re.search(r"(\|.+\|\n)(\|[-|]+\|\n)((?:\|.*\|\n?)+)", md)
if not table_match:
    raise Exception("Could not find markdown table in file.")

header_line = table_match.group(1)
separator_line = table_match.group(2)
rows_block = table_match.group(3)

# Parse header
columns = [col.strip() for col in header_line.strip().split("|")[1:-1]]

# Parse rows
rows = []
for line in rows_block.strip().split("\n"):
    if not line.strip() or line.startswith("|-"):
        continue
    row = [cell.strip() for cell in line.strip().split("|")[1:-1]]
    if len(row) == len(columns):
        rows.append(row)

df = pd.DataFrame(rows, columns=columns)

# Map columns to DB fields
db_field_map = {
    "tour_name": "tour_name",
    "url_slug": "url_slug",
    "title_tag": "title_tag",
    "meta_description": "meta_description",
    "h1": "h1",
    "hero_tagline": "hero_tagline",
    "short_overview": "short_overview",
    "itinerary": "itinerary",
    "highlights": "highlights",
    "unique_selling_points": "unique_selling_points",
    "included": "included",
    "excluded": "excluded",
    "price_from_zar": "price_from_zar",
    "primary_keyword": "primary_keyword",
    "secondary_keywords": "secondary_keywords",
    "lsi_keywords": "lsi_keywords",
    "faqs": "faqs",
    "schema_jsonld": "schema_jsonld",
    "image_alt_text": "image_alt_text",
    "video_idea": "video_idea",
    "cta_primary": "cta_primary",
    "cta_secondary": "cta_secondary",
    "review_snippet": "review_snippet",
    "cancellation_policy": "cancellation_policy",
    "seasonal_notes": "seasonal_notes",
    "child_policy": "child_policy",
    "accessibility": "accessibility",
    "group_size_max": "group_size_max",
    "duration": "duration",
    "departure_time": "departure_time",
    "pickup": "pickup",
    "map_embed": "map_embed"
}

# Prepare data for upload
records = []
for _, row in df.iterrows():
    record = {}
    # Required fields
    record["id"] = str(uuid.uuid4())
    record["title"] = row.get("tour_name", "")  # Map tour_name to title
    record["description"] = row.get("meta_description", "")  # Map meta_description to description
    price_str = row.get("price_from_zar", "")
    try:
        record["price"] = int(price_str) if price_str else 0
    except Exception:
        record["price"] = 0
    # Optional fields
    for md_col, db_col in db_field_map.items():
        if db_col not in record:
            record[db_col] = row.get(md_col, None)
    # Only upload if required fields are present
    if record["title"] and record["description"] and record["price"]:
        records.append(record)

# Upload to Supabase
for record in records:
    response = supabase.table("tours").insert(record).execute()
    if hasattr(response, "status_code") and response.status_code >= 400:
        print(f"Failed to insert: {record['title']} - {getattr(response, 'error', None)}")
    else:
        print(f"Inserted: {record['title']}")

print(f"Imported {len(records)} tours.")
