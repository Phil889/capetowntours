import json
import time
from typing import List, Dict

def load_tours_data():
    """Load tours data from JSON file"""
    with open('tours_for_faq_research.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def save_questions_data(questions_data):
    """Save collected questions to JSON file"""
    output_file = 'google_questions_collected.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(questions_data, f, indent=2, ensure_ascii=False)
    print(f"✅ Saved questions to {output_file}")
    return output_file

def generate_generic_questions(tour_title: str, category: str) -> List[str]:
    """Generate generic questions based on tour type"""
    questions = []
    
    # Generic questions for all tours
    base_questions = [
        f"How long is the {tour_title}?",
        f"What is included in the {tour_title}?",
        f"Is the {tour_title} worth it?",
        f"How much does the {tour_title} cost?",
        f"What should I wear for the {tour_title}?",
        f"Is the {tour_title} suitable for children?",
        f"What is the cancellation policy for the {tour_title}?",
        f"Where does the {tour_title} depart from?",
        f"Do I need to book the {tour_title} in advance?",
        f"What time does the {tour_title} start?",
        f"Is hotel pickup included in the {tour_title}?",
        f"What is the best time of year for the {tour_title}?"
    ]
    
    # Category-specific questions
    if category == 'safari':
        questions.extend([
            f"What animals will I see on the {tour_title}?",
            f"Is the {tour_title} a Big 5 safari?",
            f"How far is the safari from Cape Town?",
            f"What is the difference between a game drive and a safari walk?",
            f"Are meals included in the safari tour?",
            f"Is the safari suitable for pregnant women?",
            f"Can I take photos during the safari?",
            f"What happens if it rains during the safari?"
        ])
    elif category == 'winelands':
        questions.extend([
            f"How many wine estates are visited on the {tour_title}?",
            f"Are wine tastings included in the price?",
            f"Is lunch included in the wine tour?",
            f"Can non-drinkers enjoy the wine tour?",
            f"Which wine regions are covered in the tour?",
            f"Is transportation provided between wineries?",
            f"Can I buy wine during the tour?",
            f"Is the wine tour suitable for children?"
        ])
    elif category == 'marine':
        questions.extend([
            f"What marine life can I see on the {tour_title}?",
            f"Is the {tour_title} weather dependent?",
            f"Do I need to know how to swim?",
            f"What safety equipment is provided?",
            f"Is the tour suitable for people who get seasick?",
            f"What is the best season for marine wildlife?",
            f"Are refreshments provided on the boat?",
            f"How long is the boat ride?"
        ])
    elif category == 'mountain':
        questions.extend([
            f"How difficult is the {tour_title}?",
            f"What fitness level is required?",
            f"Is the cable car included in the price?",
            f"What happens if the weather is bad?",
            f"How long does it take to reach the top?",
            f"Are there facilities at the top?",
            f"Is the tour suitable for elderly visitors?",
            f"What are the operating hours?"
        ])
    
    # Add base questions
    questions.extend(base_questions)
    
    return questions

def process_tours_for_questions():
    """Process all tours and generate questions"""
    tours = load_tours_data()
    all_questions = []
    
    print("=" * 60)
    print("Generating Questions for Each Tour")
    print("=" * 60)
    
    for i, tour in enumerate(tours, 1):
        print(f"\n[{i}/{len(tours)}] Processing: {tour['title']}")
        
        # Generate questions based on tour category
        questions = generate_generic_questions(
            tour['title'], 
            tour.get('category', 'general')
        )
        
        # Store questions with tour info
        tour_questions = {
            'tour_id': tour['id'],
            'tour_slug': tour['slug'],
            'tour_title': tour['title'],
            'category': tour.get('category', 'general'),
            'questions': questions[:15]  # Keep top 15 questions per tour
        }
        
        all_questions.append(tour_questions)
        print(f"  ✅ Generated {len(questions)} questions")
    
    return all_questions

if __name__ == "__main__":
    # Process tours and generate questions
    questions_data = process_tours_for_questions()
    
    # Save questions
    output_file = save_questions_data(questions_data)
    
    print("\n" + "=" * 60)
    print("Summary")
    print("=" * 60)
    print(f"✅ Processed {len(questions_data)} tours")
    print(f"📁 Questions saved to: {output_file}")
    print("\n🎯 Next step: Use Playwright to search Google for actual PAA questions")
    print("   and then generate SEO-optimized answers for each question.")
