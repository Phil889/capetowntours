import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { tours } from "@/lib/placeholder-data"
import Image from "next/image"

export function BookingSummary({ scheduledTourId }: { scheduledTourId: string }) {
  const tourId = scheduledTourId.split("-")[0]
  const tour = tours.find((t) => t.id === tourId)
  if (!tour) return null

  const groupSize = 2 // Mocked data
  const totalPrice = tour.price_per_person_cents * groupSize
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price / 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={tour.main_image_url || "/placeholder.svg"}
            alt={tour.main_image_alt}
            fill
            className="object-cover"
          />
        </div>
        <h3 className="font-semibold">{tour.name}</h3>
        <div className="space-y-2 border-t pt-4 text-sm">
          <div className="flex justify-between">
            <span>Date:</span>
            <span>Oct 28, 2023</span>
          </div>
          <div className="flex justify-between">
            <span>Group Size:</span>
            <span>{groupSize} Adults</span>
          </div>
          <div className="flex justify-between">
            <span>Price per person:</span>
            <span>{formatPrice(tour.price_per_person_cents)}</span>
          </div>
        </div>
        <div className="flex justify-between border-t pt-4 text-lg font-bold">
          <span>Total</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
