"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const tourSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be at least 0"),
  category: z.string().min(1, "Category is required"),
  duration_days: z.coerce.number().min(1, "Duration must be at least 1 day"),
  image: z.any().optional(),
  availability: z.boolean().optional(),
});

type TourFormValues = z.infer<typeof tourSchema>;

export default function CreateTourPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TourFormValues>({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "",
      duration_days: 1,
      availability: true,
    },
  });

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Optional: check for admin session (client-side fallback)
  // In production, use server-side checks or middleware for true security
  // Here, we just show the form; backend will enforce auth

  const onSubmit = async (data: TourFormValues) => {
    setLoading(true);
    let image_url = "";
    // Handle image upload if provided
    if (data.image && data.image[0]) {
      // TODO: Implement image upload to storage and get URL
      // For now, skip and use placeholder
      image_url = "/placeholder.jpg";
    }
    const payload = {
      ...data,
      image_url,
    };
    try {
      const res = await fetch("/api/admin/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast({ title: "Success", description: "Tour created successfully!" });
        reset();
        router.push("/admin/tours");
      } else {
        const err = await res.json();
        toast({ title: "Error", description: err.error || "Failed to create tour", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Network error", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Create Tour</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input id="price" type="number" step="0.01" {...register("price")} />
            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" {...register("category")} />
            {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
          </div>
          <div>
            <Label htmlFor="duration_days">Duration (days)</Label>
            <Input id="duration_days" type="number" {...register("duration_days")} />
            {errors.duration_days && <p className="text-red-500 text-sm">{errors.duration_days.message}</p>}
          </div>
          <div>
            <Label htmlFor="image">Image</Label>
            <Input id="image" type="file" {...register("image")} />
            {/* No validation for image */}
          </div>
          <div>
            <Label htmlFor="availability">Available</Label>
            <Input id="availability" type="checkbox" {...register("availability")} />
          </div>
          <Button type="submit" disabled={isSubmitting || loading} className="w-full">
            {loading ? "Creating..." : "Create Tour"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
