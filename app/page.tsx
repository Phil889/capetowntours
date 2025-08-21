"use client";
import { useEffect, useState } from "react";
import { TourCard } from "@/components/tours/tour-card";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShieldCheck, Users, Wallet, Car, Star } from "lucide-react";

import type { Tour } from "@/lib/placeholder-data";

const SIGNATURE_SLUGS = [
  "aquila-big-5-day-safari",
  "inverdoorn-exclusive-day-safari",
  "boulders-beach-penguin-colony",
  "hermanus-whale-watching-cruise"
];

export default function HomePage() {
  const [tours, setTours] = useState<Tour[]>([]);

  useEffect(() => {
    async function fetchSignatureTours() {
      // Fetch tours by slug from Supabase
      const { data, error } = await supabase
        .from("tours")
        .select(
          "id, slug, title, description, price, price_from_zar, category, duration_days, image_url, image_alt_text, map_embed"
        )
        .in("slug", SIGNATURE_SLUGS);

      if (error) {
        console.error("Failed to fetch tours:", error);
        return;
      }

      // Map Supabase data to Tour type
      const mapped: Tour[] = SIGNATURE_SLUGS.map((slug) => {
        const t = data?.find((tour) => tour.slug === slug);
        if (!t) return null;
        return {
          id: t.id,
          slug: t.slug,
          name: t.title,
          category: t.category,
          duration_days: t.duration_days,
          price_per_person_cents: t.price_from_zar
            ? t.price_from_zar * 100
            : t.price
            ? Math.round(Number(t.price) * 100)
            : 0,
          main_image_url: t.image_url,
          main_image_alt: t.image_alt_text || t.title,
          description: t.description,
          map_embed: t.map_embed
        };
      }).filter(Boolean) as Tour[];

      setTours(mapped);
    }

    fetchSignatureTours();
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      <section className="w-full relative min-h-screen py-0 px-0">
        {/* Background slider */}
        <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
          {(() => {
            const heroImages = [
              "/safari-elephants-river.png",
              "/safari-giraffe-sunset.webp",
              "/safari-leopard-tree.png"
            ];
            const [current, setCurrent] = useState(0);
            useEffect(() => {
              const interval = setInterval(() => {
                setCurrent((prev) => (prev + 1) % heroImages.length);
              }, 5000); // 5 seconds per image
              return () => clearInterval(interval);
            }, []);
            return (
              <div className="w-full h-full flex">
                <img
                  src={heroImages[current]}
                  alt="Safari Hero"
                  className="w-full h-full object-cover object-top"
                  draggable={false}
                />
                <div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0) 100%)"
                  }}
                ></div>
              </div>
            );
          })()}
        </div>
        <div className="relative z-20 max-w-6xl mx-auto flex flex-col items-center text-center min-h-screen justify-center">
<h1 className="font-playfair text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-[#D4B796] via-[#E59A59] to-[#BFA76A] bg-clip-text text-transparent drop-shadow-lg tracking-tight">
            Cape Town's #1 <br></br>Private Tours & Luxury Safaris
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 mb-8 max-w-3xl font-medium">
            Unforgettable adventures, handpicked by local experts. Experience the best safaris, wine tours, and cultural journeys in South Africa—guaranteed.
          </p>
          <a
            href="#tours"
            className="inline-block px-12 py-5 bg-white/20 border border-white/40 text-white rounded-full font-bold text-2xl shadow-xl backdrop-blur-md hover:bg-white/30 transition"
          >
            Explore Top Rated Tours & Safaris
          </a>
          <div className="mt-10 flex flex-wrap justify-center items-center gap-16 w-full">
            <img
              src="/tripadvisor.png"
              alt="TripAdvisor Top Rated"
              className="h-28 w-auto object-contain"
              loading="lazy"
              style={{ maxHeight: "112px", maxWidth: "220px" }}
            />
            <img
              src="/best price cape ton privat tours.png"
              alt="Best Price Cape Town Private Tours"
              className="h-28 w-auto object-contain"
              loading="lazy"
              style={{ maxHeight: "112px", maxWidth: "220px" }}
            />
            <img
              src="/privat tours cape town trusted seller.png"
              alt="Cape Town Private Tours Trusted Seller"
              className="h-28 w-auto object-contain"
              loading="lazy"
              style={{ maxHeight: "112px", maxWidth: "220px" }}
            />
            <img
              src="/viator.png"
              alt="Viator Experience Awards"
              className="h-28 w-auto object-contain"
              loading="lazy"
              style={{ maxHeight: "112px", maxWidth: "220px" }}
            />
            <img
              src="/best-cape-town-safari-choice-guarantee.webp"
              alt="Certified Eco Tourism Provider"
              className="h-28 w-auto object-contain"
              loading="lazy"
              style={{ maxHeight: "112px", maxWidth: "220px" }}
            />
          </div>
        </div>
      </section>

      {/* SIGNATURE SAFARIS */}
      <section id="tours" className="py-16 sm:py-24">
        <div className="container">
          <h2 className="font-montserrat mb-4 text-center text-3xl font-bold md:text-4xl">Our Signature Safaris</h2>
          <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">Start your adventure with one of our most popular, hand-crafted tours. Each one is a private experience, designed to create memories that last a lifetime.</p>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US - PREMIUM REDESIGN */}
      <section
        className="relative py-28 overflow-hidden"
        style={{
          background:
            "linear-gradient(120deg, #2d1a05 0%, #bfa76a 100%), url('/Best Lion Safari Cape Town.webp') center/cover no-repeat",
          backgroundBlendMode: "overlay",
        }}
      >
        {/* Gold shimmer overlay */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-yellow-100/10 via-yellow-400/10 to-transparent animate-pulse" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center">
          {/* Tagline */}
          <span className="uppercase tracking-widest text-lg font-semibold text-yellow-400 mb-2 drop-shadow-lg">
            Why Choose Us
          </span>
          {/* Heading */}
          <h2
            className="font-playfair text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#D4B796] via-[#E59A59] to-[#BFA76A] drop-shadow-2xl text-center mb-4"
            style={{
              letterSpacing: "-0.02em",
            }}
          >
            The Cape Town Safari Tours Difference
          </h2>
          {/* Subheading */}
          <p className="text-2xl md:text-2xl text-white/90 mb-12 max-w-3xl text-center font-medium">
            We're not just another tour company. We're local experts dedicated to crafting your perfect, private adventure.
          </p>
          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 w-full">
            {/* Card 1 */}
            <div className="group relative bg-white/20 backdrop-blur-lg border border-yellow-400/60 rounded-3xl shadow-2xl p-8 flex flex-col items-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-gold-glow animate-fade-in-up">
              <div className="flex items-center justify-center mb-5">
                <Users className="h-14 w-14 text-yellow-100 group-hover:text-yellow-300 transition-colors duration-300 drop-shadow-lg" />
                <span className="absolute top-2 right-2 animate-sparkle text-yellow-300 text-xs">★</span>
              </div>
              <h3 className="font-playfair text-2xl font-bold text-yellow-100 mb-2 text-center drop-shadow">
                Truly Private & Customizable
              </h3>
              <p className="text-white/90 text-center">
                Your tour, your pace. No strangers, just your group. We tailor every detail to your interests.
              </p>
            </div>
            {/* Card 2 */}
            <div className="group relative bg-white/20 backdrop-blur-lg border border-yellow-400/60 rounded-3xl shadow-2xl p-8 flex flex-col items-center transition-transform duration-300 hover:-translate-y-4 hover:shadow-gold-glow animate-fade-in-up delay-100">
              <div className="flex items-center justify-center mb-5">
                <ShieldCheck className="h-14 w-14 text-yellow-100 group-hover:text-yellow-300 transition-colors duration-300 drop-shadow-lg" />
                <span className="absolute top-2 right-2 animate-sparkle text-yellow-300 text-xs">★</span>
              </div>
              <h3 className="font-playfair text-2xl font-bold text-yellow-100 mb-2 text-center drop-shadow">
                Expert Local Guides
              </h3>
              <p className="text-white/90 text-center">
                Our guides are your personal storytellers and wildlife experts, born and raised in Cape Town.
              </p>
            </div>
            {/* Card 3 */}
            <div className="group relative bg-white/20 backdrop-blur-lg border border-yellow-400/60 rounded-3xl shadow-2xl p-8 flex flex-col items-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-gold-glow animate-fade-in-up delay-200">
              <div className="flex items-center justify-center mb-5">
                <Wallet className="h-14 w-14 text-yellow-100 group-hover:text-yellow-300 transition-colors duration-300 drop-shadow-lg" />
                <span className="absolute top-2 right-2 animate-sparkle text-yellow-300 text-xs">★</span>
              </div>
              <h3 className="font-playfair text-2xl font-bold text-yellow-100 mb-2 text-center drop-shadow">
                All-Inclusive, Transparent Pricing
              </h3>
              <p className="text-white/90 text-center">
                No hidden fees or surprises. The price you see is the price you pay for your complete experience.
              </p>
            </div>
            {/* Card 4 */}
            <div className="group relative bg-white/20 backdrop-blur-lg border border-yellow-400/60 rounded-3xl shadow-2xl p-8 flex flex-col items-center transition-transform duration-300 hover:-translate-y-4 hover:shadow-gold-glow animate-fade-in-up delay-300">
              <div className="flex items-center justify-center mb-5">
                <Car className="h-14 w-14 text-yellow-100 group-hover:text-yellow-300 transition-colors duration-300 drop-shadow-lg" />
                <span className="absolute top-2 right-2 animate-sparkle text-yellow-300 text-xs">★</span>
              </div>
              <h3 className="font-playfair text-2xl font-bold text-yellow-100 mb-2 text-center drop-shadow">
                Modern Comfort & Safety
              </h3>
              <p className="text-white/90 text-center">
                Travel in our modern, air-conditioned, and impeccably maintained fleet for your comfort and safety.
              </p>
            </div>
          </div>
          {/* Optional: Trusted badge or testimonial */}
          <div className="mt-12 flex flex-col items-center">
            <span className="inline-block bg-yellow-400/90 text-yellow-900 font-bold px-6 py-2 rounded-full shadow-lg text-lg tracking-wide uppercase">
              Trusted by 10,000+ travelers
            </span>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container">
          <h2 className="font-montserrat mb-12 text-center text-3xl font-bold md:text-4xl">Don't Just Take Our Word For It</h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="bg-gray-50 p-8 rounded-lg border">
              <div className="flex mb-2">
                <Star className="text-yellow-400 fill-yellow-400" />
                <Star className="text-yellow-400 fill-yellow-400" />
                <Star className="text-yellow-400 fill-yellow-400" />
                <Star className="text-yellow-400 fill-yellow-400" />
                <Star className="text-yellow-400 fill-yellow-400" />
              </div>
              <p className="text-gray-600 mb-4 italic">"The best tour we've ever been on! Our guide, James, was incredibly knowledgeable and made the whole experience unforgettable. The private tour was worth every penny."</p>
              <p className="font-bold text-gray-800">- Sarah & Tom, UK</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg border">
              <div className="flex mb-2">
                <Star className="text-yellow-400 fill-yellow-400" />
                <Star className="text-yellow-400 fill-yellow-400" />
                <Star className="text-yellow-400 fill-yellow-400" />
                <Star className="text-yellow-400 fill-yellow-400" />
                <Star className="text-yellow-400 fill-yellow-400" />
              </div>
              <p className="text-gray-600 mb-4 italic">"From the easy booking process to the final drop-off, everything was seamless. We saw the Big 5 and so much more. Highly recommend this company!"</p>
              <p className="font-bold text-gray-800">- Michael B, USA</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg border">
              <div className="flex mb-2">
                <Star className="text-yellow-400 fill-yellow-400" />
                <Star className="text-yellow-400 fill-yellow-400" />
                <Star className="text-yellow-400 fill-yellow-400" />
                <Star className="text-yellow-400 fill-yellow-400" />
                <Star className="text-yellow-400 fill-yellow-400" />
              </div>
              <p className="text-gray-600 mb-4 italic">"A truly magical experience. The attention to detail and personal touches made our honeymoon safari so special. We'll be back!"</p>
              <p className="font-bold text-gray-800">- Anika & Rohan, India</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - PREMIUM REDESIGN */}
      <section
        className="relative py-28 overflow-hidden"
        style={{
          background:
            "linear-gradient(120deg, #2d1a05 0%, #6b4c1b 100%), url('/safari-elephants-river.png') center/cover no-repeat",
          backgroundBlendMode: "overlay",
        }}
      >
        {/* Dark overlay for contrast */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="w-full h-full bg-black/60" />
          <div className="w-full h-full bg-gradient-to-br from-yellow-900/10 via-yellow-700/10 to-transparent" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          {/* Tagline */}
          <span className="uppercase tracking-widest text-lg font-semibold text-yellow-400 mb-2 drop-shadow-lg">
            How It Works
          </span>
          {/* Heading */}
          <h2
            className="font-playfair text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#D4B796] via-[#E59A59] to-[#BFA76A] drop-shadow-2xl text-center mb-12"
            style={{
              letterSpacing: "0em",
              wordSpacing: "0.05em",
              paddingBottom: "5px",
            }}
          >
            Your Adventure in 3 Simple Steps
          </h2>
          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full">
            {/* Step 1 */}
            <div className="group relative bg-black/40 backdrop-blur-lg border border-yellow-700/60 rounded-3xl shadow-2xl p-10 flex flex-col items-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-gold-glow animate-fade-in-up">
              <span className="text-7xl font-extrabold text-yellow-200 group-hover:text-yellow-300 transition-colors duration-300 font-playfair mb-4 drop-shadow-lg">1</span>
              <h3 className="font-playfair text-2xl font-bold text-yellow-100 mb-2 text-center drop-shadow">
                Choose Your Adventure
              </h3>
              <p className="text-yellow-100/90 text-center font-medium">
                Browse our curated signature tours or tell us your dream trip.
              </p>
            </div>
            {/* Step 2 */}
            <div className="group relative bg-black/40 backdrop-blur-lg border border-yellow-700/60 rounded-3xl shadow-2xl p-10 flex flex-col items-center transition-transform duration-300 hover:-translate-y-4 hover:shadow-gold-glow animate-fade-in-up delay-100">
              <span className="text-7xl font-extrabold text-yellow-200 group-hover:text-yellow-300 transition-colors duration-300 font-playfair mb-4 drop-shadow-lg">2</span>
              <h3 className="font-playfair text-2xl font-bold text-yellow-100 mb-2 text-center drop-shadow">
                Customize Your Trip
              </h3>
              <p className="text-yellow-100/90 text-center font-medium">
                We'll work with you to tailor the itinerary, activities, and pace to your liking.
              </p>
            </div>
            {/* Step 3 */}
            <div className="group relative bg-black/40 backdrop-blur-lg border border-yellow-700/60 rounded-3xl shadow-2xl p-10 flex flex-col items-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-gold-glow animate-fade-in-up delay-200">
              <span className="text-7xl font-extrabold text-yellow-200 group-hover:text-yellow-300 transition-colors duration-300 font-playfair mb-4 drop-shadow-lg">3</span>
              <h3 className="font-playfair text-2xl font-bold text-yellow-100 mb-2 text-center drop-shadow">
                Book & Get Excited
              </h3>
              <p className="text-yellow-100/90 text-center font-medium">
                Secure your dates and get ready for the private Cape Town adventure of a lifetime!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TOUR CATEGORIES */}
      <section className="py-16 sm:py-24">
        <div className="container">
          <h2 className="font-montserrat mb-12 text-center text-3xl font-bold md:text-4xl">Find Your Perfect Escape</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <a href="/tours/safari" className="group relative block h-96 rounded-lg overflow-hidden shadow-lg">
<img src="/safari-giraffe-sunset.webp" alt="Big 5 Safaris" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative h-full flex items-center justify-center">
                <h3 className="text-4xl font-bold text-white text-center drop-shadow-md">Big 5 Safaris</h3>
              </div>
            </a>
            <a href="/tours/coastal" className="group relative block h-96 rounded-lg overflow-hidden shadow-lg">
              <img src="/shark-cage-diving.png" alt="Coastal & Marine Adventures" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative h-full flex items-center justify-center">
                <h3 className="text-4xl font-bold text-white text-center drop-shadow-md">Coastal & Marine</h3>
              </div>
            </a>
            <a href="/tours/winelands" className="group relative block h-96 rounded-lg overflow-hidden shadow-lg">
              <img src="/table-mountain-view.png" alt="Winelands & Culinary Tours" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative h-full flex items-center justify-center">
                <h3 className="text-4xl font-bold text-white text-center drop-shadow-md">Winelands & Culinary</h3>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* CTA / LEAD CAPTURE */}
      <section className="py-16 sm:py-24 bg-brand-primary text-brand-light">
        <div className="container text-center">
          <h2 className="font-montserrat mb-4 text-center text-3xl font-bold md:text-4xl">Overwhelmed by the options?</h2>
          <p className="text-center text-lg text-brand-secondary mb-8 max-w-3xl mx-auto">Let our safari experts craft a custom itinerary just for you. Tell us your dream, and we'll make it a reality.</p>
          <a
            href="/contact"
            className="inline-block px-12 py-5 bg-brand-accent text-white rounded-full font-bold text-2xl shadow-xl hover:bg-opacity-90 transition"
          >
            Get a Free Custom Itinerary
          </a>
        </div>
      </section>
    </>
  );
}
