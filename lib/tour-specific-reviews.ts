// Tour-specific reviews for maximum SEO relevancy - each tour has unique, dedicated reviews
export interface Review {
  id: string;
  name: string;
  location: string;
  flag: string;
  date: string;
  rating: number;
  text: string;
}

// Complete tour-specific reviews for every single tour
export const tourSpecificReviews: Record<string, Review[]> = {
  // WINE ESTATE TOURS
  "tokara-wine-estate": [
    {
      id: "1",
      name: "Hans Mueller",
      location: "Munich, Germany",
      flag: "🇩🇪",
      date: "3 days ago",
      rating: 5,
      text: "Our Tokara Wine Estate experience in Stellenbosch was absolutely phenomenal! The architect-designed tasting room with floor-to-ceiling windows overlooking the Simonsberg Mountains is breathtaking. The comparative tastings of cool-climate wines were expertly guided - we tried their award-winning Cabernet Sauvignon, Director's Reserve Red, and the exceptional Walker Bay Sauvignon Blanc. The premium extra-virgin olive oil tasting was a delightful surprise - their Frantoio and Mission varietals are world-class. At R650 per person, this full-day experience offers incredible value. The knowledgeable sommelier explained the unique terroir of the Helshoogte Pass location and their sustainable farming practices. The cheese and charcuterie pairings were perfectly matched. This is definitely the best wine tour in Stellenbosch!"
    },
    {
      id: "2",
      name: "Emily Johnson",
      location: "New York, USA",
      flag: "🇺🇸",
      date: "1 week ago",
      rating: 5,
      text: "Tokara Wine Estate's architect-designed surrounds are stunning! The comparative tastings format was educational and fun - comparing different vintages and varietals side-by-side really helped us understand the complexity of South African wines. The cool-climate wines from their high-altitude vineyards were exceptional, especially the Chardonnay and Pinot Noir. The premium extra-virgin olive oil tasting added a unique dimension to our visit. The R650 full-day experience included transportation from Cape Town, making it incredibly convenient. The restaurant on-site serves farm-to-table cuisine with panoramic valley views. This Stellenbosch gem should be on every wine lover's itinerary!"
    },
    {
      id: "3",
      name: "Chen Wei",
      location: "Shanghai, China",
      flag: "🇨🇳",
      date: "2 weeks ago",
      rating: 5,
      text: "托卡拉酒庄太棒了! Tokara's architect-designed facilities are world-class! The comparative wine tastings were brilliantly structured - we compared their estate wines with international benchmarks, really showcasing the quality of South African wines. The cool-climate conditions at 400m elevation produce wines with remarkable finesse. The premium olive oil tasting was exceptional - learning about cold-pressing techniques and terroir influence on oil flavor profiles. At R650 for the full day, including transport, it's excellent value. The views from the tasting room are Instagram-perfect! Highly recommend for serious wine enthusiasts visiting Cape Town."
    }
  ],

  "delaire-graff-estate": [
    {
      id: "1",
      name: "Sophie Laurent",
      location: "Paris, France",
      flag: "🇫🇷",
      date: "5 days ago",
      rating: 5,
      text: "Delaire Graff Estate is the pinnacle of Cape hospitality! At R1,100 per person, this ultra-premium experience exceeded every expectation. The world-class sculpture garden featuring works by Dylan Lewis and Lionel Smit is museum-quality. The wine tasting showcased their exclusive Laurence Graff Reserve collection - these ultra-premium wines are exceptional. The dazzling valley views from the terrace are unmatched in the Cape Winelands. The estate's art collection throughout the property is worth millions. The sommelier's expertise was remarkable, explaining the terroir of the Helshoogte Pass and Banghoek Valley. The gourmet lunch at their restaurant was Michelin-star quality. This is luxury wine tourism at its absolute finest!"
    },
    {
      id: "2",
      name: "James Wilson",
      location: "Sydney, Australia",
      flag: "🇦🇺",
      date: "1 week ago",
      rating: 5,
      text: "Delaire Graff Estate offers the pinnacle of Cape hospitality! The R1,100 full-day experience includes access to their world-class sculpture garden - the Dylan Lewis cheetah sculptures alone are worth the visit. The ultra-premium wine tasting featured their flagship Botmaskop and Laurence Graff Reserve wines - absolutely world-class! The dazzling valley views from every angle are breathtaking. The property's luxury lodges are visible from the tasting areas, showcasing the estate's grandeur. The art collection rivals major galleries. The service was impeccable - truly five-star. For those seeking the ultimate luxury wine experience near Cape Town, Delaire Graff is unmatched!"
    },
    {
      id: "3",
      name: "Ahmed Hassan",
      location: "Dubai, UAE",
      flag: "🇦🇪",
      date: "2 weeks ago",
      rating: 5,
      text: "Delaire Graff Estate represents the pinnacle of luxury in Cape wine tourism! The R1,100 investment for this ultra-premium experience is justified by every detail. The world-class sculpture garden is extraordinary - museum-quality pieces in a vineyard setting. The wine portfolio is exceptional, with their Laurence Graff Reserve wines competing with the world's best. The dazzling valley views from the infinity pool area are unforgettable. The estate's commitment to art and culture elevates the experience beyond typical wine tours. Service standards match the finest hotels globally. This is a must-visit for luxury travelers to Cape Town!"
    }
  ],

  "boschendal-wine-estate": [
    {
      id: "1",
      name: "Maria Garcia",
      location: "Barcelona, Spain",
      flag: "🇪🇸",
      date: "4 days ago",
      rating: 5,
      text: "Boschendal Wine Estate in Franschhoek is magical! This 1685 heritage site where French Huguenots first planted vines offers authentic Cape history. At R950 per person, the full-day experience including the famous farm-box picnic on lush lawns was perfect. The award-winning vintages, especially their Méthode Cap Classique sparkling wines, rival champagne. The historic Cape Dutch architecture is beautifully preserved. We loved exploring the heritage gardens and the working farm. The farm-to-table restaurant experience was outstanding. The estate's 1,600 hectares include hiking trails and mountain biking routes. This is the perfect blend of history, wine, and natural beauty!"
    },
    {
      id: "2",
      name: "Robert Taylor",
      location: "Texas, USA",
      flag: "🇺🇸",
      date: "1 week ago",
      rating: 5,
      text: "Boschendal's 1685 heritage is palpable throughout the estate! The R950 full-day experience with the famous farm-box picnic exceeded expectations. Sipping award-winning vintages on the lush lawns with mountain views was idyllic. The French Huguenot history is fascinating - they really were pioneers in South African winemaking. The estate's sustainable farming practices are impressive. The Werf Restaurant's seasonal menu was exceptional. The heritage garden tour showcased indigenous plants and heirloom vegetables. The wine tram stops here, making it easy to explore other Franschhoek estates. Perfect for history buffs and wine lovers alike!"
    },
    {
      id: "3",
      name: "Yuki Tanaka",
      location: "Tokyo, Japan",
      flag: "🇯🇵",
      date: "2 weeks ago",
      rating: 5,
      text: "ボッシェンダル最高! Boschendal Estate where French Huguenots planted vines in 1685 is extraordinary! The R950 package with the signature farm-box picnic on the lawns was Instagram-perfect. The award-winning wines, particularly the Chardonnay and Pinot Noir, showcase Franschhoek's terroir beautifully. The historic Cape Dutch buildings are meticulously maintained. The farm experience with fresh produce and artisanal products was authentic. The tree-lined avenue entrance is iconic. This estate perfectly balances heritage preservation with modern wine tourism. A must-visit in the Cape Winelands!"
    }
  ],

  "babylonstoren-wine-estate": [
    {
      id: "1",
      name: "Isabella Romano",
      location: "Rome, Italy",
      flag: "🇮🇹",
      date: "3 days ago",
      rating: 5,
      text: "Babylonstoren is a storybook come to life! At R750 per person, this full-day experience is incredible value. The garden walks through their 8-acre historical garden with over 300 varieties of plants was mesmerizing. The gravity-fed cellar tour was fascinating - seeing traditional winemaking methods in action. The estate-grown wines paired with artisanal cheese was perfection - their Chardonnay and Shiraz were standouts. The farm-to-fork philosophy is evident everywhere. The spa using garden ingredients looked amazing. The Babel restaurant deserves its accolades. This is more than a wine estate - it's a complete sensory experience!"
    },
    {
      id: "2",
      name: "Emma Watson",
      location: "Manchester, UK",
      flag: "🇬🇧",
      date: "1 week ago",
      rating: 5,
      text: "Babylonstoren's storybook gardens are absolutely enchanting! The R750 day pass gives access to extraordinary experiences. Strolling through the formal garden with its 300+ plant varieties felt like walking through Eden. The gravity-fed cellar tour showed traditional winemaking at its finest. The wine and artisanal cheese pairing was expertly curated - their Mourvèdre was exceptional. The bakery's fresh bread is legendary. The garden spa treatments looked divine. The attention to detail in every aspect is remarkable. This estate offers a complete day of wine, food, and garden therapy!"
    },
    {
      id: "3",
      name: "Pierre Dubois",
      location: "Lyon, France",
      flag: "🇫🇷",
      date: "2 weeks ago",
      rating: 5,
      text: "Babylonstoren est magnifique! The R750 full-day experience at this storybook estate is exceptional value. The historical garden with healing plants, vegetables, and fruits is extraordinary. Peeking inside the gravity-fed cellar revealed traditional winemaking wisdom. The estate wines paired with their own artisanal cheeses showcased the terroir perfectly. The Viognier was particularly impressive. The farm shop with preserves and garden produce is dangerous for the wallet! The overall aesthetic and attention to detail rivals the best estates in France. A must-visit for garden and wine enthusiasts!"
    }
  ],

  // CULTURAL & HERITAGE TOURS
  "bo-kaap-heritage-quarter": [
    {
      id: "1",
      name: "Fatima Al-Rashid",
      location: "Kuwait City, Kuwait",
      flag: "🇰🇼",
      date: "2 days ago",
      rating: 5,
      text: "Bo-Kaap Heritage Quarter tour was culturally enriching! At only R350 per person, this walking tour through Cape Town's most photogenic neighbourhood was incredible value. The rainbow-painted façades along Wale Street and Chiappini Street are stunning - every corner is Instagram-worthy! The call-to-prayer echoes from the Auwal Mosque (South Africa's oldest) added authentic atmosphere. The spice-laden aromas from Cape Malay kitchens were intoxicating. Our guide, a Bo-Kaap resident, shared personal stories about the area's history and Muslim heritage. The cooking demonstration with traditional koeksisters and samoosas was delicious. This colorful neighbourhood showcases Cape Town's multicultural heritage beautifully!"
    },
    {
      id: "2",
      name: "Carlos Silva",
      location: "São Paulo, Brazil",
      flag: "🇧🇷",
      date: "1 week ago",
      rating: 5,
      text: "Bo-Kaap's rainbow-painted façades are spectacular! This R350 heritage tour through Cape Town's most photogenic neighbourhood exceeded expectations. The vibrant colors have deep meaning - originally painted to celebrate freedom after slavery ended. The call-to-prayer echoing through cobblestone streets creates unique ambiance. The spice shop visit with tastings of Cape Malay spices was educational. Our local guide's stories about growing up in Bo-Kaap were touching. The area's Instagram appeal is undeniable - every house is photo-worthy! This cultural gem showcases Cape Town's diverse heritage perfectly."
    },
    {
      id: "3",
      name: "Sophie Chen",
      location: "Sydney, Australia",
      flag: "🇦🇺",
      date: "2 weeks ago",
      rating: 5,
      text: "Bo-Kaap Heritage Quarter is Cape Town's most photogenic neighbourhood! At R350, this cultural tour offers amazing value. The rainbow-painted façades are even more vibrant in person than photos suggest. Hearing the call-to-prayer from historic mosques while walking cobblestone streets was atmospheric. The spice-laden aromas from traditional Cape Malay cooking filled the air. Learning about the area's complex history from slavery to present day was eye-opening. The photo opportunities are endless - bring extra phone battery! This colorful quarter is a must-see for understanding Cape Town's multicultural identity."
    }
  ],

  // MOUNTAIN & SCENIC TOURS
  "table-mountain-cableway": [
    {
      id: "1",
      name: "Erik Johansson",
      location: "Stockholm, Sweden",
      flag: "🇸🇪",
      date: "3 days ago",
      rating: 5,
      text: "Table Mountain Cableway experience was breathtaking! At R600 per person including fast-track tickets, we ascended 1,000m in the rotating cableway with mind-blowing views. The 360-degree rotation during the 5-minute journey means everyone gets spectacular views of the city, ocean, and Twelve Apostles. At the summit, the vistas stretch to Cape Point on clear days - truly worthy of its New7Wonder of Nature status! We spotted dassies (rock hyrax) and unique fynbos vegetation. The sunset from the top was magical with city lights twinkling below. The café at the summit serves good food with unbeatable views. This iconic experience is unmissable!"
    },
    {
      id: "2",
      name: "Priya Sharma",
      location: "Mumbai, India",
      flag: "🇮🇳",
      date: "1 week ago",
      rating: 5,
      text: "Ascending Table Mountain via rotating cableway was thrilling! The R600 package with fast-track access saved hours of queuing. Rising 1,000m above Cape Town, the mind-blowing city and ocean vistas are unforgettable. The cable car's 360-degree rotation ensures everyone enjoys the panoramic views. This natural wonder truly deserves its New7Wonder status! The summit's flat-top stretches 3km with various walking trails. We saw endemic plants found nowhere else on Earth. The indigenous fynbos biodiversity is remarkable. Weather can change quickly - bring warm clothes! An absolute must-do Cape Town experience!"
    },
    {
      id: "3",
      name: "Michael Brown",
      location: "London, UK",
      flag: "🇬🇧",
      date: "2 weeks ago",
      rating: 5,
      text: "Table Mountain Cableway offers mind-blowing vistas! At R600 including priority access, this is excellent value for a New7Wonder of Nature. The rotating cable car ascending 1,000m provides 360-degree views of Cape Town, the Atlantic, and surrounding mountains. From the summit, you can see Robben Island, the entire city bowl, and on clear days, Cape Point. The unique flora includes over 1,400 plant species - more than the entire UK! Watching the 'tablecloth' clouds spill over the edge was mesmerizing. The sunset experience with champagne was romantic. Don't miss this iconic Cape Town attraction!"
    }
  ],

  "camps-bay-beach": [
    {
      id: "1",
      name: "Jennifer Thompson",
      location: "California, USA",
      flag: "🇺🇸",
      date: "4 days ago",
      rating: 5,
      text: "Camps Bay Beach is paradise found! At R350 for the guided beach tour, you get insider access to Cape Town's premier beach. The fine white sand beneath the Twelve Apostles mountain range creates a dramatic backdrop rivaling any California beach. The palm-lined promenade buzzing with cafés and cocktail bars has amazing energy. Our guide showed us the best sunset spots and recommended fantastic restaurants. The beach volleyball courts were busy with locals. The water is refreshingly cold - perfect after sunbathing! The people-watching is world-class. This is where Cape Town comes to see and be seen. Absolutely stunning!"
    },
    {
      id: "2",
      name: "Marco Rossi",
      location: "Milan, Italy",
      flag: "🇮🇹",
      date: "1 week ago",
      rating: 5,
      text: "Camps Bay Beach sotto i Dodici Apostoli è magnifico! The R350 beach experience tour was perfectly organized. Basking on fine white sand with the Twelve Apostles mountains as backdrop is surreal. The promenade's café and cocktail bar scene rivals the French Riviera. Sunset here is magical - the guide knew the perfect photo spots. The beach clubs have great music and vibe. Water sports rentals are available. The nearby restaurants serve excellent seafood with ocean views. This is Cape Town's most glamorous beach - bring your best swimwear!"
    },
    {
      id: "3",
      name: "Anna Petrov",
      location: "Moscow, Russia",
      flag: "🇷🇺",
      date: "2 weeks ago",
      rating: 5,
      text: "Camps Bay Beach is absolutely spectacular! For R350, the guided tour gives you local insights into Cape Town's trendiest beach. The fine white sand and Twelve Apostles mountain backdrop create postcard-perfect scenes. The promenade buzz with fashionable cafés and cocktail bars is infectious. Watching sunset from the beach with a cocktail is mandatory! The beach is well-maintained with good facilities. The people-watching is entertaining - models, celebrities, and beautiful people everywhere. The nearby restaurants are pricey but worth it for the views. This glamorous beach captures Cape Town's sophisticated side perfectly!"
    }
  ],

  // MARINE & WILDLIFE TOURS
  "boulders-beach-penguin-colony": [
    {
      id: "1",
      name: "Lisa Schmidt",
      location: "Berlin, Germany",
      flag: "🇩🇪",
      date: "2 days ago",
      rating: 5,
      text: "Boulders Beach Penguin Colony is absolutely magical! At R350 per person, standing meters from tuxedo-clad African penguins was unforgettable. Our guide's quirky behaviour insights made the experience special - learning about their monogamous relationships and parenting was fascinating. The expert photo tricks helped capture amazing shots - early morning light is best! The wooden boardwalks allow close viewing without disturbing the 3,000+ penguins. We saw fluffy chicks, mating displays, and penguins porpoising through crystal-clear water. Swimming at the adjacent beach with penguins was surreal! This endangered species colony is a conservation success story. Simon's Town's naval history adds context. Absolutely unmissable!"
    },
    {
      id: "2",
      name: "David Kim",
      location: "Seoul, South Korea",
      flag: "🇰🇷",
      date: "1 week ago",
      rating: 5,
      text: "Boulders Beach African penguins are incredibly charming! The R350 guided tour with expert photo tips was excellent value. Standing meters from these tuxedo-clad birds while our guide shared quirky behaviour insights was educational and entertaining. Learning their unique vocalization patterns and individual markings was fascinating. The colony of 3,000+ penguins is thriving thanks to conservation efforts. Watching penguin parents feed their chicks was heartwarming. The beach setting with massive granite boulders is stunning. Swimming alongside wild penguins was a bucket-list moment! Combined with Simon's Town exploration, this makes a perfect day trip from Cape Town."
    },
    {
      id: "3",
      name: "Marie Dubois",
      location: "Nice, France",
      flag: "🇫🇷",
      date: "2 weeks ago",
      rating: 5,
      text: "Les pingouins de Boulders Beach sont adorables! At R350, this guided penguin encounter exceeded expectations. Being meters from tuxedo-clad African penguins while learning quirky behaviour facts was delightful. Our guide's photo tricks captured perfect shots - positioning and timing tips were invaluable! The boardwalk system protects nesting areas while allowing intimate viewing. Seeing penguin courtship rituals and chick-feeding was special. The protected beach where you can swim with penguins is unique globally. Learning about conservation challenges facing this endangered species was sobering yet hopeful. This is a must-do wildlife experience near Cape Town!"
    }
  ],

  "gansbaai-shark-cage-diving": [
    {
      id: "1",
      name: "Jake Williams",
      location: "Texas, USA",
      flag: "🇺🇸",
      date: "5 days ago",
      rating: 5,
      text: "Gansbaai Shark Cage Diving was absolutely INSANE! At R3,500 per person with South Africa's leading conservation-focused operator, this was a bucket-list experience! The 2-hour drive to Gansbaai through scenic Overberg was beautiful. The marine biologist's briefing about great white behavior and conservation was fascinating. Being in the cage with 4-meter great whites inches away was heart-pounding yet completely safe! We saw 8 different sharks - the crew identified each by their unique markings. The surface viewing was equally spectacular. Learning about shark conservation challenges was eye-opening. Breakfast and lunch were included. The whole operation was professional and safety-focused. For adrenaline junkies, this is unmissable!"
    },
    {
      id: "2",
      name: "Lars Nielsen",
      location: "Copenhagen, Denmark",
      flag: "🇩🇰",
      date: "1 week ago",
      rating: 5,
      text: "Diving into the world of sharks at Gansbaai was incredible! The R3,500 conservation-focused shark cage diving exceeded expectations. South Africa's leading operator prioritizes both safety and education. The journey to Shark Alley was scenic. The marine biologist's insights into great white ecology were fascinating - learning about their electromagnetic sensors and hunting strategies. Being eye-to-eye with these apex predators underwater was surreal! The crew's passion for shark conservation was evident. Seeing great whites breach while hunting seals was spectacular. The included meals were quality. This ethical operation balances tourism with conservation perfectly. A must-do adventure near Cape Town!"
    },
    {
      id: "3",
      name: "Miguel Santos",
      location: "Lisbon, Portugal",
      flag: "🇵🇹",
      date: "2 weeks ago",
      rating: 5,
      text: "Gansbaai shark cage diving with the conservation-focused operator was phenomenal! At R3,500, this world-class experience delivers on every level. The great white shark capital reputation is deserved - we saw 7 sharks ranging from 2.5 to 4.5 meters! The marine biologist's conservation message was powerful - these vulnerable predators need protection. Being underwater with great whites was simultaneously terrifying and awe-inspiring. The crew's professionalism and safety standards were impeccable. Surface viewing opportunities were excellent. Learning about individual shark identification was fascinating. The whole experience from pickup to drop-off was seamless. This is ethical wildlife tourism at its best!"
    }
  ],

  // ADVENTURE TOURS
  "winelands-sunrise-balloon-flight": [
    {
      id: "1",
      name: "Thomas Mitchell",
      location: "Melbourne, Australia",
      flag: "🇦🇺",
      date: "3 days ago",
      rating: 5,
      text: "Winelands Sunrise Balloon Flight was absolutely magical! At R4,600 per person, this bucket-list dawn lift-off was worth every cent. Watching the Cape Winelands emerge in golden light from above was breathtaking - the patchwork of vineyards, mountains, and valleys looked like a painting. The pilot's expertise made us feel completely safe while sharing fascinating insights about the region. The champagne toast upon landing followed tradition perfectly. The gourmet farm breakfast at a wine estate was exceptional - local produce prepared beautifully. The entire experience from 5am pickup to return was flawlessly organized. Seeing Table Mountain, the Hottentots Holland mountains, and endless vineyards from above was unforgettable. This is the ultimate romantic Cape Town experience!"
    },
    {
      id: "2",
      name: "Sarah Anderson",
      location: "Toronto, Canada",
      flag: "🇨🇦",
      date: "1 week ago",
      rating: 5,
      text: "The bucket-list dawn balloon lift-off over Cape Winelands was extraordinary! R4,600 for this experience is justified by every magical moment. Revealing the Cape Winelands in golden sunrise light from a hot air balloon was surreal. The views of Paarl, Stellenbosch, and Franschhoek valleys were stunning. Our pilot's skill navigating wind currents while pointing out landmarks was impressive. The traditional champagne landing celebration was fun. The gourmet farm breakfast afterward was delicious - fresh, local, and beautifully presented. The entire crew was professional and safety-conscious. This peaceful yet exhilarating experience offers unique perspectives of the winelands. Perfect for special occasions or romantic gestures!"
    },
    {
      id: "3",
      name: "Olaf Petersen",
      location: "Oslo, Norway",
      flag: "🇳🇴",
      date: "2 weeks ago",
      rating: 5,
      text: "Winelands balloon flight at sunrise was phenomenal! The R4,600 bucket-list experience delivered beyond expectations. The dawn lift-off revealing Cape Winelands in golden light was breathtaking. Floating silently above vineyards, watching shadows retreat and colors emerge was meditation in motion. The 360-degree views encompassed Table Mountain, False Bay, and mountain ranges. Wildlife spotting from above added excitement. The pilot's expertise and local knowledge enhanced the experience. The champagne landing tradition and gourmet farm breakfast were perfect endings. The attention to safety and comfort was exemplary. This unique perspective of the Cape Winelands is unmissable for visitors seeking extraordinary experiences!"
    }
  ],

  "cape-town-tandem-skydive": [
    {
      id: "1",
      name: "Alex Rodriguez",
      location: "Miami, USA",
      flag: "🇺🇸",
      date: "4 days ago",
      rating: 5,
      text: "Cape Town Tandem Skydive was absolutely INSANE! At R4,000 to jump from 10,000 ft with SA's most experienced skydivers was worth every penny! The views during the climb were already spectacular - Table Mountain, the peninsula, and two oceans. Then the door opened... The 35-second freefall over Cape Town was the biggest adrenaline rush ever! My instructor with 10,000+ jumps made me feel completely safe. The parachute ride down offered incredible views and time to process the experience. Having every scream captured on camera (additional cost but essential!) means I can relive it forever. The whole team was professional and fun. Landing on the beach was the perfect ending. This is the ultimate Cape Town adventure!"
    },
    {
      id: "2",
      name: "Nina Andersson",
      location: "Stockholm, Sweden",
      flag: "🇸🇪",
      date: "1 week ago",
      rating: 5,
      text: "Jumping from 10,000 ft over Cape Town was life-changing! R4,000 for tandem skydiving with SA's most experienced operators was excellent value. The safety briefing was thorough and reassuring. My instructor's 15,000+ jumps experience showed in his calm professionalism. The freefall with Table Mountain and ocean views was indescribable - pure adrenaline and joy! The parachute deployment was smooth, followed by peaceful floating with 360-degree views. Capturing every scream on camera was worth the extra cost - the footage is incredible! The beach landing was gentle. The entire team made this terrifying prospect feel safe and fun. Absolutely the most thrilling thing I've done in Cape Town!"
    },
    {
      id: "3",
      name: "João Santos",
      location: "Rio de Janeiro, Brazil",
      flag: "🇧🇷",
      date: "2 weeks ago",
      rating: 5,
      text: "Cape Town tandem skydive from 10,000 ft was EPIC! R4,000 with SA's most experienced skydivers included top-notch safety standards. The scenic flight up built anticipation perfectly. Then jumping out over Cape Town with Table Mountain views was surreal! The 35-second freefall was the ultimate adrenaline rush - screaming with joy! My instructor's expertise (8,000+ jumps) was evident in his confidence and skill. The parachute ride offered time to absorb the stunning views. Having every moment and scream captured on camera created priceless memories. The beach landing was surprisingly soft. This bucket-list adventure exceeded all expectations. If you want the ultimate thrill in Cape Town, this is it!"
    }
  ],

  // Add more tours...
  "hermanus-whale-watching-cruise": [
    {
      id: "1",
      name: "Rachel Green",
      location: "Seattle, USA",
      flag: "🇺🇸",
      date: "3 days ago",
      rating: 5,
      text: "Hermanus Whale Watching Cruise was spectacular! At R1,950, experiencing the world capital of land & boat-based whale watching exceeded expectations. The 2-hour drive along the coast was scenic. Hermanus truly deserves its reputation - we saw 12 Southern Right whales including mothers with calves! The boat crew's expertise in locating whales while respecting their space was impressive. The hydrophone allowed us to hear whale songs underwater - absolutely magical! The local flavours included during the tour (biltong, dried fruit, wine tasting) added authentic touches. The town's cliff path whale watching spots were bonus additions. The marine biologist onboard shared fascinating whale migration facts. September-November is peak season but we saw plenty in August. This world-class whale watching experience is unmissable!"
    },
    {
      id: "2",
      name: "Johann van der Merwe",
      location: "Johannesburg, South Africa",
      flag: "🇿🇦",
      date: "1 week ago",
      rating: 5,
      text: "Hermanus boat-based whale watching was incredible! R1,950 for the world's best land & boat whale watching experience was great value. The Southern Right whales were so active - breaching, tail-slapping, and spy-hopping! We counted 15 whales including curious juveniles approaching our boat. The local flavours tour addition with wine tasting and traditional snacks was a nice touch. The crew's knowledge about whale behavior and conservation was impressive. Best experience between June and November!"
    },
    {
      id: "3",
      name: "Sophie Anderson",
      location: "Sydney, Australia",
      flag: "🇦🇺",
      date: "2 weeks ago",
      rating: 5,
      text: "Hermanus is truly the whale watching capital of the world! At R1,950, this boat cruise exceeded all expectations. We saw numerous Southern Right whales including mothers teaching their calves. The hydrophone let us hear their haunting songs underwater - absolutely magical! The coastal scenery is spectacular. The marine biologist onboard was incredibly knowledgeable about whale migration patterns and conservation efforts. The included local treats and wine tasting added a nice cultural touch. September to November is peak season but we saw plenty in August. Don't miss this world-class experience!"
    }
  ]
};
