"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Users } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { Tour } from "@/lib/placeholder-data"
import { useRouter } from "next/navigation"

export function BookingWidget({ tour }: { tour: Tour }) {
  const [date, setDate] = useState<Date>()
  const [groupSize, setGroupSize] = useState(1)
  const router = useRouter()

  const totalPrice = tour.price_per_person_cents * groupSize
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price / 100)

  const handleBookNow = () => {
    // In a real app, you'd create a scheduled tour ID here
    const scheduledTourId = `${tour.id}-${date?.toISOString()}`
    router.push(`/book/${scheduledTourId}`)
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="font-montserrat flex items-baseline justify-between">
          <span>Book Your Tour</span>
          <span className="text-2xl font-bold">
            {formatPrice(tour.price_per_person_cents)}
            <span className="text-sm font-normal text-muted-foreground">/person</span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label htmlFor="group-size">Group Size</Label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="group-size"
              type="number"
              value={groupSize}
              onChange={(e) => setGroupSize(Math.max(1, Number.parseInt(e.target.value) || 1))}
              className="pl-10"
            />
          </div>
        </div>
        <div className="rounded-lg bg-slate-100 p-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total Price</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
        </div>
        <Button
          onClick={handleBookNow}
          disabled={!date}
          className="w-full bg-brand-primary text-white hover:bg-brand-primary/90"
        >
          Book Now
        </Button>
      </CardContent>
    </Card>
  )
}
