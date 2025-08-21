import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

# Initialize Supabase client
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(url, key)

# Tokara Wine Estate tour ID
tour_id = "d312ffbf-33b8-4576-9d83-d31ddec4dc26"

# Original FAQs for Tokara Wine Estate
original_faqs = [
    {
        "question": "How long is the Tokara Wine Estate experience?",
        "answer": "The Tokara Wine Estate is typically a full-day experience lasting 8-10 hours including transport from Cape Town. Half-day options may be available lasting 4-5 hours. Specific timing depends on your pickup location and chosen package.",
        "order": 1
    },
    {
        "question": "What is included in the Tokara Wine Estate package?",
        "answer": "The Tokara Wine Estate includes round-trip transportation from Cape Town hotels, professional guide services, entrance fees, and specified activities. Meals and refreshments inclusion varies by package - check your specific booking for details.",
        "order": 2
    },
    {
        "question": "Is the Tokara Wine Estate worth the price?",
        "answer": "Yes, the Tokara Wine Estate offers excellent value combining professional guidance, comfortable transport, and unique Cape Town experiences. The convenience of organized tours with local expertise makes it worthwhile for visitors wanting authentic experiences.",
        "order": 3
    },
    {
        "question": "Where does the Tokara Wine Estate depart from?",
        "answer": "The Tokara Wine Estate includes hotel pickup from Cape Town city center and Atlantic Seaboard areas. Specific pickup times are confirmed 24 hours before your tour. Alternative meeting points can be arranged for accommodations outside standard pickup zones.",
        "order": 4
    },
    {
        "question": "What is the best time of year for the Tokara Wine Estate?",
        "answer": "The Tokara Wine Estate operates year-round with each season offering unique advantages. Summer (October-March) provides warm weather and longer days, while winter (May-September) offers clearer skies and dramatic landscapes. Cape Town's Mediterranean climate ensures pleasant conditions most days.",
        "order": 5
    },
    {
        "question": "Is the Tokara Wine Estate suitable for children?",
        "answer": "The Tokara Wine Estate welcomes families with age-appropriate activities for children. Some activities may have minimum age requirements for safety. Child rates are usually available for under 12s. Please inform operators of children's ages when booking.",
        "order": 6
    },
    {
        "question": "What should I bring on the Tokara Wine Estate?",
        "answer": "For the Tokara Wine Estate, bring sunscreen, hat, sunglasses, camera, comfortable walking shoes, and weather-appropriate clothing in layers. Carry water and snacks unless meals are included. Don't forget cash for optional purchases and tips.",
        "order": 7
    },
    {
        "question": "How far in advance should I book the Tokara Wine Estate?",
        "answer": "Book the Tokara Wine Estate at least 48-72 hours in advance, especially during peak season (October-March). Popular tours can sell out weeks ahead during holidays. Last-minute availability depends on group sizes and season.",
        "order": 8
    },
    {
        "question": "What is the cancellation policy for the Tokara Wine Estate?",
        "answer": "The Tokara Wine Estate typically offers free cancellation 24-48 hours before the tour date for a full refund. Cancellations within 24 hours may incur charges. Weather-related cancellations receive full refunds or free rescheduling.",
        "order": 9
    },
    {
        "question": "Is hotel pickup included in the Tokara Wine Estate?",
        "answer": "Yes, the Tokara Wine Estate includes complimentary pickup from most Cape Town city center and Atlantic Seaboard hotels. Pickup typically begins 30-60 minutes before tour start time. Exact pickup time is confirmed the day before your tour.",
        "order": 10
    },
    {
        "question": "How many wineries are visited on the Tokara Wine Estate?",
        "answer": "The Tokara Wine Estate typically includes 3-4 wine estate visits, each offering unique tasting experiences. You'll sample 5-6 wines at each estate, experiencing different varietals and winemaking styles throughout the day.",
        "order": 11
    },
    {
        "question": "Can non-drinkers enjoy the Tokara Wine Estate?",
        "answer": "Absolutely! The Tokara Wine Estate offers scenic beauty, historic architecture, and cultural experiences beyond wine. Non-alcoholic options like grape juice are available for tasting, and the estates often feature art galleries and beautiful gardens.",
        "order": 12
    }
]

print(f"🔧 Restoring original FAQs for Tokara Wine Estate tour...")
print(f"Tour ID: {tour_id}")
print(f"Number of FAQs to restore: {len(original_faqs)}")

try:
    # Update the structured_faqs field with the original FAQs
    result = supabase.table('tours').update({
        'structured_faqs': original_faqs
    }).eq('id', tour_id).execute()
    
    print(f"\n✅ Successfully restored {len(original_faqs)} FAQs for Tokara Wine Estate!")
    print("\nRestored FAQs:")
    for faq in original_faqs:
        print(f"  {faq['order']}. Q: {faq['question'][:60]}...")
        
except Exception as e:
    print(f"\n❌ Failed to restore FAQs: {str(e)}")
