export interface Tour {
  id: string
  name: string
  category: "safari" | "marine" | "mountain" | "cultural" | "vineyard"
  duration_days: number
  price_per_person_cents: number
  main_image_url: string
  main_image_alt: string
  description: string
}

export const tours: Tour[] = [
  {
    id: "hike-table-mountain",
    name: "Hike Table Mountain",
    category: "mountain",
    duration_days: 1,
    price_per_person_cents: 8500,
    main_image_url: "/images/tour-table-mountain.png",
    main_image_alt: "A stunning view of Cape Town from the top of Table Mountain at sunset.",
    description:
      "Embark on an unforgettable journey to the summit of the iconic Table Mountain. This guided hike offers breathtaking panoramic views of Cape Town, the Atlantic Ocean, and the surrounding landscapes.",
  },
  {
    id: "cape-point-penguins",
    name: "Cape Point & Penguins",
    category: "safari",
    duration_days: 1,
    price_per_person_cents: 12000,
    main_image_url: "/images/tour-penguins.png",
    main_image_alt: "African penguins waddling on the sand at Boulders Beach.",
    description:
      "Explore the dramatic coastline of the Cape Peninsula. Visit the legendary Cape of Good Hope, see the lighthouse at Cape Point, and get up close with the charming African penguin colony at Boulders Beach.",
  },
  {
    id: "shark-cage-diving",
    name: "Shark Cage Diving",
    category: "marine",
    duration_days: 1,
    price_per_person_cents: 21000,
    main_image_url: "/images/tour-shark.png",
    main_image_alt: "A great white shark breaching near a cage with divers.",
    description:
      "Experience the ultimate adrenaline rush with a shark cage diving adventure in the world-renowned Shark Alley. Come face-to-face with the majestic Great White Shark from the safety of a secure cage.",
  },
  {
    id: "winelands-tour",
    name: "Stellenbosch Winelands",
    category: "vineyard",
    duration_days: 1,
    price_per_person_cents: 9500,
    main_image_url: "/images/tour-winelands.png",
    main_image_alt: "A beautiful vineyard in Stellenbosch with mountains in the background.",
    description:
      "Indulge your senses on a tour of the picturesque Cape Winelands. Visit historic estates in Stellenbosch, enjoy premium wine tastings, and savor a gourmet lunch amidst rolling vineyards.",
  },
  {
    id: "robben-island",
    name: "Robben Island Museum",
    category: "cultural",
    duration_days: 1,
    price_per_person_cents: 6000,
    main_image_url: "/images/tour-robben-island.png",
    main_image_alt: "The entrance to the Robben Island prison museum.",
    description:
      "Take a poignant journey through South Africa's history with a tour of Robben Island. Visit the former prison where Nelson Mandela was held, guided by a former political prisoner for a deeply personal insight.",
  },
  {
    id: "whale-watching",
    name: "Hermanus Whale Watching",
    category: "marine",
    duration_days: 1,
    price_per_person_cents: 15000,
    main_image_url: "/images/tour-whale.png",
    main_image_alt: "A southern right whale breaching in the waters off Hermanus.",
    description:
      "Witness the majestic Southern Right Whales as they frolic in the waters of Walker Bay. This boat-based tour from Hermanus offers incredible opportunities for close-up sightings during the whale season.",
  },
  {
    id: "kirstenbosch-gardens",
    name: "Kirstenbosch Gardens",
    category: "mountain",
    duration_days: 1,
    price_per_person_cents: 2500,
    main_image_url: "/images/tour-kirstenbosch.png",
    main_image_alt: "The canopy walkway (Boomslang) in Kirstenbosch Botanical Gardens.",
    description:
      "Discover the beauty of Kirstenbosch Botanical Gardens, a UNESCO World Heritage Site. Explore the diverse plant life, take a stroll on the famous Boomslang Canopy Walkway, and enjoy panoramic views of Table Mountain.",
  },
  {
    id: "bo-kaap-tour",
    name: "Bo-Kaap Walking Tour",
    category: "cultural",
    duration_days: 1,
    price_per_person_cents: 3000,
    main_image_url: "/images/tour-bokaap.png",
    main_image_alt: "The colorful houses of the Bo-Kaap neighborhood in Cape Town.",
    description:
      "Immerse yourself in the vibrant culture of Bo-Kaap, a historic neighborhood in Cape Town. Explore the colorful houses, learn about the rich history of the area, and enjoy a traditional Cape Malay meal.",
  },
  {
    id: "big-five-safari",
    name: "Big Five Game Drive",
    category: "safari",
    duration_days: 2,
    price_per_person_cents: 45000,
    main_image_url: "/images/tour-safari.png",
    main_image_alt: "A majestic lion on a savanna during a game drive in South Africa.",
    description:
      "Embark on a thrilling 2-day safari in a private game reserve near Cape Town. Search for the legendary Big Five (Lion, Leopard, Elephant, Rhino, Buffalo) with experienced rangers on morning and evening game drives.",
  },
]
