import os
import json
from supabase import create_client, Client
from datetime import datetime

# Get Supabase credentials from environment
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL', '')
SUPABASE_KEY = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '')

def get_supabase_client() -> Client:
    """Initialize Supabase client"""
    if not SUPABASE_URL or not SUPABASE_KEY:
        # Try reading from .env.local
        env_path = '.env.local'
        if os.path.exists(env_path):
            with open(env_path, 'r') as f:
                for line in f:
                    if line.startswith('NEXT_PUBLIC_SUPABASE_URL='):
                        url = line.split('=', 1)[1].strip()
                        if url:
                            globals()['SUPABASE_URL'] = url
                    elif line.startswith('NEXT_PUBLIC_SUPABASE_ANON_KEY='):
                        key = line.split('=', 1)[1].strip()
                        if key:
                            globals()['SUPABASE_KEY'] = key
    
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Supabase credentials not found")
    
    return create_client(SUPABASE_URL, SUPABASE_KEY)

def fetch_all_tours():
    """Fetch all tours from Supabase"""
    try:
        supabase = get_supabase_client()
        response = supabase.table('tours').select('id', 'slug', 'title', 'description', 'category', 'faqs').execute()
        
        tours = []
        for tour in response.data:
            tours.append({
                'id': tour['id'],
                'slug': tour['slug'],
                'title': tour.get('title', ''),
                'description': tour.get('description', ''),
                'category': tour.get('category', ''),
                'existing_faqs': tour.get('faqs', '')
            })
        
        print(f"✅ Fetched {len(tours)} tours from Supabase")
        return tours
    except Exception as e:
        print(f"❌ Error fetching tours: {e}")
        return []

def save_tours_data(tours):
    """Save tours data to JSON file for processing"""
    output_file = 'tours_for_faq_research.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(tours, f, indent=2, ensure_ascii=False)
    print(f"✅ Saved tours data to {output_file}")
    return output_file

if __name__ == "__main__":
    print("=" * 60)
    print("FAQ Questions Gathering - Step 1: Fetch Tours")
    print("=" * 60)
    
    # Fetch tours from Supabase
    tours = fetch_all_tours()
    
    if tours:
        # Save to JSON for next step
        output_file = save_tours_data(tours)
        
        print("\n📊 Tour Summary:")
        print(f"Total tours: {len(tours)}")
        
        # Count tours by category
        categories = {}
        for tour in tours:
            cat = tour.get('category', 'Uncategorized')
            categories[cat] = categories.get(cat, 0) + 1
        
        print("\nTours by category:")
        for cat, count in categories.items():
            print(f"  - {cat}: {count}")
        
        print("\n📝 Sample tours to research:")
        for tour in tours[:5]:
            print(f"  - {tour['title']} (slug: {tour['slug']})")
        
        print(f"\n✅ Ready to proceed with Google research!")
        print(f"📁 Tours data saved to: {output_file}")
    else:
        print("❌ No tours found or error occurred")
