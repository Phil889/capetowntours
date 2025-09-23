const fs = require('fs');
const path = require('path');

// All 21 tour slugs
const ALL_TOURS = [
  'boulders-beach-penguin-colony',
  'sea-point-promenade',
  'bo-kaap-heritage-quarter',
  'cape-town-skydive',
  'aquila-safari-tour',
  'hout-bay-harbour',
  'simon-s-town',
  'maiden-s-cove',
  'muizenberg-beach',
  'hermanus-whale-watching-tour',
  'v-a-waterfront',
  'tokara-wine-estate',
  'chapman-s-peak-drive',
  'cape-point-lighthouse',
  'shark-cage-diving-gansbaai',
  'cape-town-paragliding',
  'delaire-graff-estate',
  'inverdoorn-safari-tour',
  'atlantis-sand-dunes-adventure',
  'cape-of-good-hope',
  'babylonstoren-wine-estate'
];

// Language configurations
const LANGUAGES = {
  'en': {
    names: ['Sarah Mitchell', 'David Johnson', 'Emma Wilson', 'James Brown', 'Lisa Chen', 'Michael Davis', 'Rachel Green', 'Thomas Anderson', 'Amanda Foster', 'Robert Kim'],
    locations: ['London, UK', 'New York, USA', 'Sydney, Australia', 'Toronto, Canada', 'San Francisco, USA', 'Melbourne, Australia', 'Chicago, USA', 'Vancouver, Canada', 'Los Angeles, USA', 'Boston, USA']
  },
  'de': {
    names: ['Petra Müller', 'Klaus Schmidt', 'Sabine Weber', 'Thomas Becker', 'Andrea Fischer', 'Michael Hoffmann', 'Julia Richter', 'Ralf Wagner', 'Martina Klein', 'Stefan Braun'],
    locations: ['München, Deutschland', 'Hamburg, Deutschland', 'Berlin, Deutschland', 'Frankfurt, Deutschland', 'Stuttgart, Deutschland', 'Köln, Deutschland', 'Düsseldorf, Deutschland', 'Nürnberg, Deutschland', 'Wien, Österreich', 'Zürich, Schweiz']
  },
  'fr': {
    names: ['Marie Dubois', 'Pierre Martin', 'Sophie Leroy', 'Jean-Claude Bernard', 'Isabelle Moreau', 'Laurent Petit', 'Céline Rousseau', 'Antoine Girard', 'Valérie Thomas', 'Thierry Blanc'],
    locations: ['Paris, France', 'Lyon, France', 'Marseille, France', 'Toulouse, France', 'Nice, France', 'Strasbourg, France', 'Bordeaux, France', 'Nantes, France', 'Cannes, France', 'Montpellier, France']
  },
  'es': {
    names: ['María González', 'Carlos Rodríguez', 'Ana Martínez', 'José López', 'Laura Fernández', 'Miguel Herrera', 'Carmen Silva', 'Roberto Morales', 'Patricia Ruiz', 'Alejandro Torres'],
    locations: ['Madrid, España', 'Barcelona, España', 'Valencia, España', 'Sevilla, España', 'Bilbao, España', 'Zaragoza, España', 'Granada, España', 'Málaga, España', 'Murcia, España', 'Palma, España']
  },
  'ar': {
    names: ['فاطمة أحمد', 'محمد العلي', 'عائشة محمد', 'عبد الله السالم', 'مريم خالد', 'أحمد حسن', 'نورا القحطاني', 'خالد المنصوري', 'سارة الزهراني', 'يوسف الشامي'],
    locations: ['دبي، الإمارات العربية المتحدة', 'الرياض، السعودية', 'القاهرة، مصر', 'الكويت، الكويت', 'أبوظبي، الإمارات العربية المتحدة', 'جدة، السعودية', 'الدوحة، قطر', 'المنامة، البحرين', 'عمان، الأردن', 'بيروت، لبنان']
  }
};

// Tour-specific review templates
const TOUR_DATA = {
  'boulders-beach-penguin-colony': {
    type: 'wildlife',
    keywords: ['penguins', 'African penguins', 'boardwalk', 'conservation', 'wildlife', 'beach', 'granite boulders'],
    experience_types: ['wildlife', 'family', 'photography', 'conservation', 'educational']
  },
  'sea-point-promenade': {
    type: 'fitness',
    keywords: ['promenade', 'ocean views', 'outdoor gym', 'jogging', 'sunset', 'exercise', 'tidal pools'],
    experience_types: ['fitness', 'family', 'photography', 'exercise', 'sunset']
  },
  'bo-kaap-heritage-quarter': {
    type: 'cultural',
    keywords: ['colorful houses', 'Cape Malay', 'heritage', 'culture', 'cobblestone', 'spices', 'mosque'],
    experience_types: ['cultural', 'historical', 'culinary', 'photography', 'guided_tour']
  },
  'cape-town-skydive': {
    type: 'adventure',
    keywords: ['skydiving', 'tandem jump', 'freefall', 'aerial views', 'adrenaline', 'Table Mountain views'],
    experience_types: ['adrenaline', 'adventure', 'bucket_list', 'photography', 'celebration']
  },
  'aquila-safari-tour': {
    type: 'wildlife',
    keywords: ['Big 5', 'safari', 'game reserve', 'lions', 'elephants', 'rhinos', 'conservation'],
    experience_types: ['wildlife', 'safari', 'family', 'photography', 'conservation']
  },
  'hout-bay-harbour': {
    type: 'cultural',
    keywords: ['fishing harbour', 'seal watching', 'boat trips', 'fresh seafood', 'working harbour'],
    experience_types: ['cultural', 'wildlife', 'family', 'culinary', 'authentic']
  },
  'simon-s-town': {
    type: 'historical',
    keywords: ['naval town', 'Victorian architecture', 'naval museum', 'harbor', 'train journey'],
    experience_types: ['historical', 'family', 'military_history', 'scenic_journey', 'architecture']
  },
  'maiden-s-cove': {
    type: 'scenic',
    keywords: ['beach', 'sunset', 'swimming', 'Atlantic seaboard', 'Twelve Apostles', 'romantic'],
    experience_types: ['romantic', 'beach', 'sunset', 'swimming', 'photography']
  },
  'muizenberg-beach': {
    type: 'beach',
    keywords: ['colorful huts', 'surfing', 'False Bay', 'family beach', 'warm water', 'beginner surfing'],
    experience_types: ['surfing', 'family', 'beach', 'photography', 'beginner_friendly']
  },
  'hermanus-whale-watching-tour': {
    type: 'wildlife',
    keywords: ['whales', 'Southern Right whales', 'whale watching', 'marine life', 'cliff walks'],
    experience_types: ['wildlife', 'marine', 'photography', 'seasonal', 'educational']
  },
  'v-a-waterfront': {
    type: 'entertainment',
    keywords: ['shopping', 'restaurants', 'entertainment', 'harbor', 'Two Oceans Aquarium', 'markets'],
    experience_types: ['shopping', 'family', 'entertainment', 'dining', 'tourist']
  },
  'tokara-wine-estate': {
    type: 'wine',
    keywords: ['wine tasting', 'vineyards', 'Stellenbosch', 'wine pairing', 'mountain views'],
    experience_types: ['wine_tasting', 'culinary', 'romantic', 'luxury', 'scenic']
  },
  'chapman-s-peak-drive': {
    type: 'scenic',
    keywords: ['scenic drive', 'coastal road', 'mountain views', 'photography', 'dramatic cliffs'],
    experience_types: ['scenic_drive', 'photography', 'romantic', 'sightseeing', 'road_trip']
  },
  'cape-point-lighthouse': {
    type: 'scenic',
    keywords: ['lighthouse', 'Cape of Good Hope', 'funicular', 'two oceans', 'southernmost tip'],
    experience_types: ['sightseeing', 'historical', 'photography', 'educational', 'scenic']
  },
  'shark-cage-diving-gansbaai': {
    type: 'adventure',
    keywords: ['sharks', 'Great White sharks', 'cage diving', 'marine adventure', 'adrenaline'],
    experience_types: ['adrenaline', 'marine', 'adventure', 'wildlife', 'extreme']
  },
  'cape-town-paragliding': {
    type: 'adventure',
    keywords: ['paragliding', 'tandem flight', 'Signal Hill', 'aerial views', 'adventure sports'],
    experience_types: ['adrenaline', 'adventure', 'aerial', 'photography', 'scenic']
  },
  'delaire-graff-estate': {
    type: 'luxury',
    keywords: ['luxury wine estate', 'fine dining', 'wine tasting', 'art collection', 'mountain views'],
    experience_types: ['luxury', 'wine_tasting', 'fine_dining', 'romantic', 'art']
  },
  'inverdoorn-safari-tour': {
    type: 'wildlife',
    keywords: ['safari', 'cheetahs', 'game reserve', 'conservation', 'big cats', 'wildlife photography'],
    experience_types: ['wildlife', 'safari', 'conservation', 'photography', 'educational']
  },
  'atlantis-sand-dunes-adventure': {
    type: 'adventure',
    keywords: ['sand dunes', 'sandboarding', 'quad biking', 'desert adventure', 'white sands'],
    experience_types: ['adventure', 'sandboarding', 'extreme', 'photography', 'unique']
  },
  'cape-of-good-hope': {
    type: 'scenic',
    keywords: ['Cape Point', 'nature reserve', 'baboons', 'lighthouse', 'two oceans meet'],
    experience_types: ['sightseeing', 'nature', 'wildlife', 'photography', 'historical']
  },
  'babylonstoren-wine-estate': {
    type: 'wine',
    keywords: ['historic wine estate', 'gardens', 'farm-to-table', 'wine tasting', 'heritage'],
    experience_types: ['wine_tasting', 'gardens', 'culinary', 'historical', 'luxury']
  }
};

// Generate comprehensive reviews for all tours
function generateAllReviews() {
  console.log('Generating comprehensive reviews for all 21 tours in all 5 languages...');
  console.log('Total reviews to generate: ' + (21 * 5 * 8) + ' to ' + (21 * 5 * 10));
  
  // This is a placeholder - the actual generation would require the full implementation
  // For now, let's just log the structure
  ALL_TOURS.forEach(tour => {
    Object.keys(LANGUAGES).forEach(lang => {
      console.log(`${tour} - ${lang}: 8-10 reviews needed`);
    });
  });
}

// Check current coverage
function checkCurrentCoverage() {
  const files = [
    'complete-english-reviews.json',
    'complete-german-reviews.json',
    'complete-french-reviews.json',
    'complete-spanish-reviews.json',
    'complete-arabic-reviews.json'
  ];
  
  files.forEach(file => {
    try {
      const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
      const reviews = JSON.parse(content);
      const tourCoverage = {};
      
      reviews.forEach(review => {
        if (!tourCoverage[review.tour_slug]) {
          tourCoverage[review.tour_slug] = 0;
        }
        tourCoverage[review.tour_slug]++;
      });
      
      console.log(`\\n${file}:`);
      console.log(`Total reviews: ${reviews.length}`);
      console.log('Tour coverage:');
      ALL_TOURS.forEach(tour => {
        const count = tourCoverage[tour] || 0;
        console.log(`  ${tour}: ${count} reviews`);
      });
      
    } catch (error) {
      console.log(`Error reading ${file}:`, error.message);
    }
  });
}

if (require.main === module) {
  checkCurrentCoverage();
  generateAllReviews();
}

module.exports = {
  ALL_TOURS,
  LANGUAGES,
  TOUR_DATA,
  checkCurrentCoverage,
  generateAllReviews
};