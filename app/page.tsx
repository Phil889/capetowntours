import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { TourCard } from "@/components/tours/tour-card"
import { tours } from "@/lib/placeholder-data"

export default function HomePage() {
  const featuredTours = tours.slice(0, 4)

  return (
    <>
      <section className="relative h-[60vh] w-full">
        <Image src="/cape-town-hero.png" alt="Aerial view of Cape Town" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
          <h1 className="font-montserrat mb-4 text-4xl font-extrabold tracking-tight md:text-6xl">
            Discover Your Perfect Cape Town Experience
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-slate-200">
            From breathtaking mountain hikes to serene vineyard tours, find your next adventure.
          </p>
          <div className="w-full max-w-lg rounded-full bg-white/20 p-2 backdrop-blur-sm">
            <form className="flex items-center gap-2">
              <Input
                type="search"
                placeholder="Search for tours, e.g., 'Shark Diving'"
                className="flex-1 rounded-full border-0 bg-transparent text-white placeholder:text-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button type="submit" className="rounded-full bg-brand-primary hover:bg-brand-primary/90">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>
      <section className="py-16 sm:py-24">
        <div className="container">
          <h2 className="font-montserrat mb-12 text-center text-3xl font-bold md:text-4xl">Featured Tours</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
