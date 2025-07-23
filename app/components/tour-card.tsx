import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Tour {
  id: string
  name: string
  category: "safari" | "marine" | "mountain" | "cultural"
  duration_days: number
  price_per_person_cents: number
  main_image_url: string
  main_image_alt: string
}

interface TourCardProps {
  tour: Tour
  className?: string
}

const categoryStyles: Record<Tour["category"], string> = {
  safari: "bg-orange-100 text-orange-800",
  marine: "bg-blue-100 text-blue-800",
  mountain: "bg-green-100 text-green-800",
  cultural: "bg-purple-100 text-purple-800",
}

export function TourCard({ tour, className }: TourCardProps) {
  const formatPrice = (priceInCents: number) => {
    const dollars = priceInCents / 100
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(dollars)
  }

  return (
    <Card
      className={cn(
        "w-full max-w-sm overflow-hidden rounded-lg shadow-md transition-all duration-300 lg:hover:shadow-xl lg:hover:scale-105",
        className,
      )}
    >
      <div className="relative aspect-video w-full">
        <Image
          src={tour.main_image_url || "/placeholder.svg"}
          alt={tour.main_image_alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <CardContent className="flex flex-col space-y-4 p-6 text-brand-text">
        <span
          className={cn(
            "inline-block self-start rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider",
            categoryStyles[tour.category],
          )}
        >
          {tour.category}
        </span>
        <h2 className="font-montserrat text-2xl font-bold leading-tight text-gray-800">{tour.name}</h2>
        <div className="flex items-baseline justify-between font-sans">
          <p className="text-sm text-muted-foreground">{tour.duration_days} Days</p>
          <p className="text-xl font-semibold text-gray-900">{formatPrice(tour.price_per_person_cents)}</p>
        </div>
        <Button className="w-full bg-brand-primary text-white hover:bg-brand-primary/90">
          View Details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
