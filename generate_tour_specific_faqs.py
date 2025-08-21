import json
import os
from typing import List, Tuple, Dict
from datetime import datetime

def load_tour_data():
    """Load tour data from JSON file"""
    with open('tours_for_faq_research.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def get_tour_specific_faqs(tour: Dict) -> List[Tuple[str, str]]:
    """Generate specific FAQs for each individual tour"""
    tour_title = tour['title']
    tour_slug = tour['slug']
    category = tour.get('category', 'general')
    
    faqs = []
    
    # Map specific tours to their unique FAQs
    if tour_slug == 'inverdoorn-safari-tour':
        faqs = [
            (f"How far is Inverdoorn Safari from Cape Town?",
             "Inverdoorn Private Game Reserve is located 220km from Cape Town, approximately 2.5 hours drive through the scenic Karoo region via the N1 highway and Ceres. The journey includes beautiful mountain passes and forms part of your safari adventure."),
            
            (f"Can I see the Big 5 at Inverdoorn?",
             "Yes, Inverdoorn is home to lions, elephants, rhinos, buffalos, and cheetahs. While technically not Big 5 (cheetahs replace leopards), you'll enjoy incredible wildlife viewing including giraffes, hippos, zebras, and the famous cheetah conservation program."),
            
            (f"What makes Inverdoorn Safari exclusive?",
             "Inverdoorn offers a more intimate safari experience with smaller group sizes, a renowned cheetah conservation center, luxurious facilities, and two extensive game drives. The exclusive day safari includes buffet lunch and optional cheetah interactions."),
            
            (f"Is the cheetah interaction at Inverdoorn worth it?",
             "Absolutely! Inverdoorn's cheetah interaction (additional R450) offers a rare opportunity to get close to rescued cheetahs while supporting conservation. You'll learn about cheetah preservation and have supervised photo opportunities with Africa's fastest land animal."),
            
            (f"What time should I leave Cape Town for Inverdoorn?",
             "Tours depart at 6:00 AM from Cape Town hotels to arrive for the 10:00 AM game drive when animals are most active. Early departure ensures you experience both morning and afternoon game drives, returning to Cape Town by 6:00 PM."),
            
            (f"Does Inverdoorn cater for vegetarians?",
             "Yes, Inverdoorn's buffet lunch includes vegetarian options alongside traditional South African dishes. Special dietary requirements can be accommodated with advance notice. The lodge restaurant overlooks waterholes where animals often gather."),
            
            (f"Can children do the Inverdoorn cheetah experience?",
             "Children aged 6 and older can participate in the cheetah interaction with parental supervision. Younger children can enjoy the regular game drives but cannot enter the cheetah enclosure for safety reasons."),
            
            (f"What happens if it rains at Inverdoorn?",
             "Inverdoorn operates in all weather conditions as the semi-desert climate means minimal rainfall. Light rain can enhance animal activity. Game drives continue unless conditions are severe, with covered vehicles available."),
            
            (f"Is Inverdoorn suitable for elderly visitors?",
             "Yes, Inverdoorn accommodates elderly guests with comfortable game drive vehicles and minimal walking required. The lodge facilities are easily accessible. Inform staff of any mobility concerns for special assistance."),
            
            (f"What photography equipment should I bring to Inverdoorn?",
             "Bring a camera with good zoom capability (200mm+ lens ideal) for wildlife shots. Binoculars enhance viewing. The open vehicles provide excellent photography angles. Don't forget extra batteries and memory cards."),
            
            (f"How many animals will I see at Inverdoorn?",
             "Inverdoorn's 10,000 hectares host over 1,200 animals including large herds of antelope, zebra, and wildebeest. While sightings vary, the two game drives typically encounter 15-20 different species."),
            
            (f"Is WiFi available at Inverdoorn lodge?",
             "Yes, complimentary WiFi is available in the main lodge area. However, embrace the digital detox opportunity and focus on the incredible wildlife experience. The lodge also has a curio shop and bar.")
        ]
    
    elif tour_slug == 'cape-town-skydive':
        faqs = [
            (f"What is the jump altitude for Cape Town tandem skydiving?",
             "Cape Town tandem skydives jump from 9,000-11,000 feet (approximately 3,000 meters), giving you 30-35 seconds of freefall before the parachute opens. Some operators offer higher altitude jumps up to 13,000 feet for extended freefall time."),
            
            (f"Is Cape Town skydiving safe for first-timers?",
             "Yes, tandem skydiving in Cape Town is extremely safe for first-timers. You'll be attached to a certified instructor with thousands of jumps experience. All equipment is regularly inspected, and comprehensive safety briefings are provided before your jump."),
            
            (f"What is the weight limit for tandem skydiving in Cape Town?",
             "The maximum weight limit is typically 100-110kg (220-242 lbs), though this varies by operator. There's also a BMI consideration for safety harness fitting. Participants over 95kg may incur additional fees. Minimum age is 16 with parental consent."),
            
            (f"Can I skydive over Table Mountain?",
             "While you don't jump directly over Table Mountain, Cape Town skydiving offers spectacular views of Table Mountain, the Atlantic Ocean, Robben Island, and the Cape Peninsula during your descent. The views are absolutely breathtaking on clear days."),
            
            (f"What happens if weather cancels my Cape Town skydive?",
             "Skydiving is weather-dependent for safety. If conditions aren't suitable (high winds, rain, low clouds), your jump will be rescheduled at no extra cost. Most operators offer flexible rebooking or full refunds if you can't reschedule."),
            
            (f"How long does the entire skydiving experience take?",
             "Plan for 3-4 hours total, including check-in, training, waiting for weather clearance, the flight up, your jump, and debrief. The actual skydive lasts 5-7 minutes from exit to landing, with 30-35 seconds of thrilling freefall."),
            
            (f"What should I wear for skydiving in Cape Town?",
             "Wear comfortable clothes suitable for the weather - avoid loose items. Closed, secure shoes are mandatory (no sandals/heels). The dropzone provides jumpsuits, goggles, and all safety equipment. Avoid wearing jewelry that could snag."),
            
            (f"Can I get video of my Cape Town skydive?",
             "Yes! Most operators offer video/photo packages filmed by a separate skydiver or instructor-mounted cameras. Packages range from R800-R1500 and capture your entire experience from boarding to landing - a lifetime memory worth having."),
            
            (f"Do I need previous experience to tandem skydive?",
             "No experience necessary! Tandem skydiving is designed for beginners. Your instructor handles all technical aspects while you enjoy the ride. A 15-minute training session covers body position and landing procedures - that's all you need."),
            
            (f"Where exactly is the Cape Town skydiving location?",
             "Most Cape Town tandem skydives operate from Melkbosstrand area, about 25km north of the city center. Some operators provide transport from Cape Town. The coastal location offers stunning views over the Atlantic and back toward Table Mountain."),
            
            (f"Can I eat before skydiving in Cape Town?",
             "Eat a light, normal meal 2-3 hours before your jump. Avoid heavy, greasy foods or alcohol. Stay hydrated but don't overdrink. Most people handle skydiving well, but eating sensibly helps prevent any queasiness from nerves or motion."),
            
            (f"Is skydiving in Cape Town worth the cost?",
             "Absolutely! At R2,500-R3,500, Cape Town tandem skydiving offers incredible value for a bucket-list experience with world-class views. The combination of professional instruction, safety standards, and spectacular Cape Town scenery makes it unforgettable.")
        ]
    
    elif tour_slug == 'simons-town' or tour_slug == 'simon-s-town':
        faqs = [
            (f"How do I get to Simon's Town from Cape Town?",
             "Simon's Town is 40km from Cape Town city center, about 45-60 minutes by car via the M3 and M4 coastal road. You can also take the scenic train from Cape Town station (1.5 hours) or join a guided tour that includes transport and stops at multiple attractions."),
            
            (f"Can I see penguins at Simon's Town?",
             "Yes! Boulders Beach in Simon's Town is home to over 3,000 African penguins. The colony is accessible via boardwalks with two entry points. Visit early morning or late afternoon for best viewing when penguins are most active."),
            
            (f"What is the entrance fee for Boulders Beach?",
             "Boulders Beach entrance costs R190 for adults and R95 for children (international rates). This includes access to boardwalks and viewing areas. The ticket is valid all day, and there are three access points with different penguin viewing experiences."),
            
            (f"Can I swim with the penguins at Simon's Town?",
             "While you can't swim directly with the penguins at the main colony, you can swim at Boulders Beach swimming area where penguins occasionally visit. Windmill Beach and Seaforth Beach nearby also have penguins that sometimes swim near people."),
            
            (f"What else is there to do in Simon's Town besides penguins?",
             "Simon's Town offers the South African Naval Museum, historic Victorian architecture walking tours, Jubilee Square shopping, seafood restaurants, kayaking tours to see penguins from water, and nearby Cape Point Nature Reserve - easily a full day of activities."),
            
            (f"When is the best time to visit Simon's Town?",
             "Visit year-round, but September to February offers warmer weather for beach activities. Early morning (8-10 AM) or late afternoon (3-5 PM) provides best penguin viewing. Avoid December-January peak crowds if possible."),
            
            (f"Where should I eat in Simon's Town?",
             "The Salty Sea Dog offers harbor views and fresh seafood. Bertha's Restaurant is famous for seafood and navy history. The Lighthouse Café provides casual dining. For fish and chips, try Salty Sea Dog or The Sweetest Thing café."),
            
            (f"Is Simon's Town good for families with children?",
             "Absolutely! Kids love the penguins at Boulders Beach, the beaches are safe for swimming, and Seaforth Beach has tidal pools perfect for children. The compact town is easy to navigate with stroller-friendly boardwalks at the penguin colony."),
            
            (f"How long should I spend in Simon's Town?",
             "Allow minimum 3-4 hours: 1-2 hours for Boulders Beach penguins, 1 hour for lunch, and 1 hour exploring the town. A full day lets you add beach time, kayaking, or combine with Cape Point visit."),
            
            (f"Can I visit Simon's Town and Cape Point in one day?",
             "Yes! Simon's Town and Cape Point are 20 minutes apart. Start early with penguins at Boulders Beach, then Cape Point for hiking and lighthouse views, returning via Chapman's Peak Drive. Many tours combine both destinations."),
            
            (f"Is parking available in Simon's Town?",
             "Parking is available but limited during peak season. Boulders Beach has paid parking (R20-40). Simon's Town center has street parking and public lots. Arrive early in peak season or consider the train to avoid parking issues."),
            
            (f"What should I bring to Simon's Town?",
             "Bring sunscreen, hat, camera with zoom for penguin photos, swimming costume if planning beach time, comfortable walking shoes, and cash for parking and small vendors. Binoculars enhance penguin watching from boardwalks.")
        ]
    
    elif tour_slug == 'chapmans-peak-drive' or tour_slug == 'chapman-s-peak-drive':
        faqs = [
            (f"How long is Chapman's Peak Drive?",
             "Chapman's Peak Drive stretches 9 kilometers between Noordhoek and Hout Bay, featuring 114 curves carved into the cliff face. The drive takes 15-20 minutes without stops, but allow 45-60 minutes to enjoy the spectacular viewpoints."),
            
            (f"What is the toll fee for Chapman's Peak Drive?",
             "The toll fee is R51 for standard vehicles (one way), R26 for motorcycles. The toll plaza is on the Hout Bay side. Annual passes are available for frequent users. The road is free for cyclists and pedestrians."),
            
            (f"Is Chapman's Peak Drive safe to drive?",
             "Yes, Chapman's Peak Drive is safe with protective barriers, rock fall canopies, and regular maintenance. Drive cautiously on the narrow, winding road, especially in wet or windy conditions. The 40km/h speed limit ensures safety while enjoying views."),
            
            (f"Can Chapman's Peak Drive close due to weather?",
             "Yes, Chapman's Peak closes during severe weather conditions including high winds, heavy rain, or rockfall risk. Check the official website or call 021 791 8222 for current status before traveling. Closures are for safety."),
            
            (f"What are the best viewpoints on Chapman's Peak?",
             "The main lookout point is roughly halfway with parking and spectacular views. Other scenic spots include the Noordhoek lookout, various lay-bys for photos, and the picnic area. Each bend offers Instagram-worthy ocean and mountain views."),
            
            (f"Can I cycle on Chapman's Peak Drive?",
             "Yes! Chapman's Peak is popular with cyclists and free for bikes. The challenging 9km climb rewards with incredible views. Best times are early mornings or weekdays to avoid traffic. Always wear bright clothing and cycle single file."),
            
            (f"Is Chapman's Peak Drive worth it?",
             "Absolutely! Chapman's Peak Drive is considered one of the world's most spectacular coastal roads. The engineering marvel carved into 630-million-year-old mountains offers unparalleled Atlantic Ocean views, making the toll fee worthwhile for the experience."),
            
            (f"Can I walk or hike Chapman's Peak?",
             "Yes, pedestrians can walk the route for free, though it's lengthy. Better hiking options include the Chapman's Peak hiking trail above the road, offering even more spectacular views. The trail is moderate to challenging, taking 2-3 hours."),
            
            (f"What's the best time to drive Chapman's Peak?",
             "Sunset drives offer golden hour photography with the sun setting over the Atlantic. Early mornings provide clear views and less traffic. Avoid peak weekend traffic (Saturday 10am-4pm). Winter storms create dramatic scenery if the road's open."),
            
            (f"Can tour buses use Chapman's Peak Drive?",
             "Yes, tour buses can use Chapman's Peak, though some sections are narrow. Most Cape Peninsula tours include this scenic drive. The toll for buses is R125. Some very large coaches may find the bends challenging."),
            
            (f"How do I get to Chapman's Peak from Cape Town?",
             "From Cape Town, take the M3 to M4 (Main Road) through Muizenberg and Fish Hoek to Noordhoek, or via Constantia Nek to Hout Bay (20-30 minutes). GPS coordinates for Hout Bay entrance: -34.0497, 18.3626."),
            
            (f"Are there restaurants near Chapman's Peak?",
             "The Foodbarn Restaurant in Noordhoek and Chapman's Peak Hotel offer dining with views. Hout Bay has numerous restaurants including Dunes Restaurant on the beach. The Toad in the Village (Noordhoek) is perfect for post-drive refreshments.")
        ]
    
    # Continue with more specific tours...
    elif tour_slug == 'maidens-cove' or tour_slug == 'maiden-s-cove':
        faqs = [
            (f"Where exactly is Maiden's Cove located?",
             "Maiden's Cove is located in Clifton, along Victoria Road between Camps Bay and Clifton beaches, directly below the Twelve Apostles mountain range. It's approximately 10 minutes from Cape Town city center and 5 minutes from the V&A Waterfront."),
            
            (f"Can you swim at Maiden's Cove?",
             "While there's no sandy beach at Maiden's Cove, you can swim in the natural tidal pools and off the rocks. The water is cold year-round (12-16°C). It's popular for snorkeling when conditions are calm. Always check tide and wave conditions."),
            
            (f"Is there parking at Maiden's Cove?",
             "Limited free parking is available along Victoria Road on both sides near Maiden's Cove. Arrive early on weekends and holidays as it fills quickly. Additional parking is available at nearby Camps Bay (paid) with a 10-minute walk."),
            
            (f"What makes Maiden's Cove special for sunset?",
             "Maiden's Cove offers unobstructed western views over the Atlantic Ocean, making it Cape Town's premier sunset spot. The rocky outcrops provide natural seating, and you can watch the sun dip below the horizon with Twelve Apostles mountains behind you."),
            
            (f"Are there facilities at Maiden's Cove?",
             "Maiden's Cove has basic facilities including public toilets and braai (BBQ) areas available first-come-first-served. No shops or restaurants on site, so bring everything you need. Camps Bay strip is 5 minutes away for restaurants and supplies."),
            
            (f"Is Maiden's Cove safe to visit?",
             "Maiden's Cove is generally safe during daylight hours with regular security patrols. Avoid displaying valuables in your car. Don't visit after dark. The rocks can be slippery when wet, so wear appropriate footwear."),
            
            (f"Can you braai (BBQ) at Maiden's Cove?",
             "Yes! Maiden's Cove has designated braai areas that are very popular with locals, especially on weekends. Arrive early to secure a spot (before 10 AM on weekends). Bring your own wood/charcoal, food, and cleaning materials."),
            
            (f"What should I bring to Maiden's Cove?",
             "Bring sunscreen, towels, water, snacks, and braai supplies if cooking. Wear shoes with grip for the rocks. Bring a jacket for evening as it gets windy. Don't forget cameras for sunset photos and trash bags to keep the area clean."),
            
            (f"Is Maiden's Cove suitable for children?",
             "Yes, but requires supervision as there's no beach and waves can be unpredictable. The grassy areas are perfect for picnics. Rock pools at low tide create natural paddling pools for kids. Not suitable for unsupervised small children."),
            
            (f"When is the best time to visit Maiden's Cove?",
             "Sunset (5:30-7:30 PM depending on season) is magical. For swimming and sunbathing, visit midday when sun warms the rocks. Low tide reveals more rock pools. Avoid very windy days. Weekdays are less crowded than weekends."),
            
            (f"How is Maiden's Cove different from Clifton beaches?",
             "Maiden's Cove is rockier with no sandy beach but offers free parking, braai facilities, and more space. It's less commercial than Clifton beaches, popular with locals for picnics and sundowners. Better for sunset views than swimming."),
            
            (f"Can you snorkel at Maiden's Cove?",
             "Yes, Maiden's Cove offers good snorkeling in calm conditions with kelp forests and marine life. Best at high tide in summer months. The cold water requires a wetsuit for extended snorkeling. Check swell conditions before entering.")
        ]
    
    elif tour_slug == 'table-mountain-cableway':
        faqs = [
            (f"How much does the Table Mountain cable car cost?",
             "Table Mountain Cableway tickets cost R380-R410 for adults and R190-R200 for children (4-17 years) for international visitors. Prices vary by season. South African residents get significant discounts with ID. Book online for faster access."),
            
            (f"How long is the cable car ride up Table Mountain?",
             "The Table Mountain cable car ride takes approximately 5 minutes to ascend 700 meters to the summit. The rotating cable car completes a full 360-degree rotation during the journey, offering spectacular views in all directions."),
            
            (f"What happens if it's cloudy at Table Mountain?",
             "If the summit is covered in clouds (the famous 'tablecloth'), views will be limited but the experience remains unique walking through clouds. The cable car operates unless winds exceed 60km/h. Check the webcam on their website before visiting."),
            
            (f"What time should I go up Table Mountain?",
             "Early morning (8:30-10 AM) or late afternoon (after 3 PM) avoids crowds and harsh midday sun. Sunset trips are spectacular but book ahead. The first and last cable cars offer the best photo opportunities with golden light."),
            
            (f"How long should I spend on top of Table Mountain?",
             "Allow 1-2 hours minimum to explore the summit's three main walking routes, visit viewpoints, and enjoy refreshments. Hikers might want 3-4 hours. The summit has marked paths ranging from 15 minutes to 1 hour walking time."),
            
            (f"Can I buy tickets at Table Mountain on the day?",
             "While day tickets are available, online booking is strongly recommended to skip queues, especially in summer (November-March). Online tickets are valid for 14 days, offering flexibility. Peak times can have 2-hour waits for tickets."),
            
            (f"Is Table Mountain wheelchair accessible?",
             "Yes! The cable car and summit have wheelchair-friendly facilities. The top station has ramps, accessible toilets, and paved pathways to main viewpoints. Not all summit walks are accessible, but key viewing areas are wheelchair-friendly."),
            
            (f"What facilities are on top of Table Mountain?",
             "The summit features a café, restaurant, gift shop, free WiFi, and clean restrooms. There's a free audio tour via app, telescopes for viewing, and water refill stations. The restaurant offers meals with incredible views."),
            
            (f"What should I wear to Table Mountain?",
             "Wear layers as summit temperatures are 5-6°C cooler than sea level. Bring a warm jacket even in summer. Comfortable walking shoes with grip are essential. Sunscreen, hat, and sunglasses are crucial as UV is stronger at altitude."),
            
            (f"Can I hike up and take the cable car down?",
             "Yes! One-way tickets are available (R210 adults). Popular hiking routes include Platteklip Gorge (2-3 hours) and India Venster (3 hours). Buy your down ticket online before hiking to guarantee space, especially in peak season."),
            
            (f"Is Table Mountain safe to visit?",
             "The cableway and summit tourist areas are very safe with security presence. If hiking, go in groups, stick to marked trails, and avoid isolated areas. Don't hike in bad weather. The cable car is extremely safe with excellent safety records."),
            
            (f"What are Table Mountain's operating hours?",
             "Operating hours vary by season: Summer (longer hours, often 8 AM-7:30 PM), Winter (typically 8:30 AM-5 PM). Last cable car up is 30-60 minutes before closing. Check website for exact daily times as weather affects operations.")
        ]
    
    # Add more specific tours based on their unique characteristics
    else:
        # For tours not specifically mapped, create contextual FAQs based on category
        faqs = generate_contextual_faqs(tour_title, tour_slug, category)
    
    return faqs[:12]  # Return maximum 12 FAQs per tour

def generate_contextual_faqs(title: str, slug: str, category: str) -> List[Tuple[str, str]]:
    """Generate contextual FAQs for tours without specific mapping"""
    faqs = []
    
    # Base questions that apply to all tours but with specific tour name
    faqs.extend([
        (f"How long is the {title} experience?",
         f"The {title} is typically a full-day experience lasting 8-10 hours including transport from Cape Town. Half-day options may be available lasting 4-5 hours. Specific timing depends on your pickup location and chosen package."),
        
        (f"What is included in the {title} package?",
         f"The {title} includes round-trip transportation from Cape Town hotels, professional guide services, entrance fees, and specified activities. Meals and refreshments inclusion varies by package - check your specific booking for details."),
        
        (f"Is the {title} worth the price?",
         f"Yes, the {title} offers excellent value combining professional guidance, comfortable transport, and unique Cape Town experiences. The convenience of organized tours with local expertise makes it worthwhile for visitors wanting authentic experiences."),
        
        (f"Where does the {title} depart from?",
         f"The {title} includes hotel pickup from Cape Town city center and Atlantic Seaboard areas. Specific pickup times are confirmed 24 hours before your tour. Alternative meeting points can be arranged for accommodations outside standard pickup zones."),
        
        (f"What is the best time of year for the {title}?",
         f"The {title} operates year-round with each season offering unique advantages. Summer (October-March) provides warm weather and longer days, while winter (May-September) offers clearer skies and dramatic landscapes. Cape Town's Mediterranean climate ensures pleasant conditions most days."),
        
        (f"Is the {title} suitable for children?",
         f"The {title} welcomes families with age-appropriate activities for children. Some activities may have minimum age requirements for safety. Child rates are usually available for under 12s. Please inform operators of children's ages when booking."),
        
        (f"What should I bring on the {title}?",
         f"For the {title}, bring sunscreen, hat, sunglasses, camera, comfortable walking shoes, and weather-appropriate clothing in layers. Carry water and snacks unless meals are included. Don't forget cash for optional purchases and tips."),
        
        (f"How far in advance should I book the {title}?",
         f"Book the {title} at least 48-72 hours in advance, especially during peak season (October-March). Popular tours can sell out weeks ahead during holidays. Last-minute availability depends on group sizes and season."),
        
        (f"What is the cancellation policy for the {title}?",
         f"The {title} typically offers free cancellation 24-48 hours before the tour date for a full refund. Cancellations within 24 hours may incur charges. Weather-related cancellations receive full refunds or free rescheduling."),
        
        (f"Is hotel pickup included in the {title}?",
         f"Yes, the {title} includes complimentary pickup from most Cape Town city center and Atlantic Seaboard hotels. Pickup typically begins 30-60 minutes before tour start time. Exact pickup time is confirmed the day before your tour.")
    ])
    
    # Add category-specific questions
    if category == 'safari':
        faqs.extend([
            (f"What animals will I see on the {title}?",
             f"The {title} offers diverse wildlife viewing including lions, elephants, various antelope species, zebras, and numerous bird species. While specific sightings can't be guaranteed, experienced guides maximize your viewing opportunities throughout the day."),
            
            (f"Are meals included in the {title}?",
             f"Most {title} packages include lunch at the reserve lodge. Breakfast and refreshments may also be included depending on your package. Special dietary requirements can be accommodated with advance notice.")
        ])
    elif category == 'winelands':
        faqs.extend([
            (f"How many wineries are visited on the {title}?",
             f"The {title} typically includes 3-4 wine estate visits, each offering unique tasting experiences. You'll sample 5-6 wines at each estate, experiencing different varietals and winemaking styles throughout the day."),
            
            (f"Can non-drinkers enjoy the {title}?",
             f"Absolutely! The {title} offers scenic beauty, historic architecture, and cultural experiences beyond wine. Non-alcoholic options like grape juice are available for tasting, and the estates often feature art galleries and beautiful gardens.")
        ])
    elif category == 'marine':
        faqs.extend([
            (f"Is the {title} weather dependent?",
             f"Yes, the {title} operates subject to safe sea conditions. Tours may be postponed in rough seas or severe weather. Operators monitor conditions closely and offer full refunds or rescheduling if cancellation is necessary."),
            
            (f"Do I need to be able to swim for the {title}?",
             f"Swimming ability is not required for the {title} as all activities include safety equipment and supervision. Life jackets are provided and mandatory. Professional crew ensures safety throughout your marine experience.")
        ])
    
    return faqs

def format_faqs_for_database(faqs: List[Tuple[str, str]]) -> str:
    """Format FAQs for database storage in the required format"""
    formatted = []
    for q, a in faqs:
        formatted.append(f"Q: {q}||A: {a}")
    return "||".join(formatted)

def save_tour_faqs(all_tour_faqs):
    """Save all tour FAQs to JSON file"""
    output_file = 'tour_specific_faqs.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_tour_faqs, f, indent=2, ensure_ascii=False)
    print(f"✅ Saved tour-specific FAQs to {output_file}")
    return output_file

def main():
    print("=" * 60)
    print("Generating Tour-Specific FAQs for SEO")
    print("=" * 60)
    
    # Load tour data
    tours = load_tour_data()
    all_tour_faqs = []
    
    for i, tour in enumerate(tours, 1):
        print(f"\n[{i}/{len(tours)}] Generating FAQs for: {tour['title']}")
        
        # Get specific FAQs for this tour
        faqs = get_tour_specific_faqs(tour)
        
        # Format for database
        formatted_faqs = format_faqs_for_database(faqs)
        
        # Store the result
        tour_faq_data = {
            'tour_id': tour['id'],
            'tour_slug': tour['slug'],
            'tour_title': tour['title'],
            'category': tour.get('category', 'general'),
            'faq_count': len(faqs),
            'faqs_formatted': formatted_faqs,
            'faqs_list': [{'question': q, 'answer': a} for q, a in faqs]
        }
        
        all_tour_faqs.append(tour_faq_data)
        print(f"  ✅ Generated {len(faqs)} specific FAQs")
    
    # Save to file
    output_file = save_tour_faqs(all_tour_faqs)
    
    print("\n" + "=" * 60)
    print("Summary")
    print("=" * 60)
    print(f"✅ Generated specific FAQs for {len(all_tour_faqs)} tours")
    print(f"📁 FAQs saved to: {output_file}")
    print(f"📊 Average FAQs per tour: {sum(t['faq_count'] for t in all_tour_faqs) / len(all_tour_faqs):.1f}")
    print("\n🎯 Next step: Update Supabase database with these SEO-optimized FAQs")

if __name__ == "__main__":
    main()
