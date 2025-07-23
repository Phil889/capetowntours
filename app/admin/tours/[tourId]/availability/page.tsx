"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";

export default function ManageAvailabilityPage() {
  const { tourId } = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [slots, setSlots] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Fetch availability for selected date
  useEffect(() => {
    if (!selectedDate) return;
    setLoading(true);
    fetch(`/api/admin/tours/${tourId}/availability?date=${selectedDate.toISOString().slice(0, 10)}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setSlots(data[0].available_slots);
        } else {
          setSlots(0);
        }
      })
      .catch(() => {
        toast({ title: "Error", description: "Failed to fetch availability", variant: "destructive" });
      })
      .finally(() => setLoading(false));
  }, [selectedDate, tourId, toast]);

  const handleSave = async () => {
    if (!selectedDate) return;
    setLoading(true);
    const res = await fetch(`/api/admin/tours/${tourId}/availability`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: selectedDate.toISOString().slice(0, 10),
        available_slots: slots,
      }),
    });
    if (res.ok) {
      toast({ title: "Success", description: "Availability updated" });
    } else {
      const err = await res.json();
      toast({ title: "Error", description: err.error || "Failed to update availability", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Manage Tour Availability</h2>
        <div className="mb-4">
          <Label>Select Date</Label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="my-2"
          />
        </div>
        {selectedDate && (
          <div className="mb-4">
            <Label htmlFor="slots">Available Slots for {selectedDate.toISOString().slice(0, 10)}</Label>
            <Input
              id="slots"
              type="number"
              min={0}
              value={slots}
              onChange={e => setSlots(Number(e.target.value))}
              className="w-32"
            />
          </div>
        )}
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/admin/tours/${tourId}`)}>
            Back
          </Button>
          <Button
            onClick={handleSave}
            disabled={!selectedDate || loading}
            className="w-full"
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
