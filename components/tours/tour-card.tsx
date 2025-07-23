import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Tour } from "@/lib/placeholder-data"

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
  const formatPrice = (priceInCents: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(priceInCents / 100)

  return (
<Card
      className={cn(
        "w-full max-w-sm overflow-hidden rounded-lg shadow-md transition-all duration-300 lg:hover:shadow-xl lg:hover:scale-105",
        className,
      )}
    >
      <Link href={`/tours/${tour.id}`} className="block">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={tour.main_image_url || "/placeholder.svg"}
            alt={tour.main_image_alt}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 33vw"
          />
        </div>
      </Link>
      <CardContent className="flex flex-col space-y-4 p-6">
        <span
          className={cn(
            "self-start rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider",
            categoryStyles[tour.category],
          )}
        >
          {tour.category}
        </span>
        <h2 className="font-montserrat text-xl font-bold leading-tight">
          <Link href={`/tours/${tour.id}`} className="hover:text-brand-primary">
            {tour.name}
          </Link>
        </h2>
        <div className="flex items-baseline justify-between text-slate-600">
          <p>
            {tour.duration_days} Day{tour.duration_days > 1 ? "s" : ""}
          </p>
          <p className="text-lg font-semibold text-slate-900">{formatPrice(tour.price_per_person_cents)}</p>
        </div>
        <Button asChild className="w-full bg-brand-primary text-white hover:bg-brand-primary/90">
          <Link href={`/tours/${tour.id}`}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
