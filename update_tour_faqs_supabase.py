import json
import os
from supabase import create_client, Client
from datetime import datetime

def get_supabase_client() -> Client:
    """Initialize Supabase client"""
    SUPABASE_URL = ''
    SUPABASE_KEY = ''
    
    # Try reading from .env.local
    env_path = '.env.local'
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                if line.startswith('NEXT_PUBLIC_SUPABASE_URL='):
                    SUPABASE_URL = line.split('=', 1)[1].strip()
                elif line.startswith('NEXT_PUBLIC_SUPABASE_ANON_KEY='):
                    SUPABASE_KEY = line.split('=', 1)[1].strip()
    
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Supabase credentials not found")
    
    return create_client(SUPABASE_URL, SUPABASE_KEY)

def load_tour_faqs():
    """Load generated FAQs from JSON file"""
    with open('tour_specific_faqs.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def update_tour_faqs_in_database():
    """Update each tour with its new FAQs"""
    try:
        # Get Supabase client
        supabase = get_supabase_client()
        
        # Load FAQs
        tour_faqs = load_tour_faqs()
        
        print("=" * 60)
        print("Updating Supabase Tours with SEO-Optimized FAQs")
        print("=" * 60)
        
        success_count = 0
        error_count = 0
        
        for i, tour_faq in enumerate(tour_faqs, 1):
            tour_id = tour_faq['tour_id']
            tour_title = tour_faq['tour_title']
            faqs_formatted = tour_faq['faqs_formatted']
            faq_count = tour_faq['faq_count']
            
            print(f"\n[{i}/{len(tour_faqs)}] Updating: {tour_title}")
            print(f"  📝 FAQ Count: {faq_count}")
            
            try:
                # Update the tour with new FAQs
                response = supabase.table('tours').update({
                    'faqs': faqs_formatted,
                    'updated_at': datetime.now().isoformat()
                }).eq('id', tour_id).execute()
                
                if response.data:
                    print(f"  ✅ Successfully updated FAQs")
                    success_count += 1
                else:
                    print(f"  ⚠️ No data returned for update")
                    error_count += 1
                    
            except Exception as e:
                print(f"  ❌ Error updating tour: {e}")
                error_count += 1
        
        print("\n" + "=" * 60)
        print("Update Summary")
        print("=" * 60)
        print(f"✅ Successfully updated: {success_count} tours")
        if error_count > 0:
            print(f"❌ Failed updates: {error_count} tours")
        print(f"📊 Total FAQs added: {sum(t['faq_count'] for t in tour_faqs)}")
        print("\n🎉 FAQs have been updated in Supabase!")
        print("🔍 These SEO-optimized FAQs will help improve:")
        print("   • Featured snippet appearances")
        print("   • People Also Ask rankings")
        print("   • Long-tail keyword coverage")
        print("   • User engagement metrics")
        
        return success_count, error_count
        
    except Exception as e:
        print(f"❌ Critical error: {e}")
        return 0, len(tour_faqs)

def generate_update_report():
    """Generate a report of the FAQ update"""
    tour_faqs = load_tour_faqs()
    
    report = []
    report.append("=" * 60)
    report.append("FAQ Update Report - " + datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    report.append("=" * 60)
    
    for tour in tour_faqs:
        report.append(f"\n{tour['tour_title']} ({tour['tour_slug']})")
        report.append(f"  Category: {tour['category']}")
        report.append(f"  FAQ Count: {tour['faq_count']}")
        report.append("  Sample Questions:")
        for faq in tour['faqs_list'][:3]:  # Show first 3 questions
            report.append(f"    • {faq['question']}")
    
    report_text = "\n".join(report)
    
    # Save report
    with open('faq_update_report.txt', 'w', encoding='utf-8') as f:
        f.write(report_text)
    
    print("\n📄 Report saved to: faq_update_report.txt")
    
    return report_text

if __name__ == "__main__":
    # Update FAQs in database
    success, errors = update_tour_faqs_in_database()
    
    # Generate report
    if success > 0:
        print("\nGenerating update report...")
        generate_update_report()
        
        print("\n" + "=" * 60)
        print("Next Steps for Maximum SEO Impact:")
        print("=" * 60)
        print("1. ✅ FAQs updated in Supabase")
        print("2. 🔄 Add schema.org FAQ structured data to tour pages")
        print("3. 📊 Monitor Google Search Console for featured snippets")
        print("4. 🎯 Track rankings for long-tail keywords")
        print("5. 📈 Measure organic traffic improvements")
