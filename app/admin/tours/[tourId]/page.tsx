"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { TourEditor } from '@/components/admin/TourEditor';
import { TourFormData, EnhancedTour } from '@/types/tour-management';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface EditTourPageProps {
  params: Promise<{
    tourId: string;
  }>;
}

export default function EditTourPage({ params }: EditTourPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [tour, setTour] = useState<EnhancedTour | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Unwrap params using React.use()
  const { tourId } = use(params);

  // Fetch tour data
  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await fetch(`/api/admin/tours/${tourId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch tour');
        }
        const data = await response.json();
        setTour(data.tour);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load tour",
          variant: "destructive",
        });
        router.push('/admin/tours');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTour();
  }, [tourId, router, toast]);

  const handleSave = async (data: TourFormData) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/tours/crud?id=${tourId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update tour');
      }

      const result = await response.json();
      setTour(result.tour);
      
      toast({
        title: "Success",
        description: "Tour updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update tour",
        variant: "destructive",
      });
      throw error; // Re-throw to let TourEditor handle it
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async (data: TourFormData) => {
    // Set status to published before saving
    const publishData = { ...data, status: 'published' as const };
    return handleSave(publishData);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Tour not found</h2>
          <p className="text-muted-foreground mt-2">The tour you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <TourEditor 
        tour={tour}
        mode="edit" 
        onSave={handleSave}
        onPublish={handlePublish}
      />
    </div>
  );
}
