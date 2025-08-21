// Complete the last review and add the function
export interface Review {
  id: string;
  name: string;
  location: string;
  flag: string;
  countryCode?: string; // Added for flag display
  date: string;
  rating: number;
  text: string;
}

// Hermanus whale watching completion
const hermanusComplete = {
  id: "2",
  name: "Johann van der Merwe",
  location: "Johannesburg, South Africa",
  flag: "🇿🇦",
  date: "1 week ago",
  rating: 5,
  text: "Hermanus boat-based whale watching was incredible! R1,950 for the world's best land & boat whale watching experience was great value. The Southern Right whales were so active - breaching, tail-slapping, and spy-hopping! We counted 15 whales including curious juveniles approaching our boat. The local flavours tour addition with wine tasting and traditional snacks was a nice touch. The crew's knowledge about whale behavior and conservation was impressive. The hydrophone recordings of whale communication were haunting and beautiful. Hermanus truly is the whale watching capital - the cliff paths offer additional viewing spots. Best experience between June and November!"
};

// Additional tour reviews for other tours
export const additionalTourReviews: Record<string, Review[]> = {
  "inverdoorn-exclusive-day-safari": [
    {
      id: "1",
      name: "Anna Svensson",
      location: "Stockholm, Sweden",
      flag: "🇸🇪",
      date: "3 days ago",
      rating: 5,
      text: "Inverdoorn Exclusive Day Safari was exceptional! At R3,800 per person, escaping the crowds for intimate wildlife encounters was worth every cent. The reserve's dedication to conservation is evident everywhere - from the cheetah rehabilitation center to anti-poaching units. We saw the Big 5 in their natural habitat without the crowds of larger reserves. The exclusive nature means maximum 12 guests - creating personal, unhurried experiences. The rangers' knowledge was encyclopedic. The gourmet bush lunch was unexpected luxury. The cheetah run demonstration showcasing their 120km/h speed was breathtaking. This is how safari should be done - intimate, educational, and conservation-focused. Perfect escape from Cape Town!"
    },
    {
      id: "2",
      name: "Roberto Martinez",
      location: "Madrid, Spain",
      flag: "🇪🇸",
      date: "1 week ago",
      rating: 5,
      text: "¡Inverdoorn safari exclusivo fue increíble! The R3,800 exclusive day safari delivered intimate wildlife encounters beyond expectations. Escaping crowds while maintaining world-class wildlife viewing was perfect. The conservation dedication is impressive - successful breeding programs for endangered species, wildlife rehabilitation, and community education. We had close encounters with all Big 5 plus cheetahs, giraffes, and hippos. The small group size meant personalized attention from expert rangers. The authentic African lunch in the bush was delicious. Learning about the Karoo ecosystem was fascinating. The reserve's commitment to ethical wildlife tourism is commendable. This exclusive experience is perfect for discerning travelers!"
    }
  ],
  
  "aquila-big-5-day-safari": [
    {
      id: "1",
      name: "Mark Thompson",
      location: "Sydney, Australia",
      flag: "🇦🇺",
      date: "4 days ago",
      rating: 5,
      text: "Aquila Big 5 Day Safari - swapping city for roaring lions was incredible! At R3,400, Cape Town's closest Big 5 adventure delivered beyond expectations. Just 2 hours from the city, we encountered towering elephants, majestic lions, massive rhinos, Cape buffalo, and even spotted a leopard! The 10,000-hectare reserve in the Karoo is well-managed with healthy, happy animals. Our ranger's expertise in tracking and animal behavior was impressive. The 4x4 game vehicle provided excellent viewing and photo opportunities. The traditional South African lunch was delicious. The reserve's rehabilitation center does important conservation work. This malaria-free safari is perfect for families and those with limited time. Absolutely the best value Big 5 experience near Cape Town!"
    },
    {
      id: "2",
      name: "Francesca Romano",
      location: "Rome, Italy",
      flag: "🇮🇹",
      date: "1 week ago",
      rating: 5,
      text: "Aquila Safari - from Cape Town city to roaring lions in 2 hours! R3,400 for the closest Big 5 adventure to Cape Town was fantastico! Swapping city stress for towering elephants and majestic wildlife was therapeutic. We saw all Big 5 including a pride of lions with cubs! The Karoo landscape is dramatically beautiful. Our guide's passion for conservation was infectious. The game drive vehicle was comfortable with great visibility. The authentic braai lunch was delicious. Learning about their rescue and rehabilitation programs was inspiring. The malaria-free environment makes it safe for everyone. This is the perfect introduction to African safari without traveling far!"
    }
  ],
  
  // Scenic tours
  "chapmans-peak-drive": [
    {
      id: "1",
      name: "Jessica Moore",
      location: "London, UK",
      flag: "🇬🇧",
      date: "3 days ago",
      rating: 5,
      text: "Chapman's Peak Drive is absolutely breathtaking! At R350 for the guided tour, experiencing the 114 hair-pin bends hugging sandstone cliffs high above the Atlantic was thrilling! Every kilometer offers postcard-worthy panoramas - our guide knew all the best viewpoints for photos. The engineering marvel of carving this road into the cliffside is impressive. The views of Hout Bay, Noordhoek Beach, and the Atlantic Ocean are spectacular. We stopped at several lookout points including the famous sunset spot. Learning about the road's history and construction challenges was fascinating. The dramatic coastline rivals anything in Europe. This scenic drive is an absolute must-do when visiting Cape Town!"
    },
    {
      id: "2",
      name: "Hiroshi Yamamoto",
      location: "Tokyo, Japan",
      flag: "🇯🇵",
      date: "1 week ago",
      rating: 5,
      text: "チャップマンズピーク最高! Chapman's Peak Drive's 114 curves hugging cliffs above the Atlantic was exhilarating! The R350 guided tour included fascinating engineering stories about this sandstone cliff road. Every turn revealed postcard-worthy panoramas of ocean and mountains. Our guide's knowledge of photo spots was invaluable - the sunset viewpoint was magical! The hair-pin bends are thrilling yet feel completely safe. Views of seals, whales (in season), and seabirds added to the experience. The dramatic coastline is one of the world's most scenic drives. Combined with Cape Point tour for the perfect Peninsula day!"
    }
  ],
  
  "cape-of-good-hope": [
    {
      id: "1",
      name: "Klaus Weber",
      location: "Berlin, Germany",
      flag: "🇩🇪",
      date: "2 days ago",
      rating: 5,
      text: "Cape of Good Hope - Africa's southwestern tip was emotional! At R350, trekking windswept headlands and snapping the iconic signpost photo was a bucket-list moment. Watching for ostriches and baboons while exploring this mythical point where oceans meet was surreal. The dramatic cliffs and pounding waves create an atmosphere of raw natural power. Our guide shared stories of shipwrecks and early explorers rounding the Cape. The endemic fynbos vegetation is unique and beautiful. We spotted eland, bontebok, and Cape mountain zebras. The hiking trails offer spectacular views. This historically significant landmark where Bartolomeu Dias proved the sea route to India is unmissable!"
    },
    {
      id: "2",
      name: "Ana Silva",
      location: "Lisbon, Portugal",
      flag: "🇵🇹",
      date: "1 week ago",
      rating: 5,
      text: "Cape of Good Hope é espetacular! Following Portuguese navigator Dias's footsteps to Africa's southwestern tip was powerful! The R350 tour to this windswept headland was perfectly organized. The iconic signpost photo is mandatory - standing where Atlantic meets Indian Ocean! Watching for wildlife while trekking the headlands was exciting - we saw ostriches, baboons, and various antelope. The dramatic coastline with massive waves crashing against cliffs is mesmerizing. Learning about the Cape's maritime history and numerous shipwrecks was sobering. The unique vegetation adapted to harsh conditions is fascinating. This is where history and nature combine perfectly!"
    }
  ]
};

// Function to get reviews for a specific tour
export function getTourSpecificReviews(tourSlug: string): Review[] {
  // Import from the main tour-specific-reviews file
  const tourSpecificReviews = require('./tour-specific-reviews').tourSpecificReviews;
  const { addCountryCodesToReviews } = require('./tour-reviews-helper');
  
  // Check if we have specific reviews for this tour
  if (tourSpecificReviews[tourSlug]) {
    // Fix any incomplete reviews
    let reviews = [...tourSpecificReviews[tourSlug]];
    
    // Special case for hermanus which was cut off
    if (tourSlug === 'hermanus-whale-watching-cruise' && reviews.length === 2) {
      reviews[1] = hermanusComplete;
    }
    
    return addCountryCodesToReviews(reviews);
  }
  
  // Check additional reviews
  if (additionalTourReviews[tourSlug]) {
    return addCountryCodesToReviews(additionalTourReviews[tourSlug]);
  }
  
  // Return type-specific reviews based on tour name
  if (tourSlug.includes('wine') || tourSlug.includes('estate')) {
    const reviews = tourSpecificReviews['tokara-wine-estate'] || [];
    return addCountryCodesToReviews(reviews);
  }
  
  if (tourSlug.includes('safari') || tourSlug.includes('game')) {
    const reviews = tourSpecificReviews['aquila-big-5-day-safari'] || additionalTourReviews['aquila-big-5-day-safari'] || [];
    return addCountryCodesToReviews(reviews);
  }
  
  if (tourSlug.includes('penguin') || tourSlug.includes('boulders')) {
    const reviews = tourSpecificReviews['boulders-beach-penguin-colony'] || [];
    return addCountryCodesToReviews(reviews);
  }
  
  if (tourSlug.includes('table-mountain')) {
    const reviews = tourSpecificReviews['table-mountain-cableway'] || [];
    return addCountryCodesToReviews(reviews);
  }
  
  if (tourSlug.includes('cape-point') || tourSlug.includes('good-hope')) {
    const reviews = tourSpecificReviews['cape-of-good-hope'] || additionalTourReviews['cape-of-good-hope'] || [];
    return addCountryCodesToReviews(reviews);
  }
  
  if (tourSlug.includes('shark') || tourSlug.includes('diving')) {
    const reviews = tourSpecificReviews['gansbaai-shark-cage-diving'] || [];
    return addCountryCodesToReviews(reviews);
  }
  
  if (tourSlug.includes('whale')) {
    const reviews = tourSpecificReviews['hermanus-whale-watching-cruise'] || [];
    return addCountryCodesToReviews(reviews);
  }
  
  // Default reviews for tours without specific reviews
  const defaultReviews = [
    {
      id: "1",
      name: "John Smith",
      location: "London, UK",
      flag: "🇬🇧",
      date: "3 days ago",
      rating: 5,
      text: `This ${tourSlug.replace(/-/g, ' ')} tour was absolutely fantastic! The organization from start to finish was flawless. Our guide was incredibly knowledgeable about the area's history, ecology, and culture. The experience exceeded all our expectations - from the convenient hotel pickup to the carefully planned itinerary that maximized our time. The small group size made it feel personal and exclusive. Photography opportunities were abundant with the guide knowing all the best spots. Safety was clearly a priority throughout. The value for money considering everything included was outstanding. This is a must-do experience when visiting Cape Town. We've traveled extensively and this ranks among our best tour experiences globally!`
    },
    {
      id: "2",
      name: "Marie Dubois",
      location: "Paris, France",
      flag: "🇫🇷",
      date: "1 week ago",
      rating: 5,
      text: `Magnifique! The ${tourSlug.replace(/-/g, ' ')} experience was exceptional from beginning to end. Our guide's passion and expertise made every moment special. The attention to detail was impressive - from comfortable transportation to perfectly timed stops. We learned so much about local culture, history, and nature. The scenic views were breathtaking and photo opportunities endless. The tour was well-paced, never feeling rushed yet covering everything promised. Safety standards were excellent throughout. This experience offered incredible value and created lasting memories. Highly recommended for anyone visiting Cape Town!`
    },
    {
      id: "3",
      name: "Takeshi Yamada",
      location: "Tokyo, Japan",
      flag: "🇯🇵",
      date: "2 weeks ago",
      rating: 5,
      text: `素晴らしい! The ${tourSlug.replace(/-/g, ' ')} tour was perfectly executed! The organization and attention to detail were impressive. Our guide was professional, knowledgeable, and accommodating. The experience showcased the best of what Cape Town has to offer. Transportation was comfortable and punctual. The itinerary was well-designed to maximize our experience. Photo opportunities were excellent with the guide's expert positioning advice. Safety was never a concern with clear instructions and professional management. Excellent value for the comprehensive experience provided. This is an essential Cape Town experience!`
    }
  ];
  
  return addCountryCodesToReviews(defaultReviews);
}
