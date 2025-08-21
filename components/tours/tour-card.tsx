import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Tour as BaseTour } from "@/lib/placeholder-data"

type Tour = BaseTour & { slug: string }

interface TourCardProps {
  tour: Tour
  className?: string
}

const categoryStyles: Record<Tour["category"], string> = {
  safari: "bg-orange-100 text-orange-800",
  marine: "bg-blue-100 text-blue-800",
  mountain: "bg-green-100 text-green-800",
  cultural: "bg-purple-100 text-purple-800",
  vineyard: "bg-red-100 text-red-800",
}

export function TourCard({ tour, className }: TourCardProps) {
  // Format price as ZAR
  const formatPriceZAR = (priceInCents: number) =>
    "ZAR " +
    (priceInCents / 100).toLocaleString("en-ZA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

  return (
    <Card
      className={cn(
        "w-full max-w-sm overflow-hidden rounded-lg shadow-md transition-all duration-300 lg:hover:shadow-xl lg:hover:scale-105",
        className,
      )}
    >
      <Link href={`/tours/${tour.slug}`} className="block">
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={tour.main_image_url || "/placeholder.svg"}
            alt={tour.main_image_alt}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 33vw"
          />
          {/* Duration Badge - top right over image */}
          <span className="absolute top-3 right-3 z-10 rounded-full bg-brand-primary/90 text-white px-3 py-1 text-xs font-semibold shadow-md">
            {tour.duration_days} Day{tour.duration_days > 1 ? "s" : ""}
          </span>
        </div>
      </Link>
      <CardContent className="flex flex-col space-y-4 p-6">
        {/* Badges Row: Best Sightseeing Tour + Category */}
        <div className="flex flex-row gap-2 items-center justify-end mb-1">
          <span className="rounded-full bg-slate-100 text-brand-primary px-3 py-1 text-xs font-semibold">
            Best Sightseeing Tour
          </span>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider",
              categoryStyles[tour.category],
            )}
          >
            {tour.category}
          </span>
        </div>
        {/* Title */}
        <h2 className="text-xl font-semibold leading-tight">
          <Link href={`/tours/${tour.slug}`} className="hover:text-brand-primary">
            {tour.name}
          </Link>
        </h2>
        {/* Subtitle/Description */}
        <p className="text-sm text-slate-700">{tour.description}</p>
        {/* Price row */}
        <div className="flex items-baseline justify-end text-slate-600">
          <p className="text-lg font-semibold text-slate-900">
            Price from: {formatPriceZAR(tour.price_per_person_cents)}
          </p>
        </div>
        {/* View Details Button */}
        <Button asChild className="w-full bg-brand-primary text-white hover:bg-brand-primary/90">
          <Link href={`/tours/${tour.slug}`}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
