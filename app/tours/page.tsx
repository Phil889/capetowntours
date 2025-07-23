import { TourCard } from "@/components/tours/tour-card"
import { tours } from "@/lib/placeholder-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

export default function ExploreToursPage() {
  const categories = [...new Set(tours.map((t) => t.category))]

  return (
    <div className="container py-12">
      <h1 className="font-montserrat mb-8 text-center text-4xl font-bold">Explore All Tours</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-4 font-semibold">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox id={category} />
                      <Label htmlFor={category} className="capitalize">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-4 font-semibold">Price Range</h3>
                <Slider defaultValue={[50, 500]} max={1000} step={10} />
              </div>
              <div>
                <h3 className="mb-4 font-semibold">Duration</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="d1" />
                    <Label htmlFor="d1">1 Day</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="d23" />
                    <Label htmlFor="d23">2-3 Days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="d4p" />
                    <Label htmlFor="d4p">4+ Days</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
        <main className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 lg:col-span-3">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </main>
      </div>
    </div>
  )
}
