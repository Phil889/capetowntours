import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { tours } from "@/lib/placeholder-data"

export default function EditTourPage({ params }: { params: { tourId: string } }) {
  const isNew = params.tourId === "new"
  const tour = isNew ? null : tours.find((t) => t.id === params.tourId)

  return (
    <div className="grid gap-6">
      <h1 className="font-montserrat text-3xl font-bold">{isNew ? "Create New Tour" : "Edit Tour"}</h1>
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Set the main details for this tour.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Tour Name</Label>
            <Input id="name" defaultValue={tour?.name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select defaultValue={tour?.category}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mountain">Mountain</SelectItem>
                <SelectItem value="marine">Marine</SelectItem>
                <SelectItem value="safari">Safari</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
                <SelectItem value="vineyard">Vineyard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (days)</Label>
            <Input id="duration" type="number" defaultValue={tour?.duration_days} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price per Person (cents)</Label>
            <Input id="price" type="number" defaultValue={tour?.price_per_person_cents} />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={5} defaultValue={tour?.description} />
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button className="bg-brand-primary hover:bg-brand-primary/90">Save Tour</Button>
      </div>
    </div>
  )
}
