import Image from "next/image"
import { tours } from "@/lib/placeholder-data"
import { notFound } from "next/navigation"
import { BookingWidget } from "@/components/tours/booking-widget"
import { Star } from "lucide-react"

export default async function TourDetailPage({ params }: { params: { tourId: string } }) {
  // In Next.js 15+, params is now async and must be awaited
  const { tourId } = params
  const tour = tours.find((t) => t.id === tourId)
  if (!tour) notFound()

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="font-montserrat text-4xl font-bold">{tour.name}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{tour.category}</span>
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" /> 4.8 (23 reviews)
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={tour.main_image_url || "/placeholder.svg"}
              alt={tour.main_image_alt}
              fill
              className="object-cover"
            />
          </div>
          <h2 className="font-montserrat mb-4 text-2xl font-bold">About this tour</h2>
          <p className="text-slate-700 leading-relaxed">{tour.description}</p>
        </div>
        <div className="lg:col-span-1">
          <BookingWidget tour={tour} />
        </div>
      </div>
    </div>
  )
}
