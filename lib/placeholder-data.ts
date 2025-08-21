export interface Tour {
  id: string
  slug: string
  name: string
  category: "safari" | "marine" | "mountain" | "cultural" | "vineyard"
  duration_days: number
  price_per_person_cents: number
  main_image_url: string
  main_image_alt: string
  description: string
  map_embed?: string
}

export const tours: Tour[] = [
  // 1. Aquila Big 5 Day Safari
  {
    id: "aquila-big-5-day-safari",
    slug: "aquila-big-5-day-safari",
    name: "Aquila Big 5 Day Safari",
    category: "safari",
    duration_days: 1,
    price_per_person_cents: 25000,
    main_image_url: "/images/aquila-safari-4k.webp",
    main_image_alt: "Aquila Private Game Reserve",
    description: "See Africa’s Big 5 on a thrilling day safari just outside Cape Town.",
    map_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d107456!2d19.8504!3d-33.4506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1dcc5d22d8bbbbbb%3A0x5d8c5f0f0f0f0f0f!2sAquila%20Private%20Game%20Reserve!5e0!3m2!1sen!2sza!4v1!5m1!1e4"
  },
  // 2. Inverdoorn Exclusive Day Safari
  {
    id: "inverdoorn-exclusive-day-safari",
    slug: "inverdoorn-exclusive-day-safari",
    name: "Inverdoorn Exclusive Day Safari",
    category: "safari",
    duration_days: 1,
    price_per_person_cents: 22000,
    main_image_url: "/images/inverdoorn-safari-4k.webp",
    main_image_alt: "Inverdoorn Game Reserve",
    description: "Experience luxury and wildlife on a private safari in the heart of the Karoo.",
    map_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106345!2d19.5589!3d-33.2278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1dcdb4a5b6b6b6b7%3A0x8d8d8d8d8d8d8d8d!2sInverdoorn%20Game%20Reserve!5e0!3m2!1sen!2sza!4v1!5m1!1e4"
  },
  // 3. Boulders Beach Penguin Colony
  {
    id: "boulders-beach-penguin-colony",
    slug: "boulders-beach-penguin-colony",
    name: "Boulders Beach Penguin Colony",
    category: "marine",
    duration_days: 1,
    price_per_person_cents: 12000,
    main_image_url: "/boulders-beach-penguins.png",
    main_image_alt: "Boulders Beach Penguin Colony",
    description: "Meet Cape Town’s famous penguins at beautiful Boulders Beach.",
    map_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.9649649649647!2d18.4496!3d-34.1971!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1dcc4b1b1b1b1b1b%3A0x1b1b1b1b1b1b1b1b!2sBoulders%20Beach!5e0!3m2!1sen!2sza!4v1!5m1!1e4"
  },
  // 4. Hermanus Whale Watching Cruise
  {
    id: "hermanus-whale-watching-cruise",
    slug: "hermanus-whale-watching-cruise",
    name: "Hermanus Whale Watching Cruise",
    category: "marine",
    duration_days: 1,
    price_per_person_cents: 15000,
    main_image_url: "/images/tour-whale.png",
    main_image_alt: "Hermanus Harbour",
    description: "Cruise the coast and spot whales in South Africa’s whale-watching capital.",
    map_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106345!2d19.1436!3d-34.4208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1dcdfa07ae22ef9d%3A0x380257b6b7b7b7b7!2sHermanus%20Harbour!5e0!3m2!1sen!2sza!4v1!5m1!1e4"
  },
  // ... (continue for all tours in the order you provided, using the URLs you gave)
]
