"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TourEditor } from '@/components/admin/TourEditor';
import { TourFormData } from '@/types/tour-management';
import { useToast } from '@/hooks/use-toast';

export default function CreateTourPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (data: TourFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/tours/crud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create tour');
      }

      const result = await response.json();
      
      toast({
        title: "Success",
        description: "Tour created successfully",
      });

      // Redirect to the edit page for the new tour
      router.push(`/admin/tours/${result.tour.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create tour",
        variant: "destructive",
      });
      throw error; // Re-throw to let TourEditor handle it
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async (data: TourFormData) => {
    // Set status to published before saving
    const publishData = { ...data, status: 'published' as const };
    return handleSave(publishData);
  };

  return (
    <div className="container mx-auto py-6">
      <TourEditor 
        mode="create" 
        onSave={handleSave}
        onPublish={handlePublish}
      />
    </div>
  );
}
