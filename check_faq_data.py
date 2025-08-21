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

print("Checking FAQ data in tours table...")
print("-" * 50)

# Get a few tours to check their FAQ structure
result = supabase.table('tours').select('id,title,faqs,structured_faqs').limit(3).execute()

for tour in result.data:
    print(f"\nTour: {tour['title']}")
    print(f"  ID: {tour['id']}")
    
    # Check regular FAQs field
    if tour.get('faqs'):
        print(f"  FAQs field: {type(tour['faqs'])}")
        if isinstance(tour['faqs'], str):
            try:
                faqs_data = json.loads(tour['faqs'])
                print(f"    - Parsed as JSON: {len(faqs_data)} items")
                if faqs_data and len(faqs_data) > 0:
                    print(f"    - First FAQ: {faqs_data[0]}")
            except:
                print(f"    - Raw string: {tour['faqs'][:100]}...")
    else:
        print(f"  FAQs field: None/Empty")
    
    # Check structured FAQs field
    if tour.get('structured_faqs'):
        print(f"  Structured FAQs: {type(tour['structured_faqs'])}")
        if isinstance(tour['structured_faqs'], list):
            print(f"    - {len(tour['structured_faqs'])} items")
            if tour['structured_faqs'] and len(tour['structured_faqs']) > 0:
                print(f"    - First FAQ: {tour['structured_faqs'][0]}")
    else:
        print(f"  Structured FAQs: None/Empty")

print("\n" + "=" * 50)
print("FAQ Data Check Complete!")
