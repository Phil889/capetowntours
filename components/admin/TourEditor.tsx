"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Minus, 
  Save, 
  Eye, 
  Sparkles, 
  Upload, 
  X,
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";
import type { 
  EnhancedTour, 
  TourFormData, 
  ItineraryItem, 
  IncludeItem, 
  FAQItem, 
  PricingTier,
  TourImage,
  SEOData 
} from '@/types/tour-management';

interface TourEditorProps {
  tour?: EnhancedTour;
  onSave?: (data: TourFormData) => Promise<void>;
  onPublish?: (data: TourFormData) => Promise<void>;
  mode?: 'create' | 'edit';
}

export function TourEditor({ tour, onSave, onPublish, mode = 'create' }: TourEditorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic');

  // Form state with extended type for itinerary steps
  const [formData, setFormData] = useState<TourFormData & { itinerarySteps?: string[] }>({
    title: '',
    slug: '',
    description: '',
    category: 'safari',
    status: 'draft',
    durationDays: 1,
    duration: '',
    departureTime: '',
    pickup: '',
    groupSizeMax: 20,
    itinerary: [],
    itinerarySteps: [],  // Add itinerarySteps array
    highlights: [],
    includes: [],
    excludes: [],
    faqs: [],
    pricingTiers: [],
    images: [],
    seoData: {},
    cancellationPolicy: '',
    seasonalNotes: '',
    childPolicy: '',
    accessibility: '',
    mapEmbed: '',
  });

  // Initialize form with tour data if editing
  useEffect(() => {
    if (tour && mode === 'edit') {
      // Parse legacy itinerary into steps
      let itinerarySteps: string[] = [];
      if (tour.itinerary) {
        // Legacy format: "step1 > step2 > step3"
        itinerarySteps = tour.itinerary
          .split('>')
          .map(step => step.trim())
          .filter(step => step.length > 0);
      }

      setFormData({
        title: tour.title || '',
        slug: tour.slug || '',
        description: tour.description || '',
        category: tour.category || 'safari',
        status: tour.status || 'draft',
        durationDays: tour.durationDays || 1,
        duration: tour.duration || '',
        departureTime: tour.departureTime || '',
        pickup: tour.pickup || '',
        groupSizeMax: tour.groupSizeMax || 20,
        itinerary: tour.structuredItinerary || [],
        itinerarySteps: itinerarySteps,  // Set the parsed steps
        highlights: tour.structuredHighlights || [],
        includes: tour.structuredIncludes || [],
        excludes: tour.structuredExcludes || [],
        faqs: tour.structuredFaqs || [],
        pricingTiers: tour.pricingTiers || [],
        images: tour.images || [],
        seoData: tour.seoData || {},
        cancellationPolicy: tour.cancellationPolicy || '',
        seasonalNotes: tour.seasonalNotes || '',
        childPolicy: tour.childPolicy || '',
        accessibility: tour.accessibility || '',
        mapEmbed: tour.mapEmbed || '',
      });
    }
  }, [tour, mode]);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  // Handle basic info changes
  const handleBasicChange = (field: keyof TourFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Auto-generate slug when title changes
    if (field === 'title' && mode === 'create') {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value),
      }));
    }
  };

  // Itinerary management
  const addItineraryItem = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          day: prev.itinerary.length + 1,
          title: '',
          description: '',
          location: '',
          duration: '',
          highlights: [],
        },
      ],
    }));
  };

  const updateItineraryItem = (index: number, field: keyof ItineraryItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeItineraryItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index),
    }));
  };

  // Highlights management
  const addHighlight = () => {
    setFormData(prev => ({
      ...prev,
      highlights: [...prev.highlights, ''],
    }));
  };

  const updateHighlight = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.map((h, i) => i === index ? value : h),
    }));
  };

  const removeHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  // Includes management
  const addInclude = () => {
    setFormData(prev => ({
      ...prev,
      includes: [
        ...prev.includes,
        {
          category: 'other',
          item: '',
          description: '',
        },
      ],
    }));
  };

  const updateInclude = (index: number, field: keyof IncludeItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeInclude = (index: number) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index),
    }));
  };

  // Excludes management
  const addExclude = () => {
    setFormData(prev => ({
      ...prev,
      excludes: [
        ...prev.excludes,
        {
          category: 'other',
          item: '',
          description: '',
        },
      ],
    }));
  };

  const updateExclude = (index: number, field: keyof IncludeItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      excludes: prev.excludes.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeExclude = (index: number) => {
    setFormData(prev => ({
      ...prev,
      excludes: prev.excludes.filter((_, i) => i !== index),
    }));
  };

  // FAQs management
  const addFAQ = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [
        ...prev.faqs,
        {
          question: '',
          answer: '',
          order: prev.faqs.length + 1,
        },
      ],
    }));
  };

  const updateFAQ = (index: number, field: keyof FAQItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeFAQ = (index: number) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  // Pricing tiers management
  const addPricingTier = () => {
    setFormData(prev => ({
      ...prev,
      pricingTiers: [
        ...prev.pricingTiers,
        {
          id: `tier-${Date.now()}`,
          name: '',
          pricePerPerson: 0,
          currency: 'ZAR',
        },
      ],
    }));
  };

  const updatePricingTier = (index: number, field: keyof PricingTier, value: any) => {
    setFormData(prev => ({
      ...prev,
      pricingTiers: prev.pricingTiers.map((tier, i) => 
        i === index ? { ...tier, [field]: value } : tier
      ),
    }));
  };

  const removePricingTier = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pricingTiers: prev.pricingTiers.filter((_, i) => i !== index),
    }));
  };

  // Save handler
  const handleSave = async (publish = false) => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const dataToSave = {
        ...formData,
        status: publish ? 'published' : formData.status,
      };

      if (publish && onPublish) {
        await onPublish(dataToSave);
        setSuccess('Tour published successfully!');
      } else if (onSave) {
        await onSave(dataToSave);
        setSuccess('Tour saved successfully!');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save tour');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            {mode === 'create' ? 'Create New Tour' : 'Edit Tour'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {mode === 'create' 
              ? 'Add a new tour to your catalog' 
              : `Editing: ${formData.title || 'Untitled Tour'}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled={isSaving}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleSave(false)}
            disabled={isSaving}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Draft
          </Button>
          <Button 
            onClick={() => handleSave(true)}
            disabled={isSaving}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Publish
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="ai">AI Tools</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential details about the tour</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tour Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleBasicChange('title', e.target.value)}
                    placeholder="e.g., Cape Peninsula Full Day Tour"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleBasicChange('slug', e.target.value)}
                    placeholder="cape-peninsula-full-day-tour"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleBasicChange('description', e.target.value)}
                  placeholder="Provide a compelling description of the tour..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleBasicChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="safari">Safari</SelectItem>
                      <SelectItem value="wine">Wine Tours</SelectItem>
                      <SelectItem value="adventure">Adventure</SelectItem>
                      <SelectItem value="cultural">Cultural</SelectItem>
                      <SelectItem value="marine">Marine</SelectItem>
                      <SelectItem value="day-tours">Day Tours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (Days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.durationDays}
                    onChange={(e) => handleBasicChange('durationDays', parseInt(e.target.value))}
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groupSize">Max Group Size</Label>
                  <Input
                    id="groupSize"
                    type="number"
                    value={formData.groupSizeMax}
                    onChange={(e) => handleBasicChange('groupSizeMax', parseInt(e.target.value))}
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departure">Departure Time</Label>
                  <Input
                    id="departure"
                    value={formData.departureTime}
                    onChange={(e) => handleBasicChange('departureTime', e.target.value)}
                    placeholder="e.g., 8:00 AM"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickup">Pickup Location</Label>
                  <Input
                    id="pickup"
                    value={formData.pickup}
                    onChange={(e) => handleBasicChange('pickup', e.target.value)}
                    placeholder="e.g., Hotels in Cape Town City Center"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content">
          <div className="space-y-6">
            {/* Highlights */}
            <Card>
              <CardHeader>
                <CardTitle>Tour Highlights</CardTitle>
                <CardDescription>Key features that make this tour special</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={highlight}
                      onChange={(e) => updateHighlight(index, e.target.value)}
                      placeholder="Enter a highlight..."
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeHighlight(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addHighlight}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Highlight
                </Button>
              </CardContent>
            </Card>

            {/* Includes */}
            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
                <CardDescription>Items and services included in the tour price</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.includes.map((include, index) => (
                  <div key={index} className="space-y-2 p-4 border rounded-lg">
                    <div className="flex gap-2">
                      <Select
                        value={include.category}
                        onValueChange={(value) => updateInclude(index, 'category', value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="transport">Transport</SelectItem>
                          <SelectItem value="meal">Meals</SelectItem>
                          <SelectItem value="activity">Activities</SelectItem>
                          <SelectItem value="guide">Guide</SelectItem>
                          <SelectItem value="equipment">Equipment</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        value={include.item}
                        onChange={(e) => updateInclude(index, 'item', e.target.value)}
                        placeholder="What's included..."
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeInclude(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      value={include.description || ''}
                      onChange={(e) => updateInclude(index, 'description', e.target.value)}
                      placeholder="Additional details (optional)..."
                    />
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addInclude}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Included Item
                </Button>
              </CardContent>
            </Card>

            {/* Excludes */}
            <Card>
              <CardHeader>
                <CardTitle>What's Excluded</CardTitle>
                <CardDescription>Items and services NOT included in the tour price</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.excludes.map((exclude, index) => (
                  <div key={index} className="space-y-2 p-4 border rounded-lg">
                    <div className="flex gap-2">
                      <Select
                        value={exclude.category}
                        onValueChange={(value) => updateExclude(index, 'category', value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="transport">Transport</SelectItem>
                          <SelectItem value="meal">Meals</SelectItem>
                          <SelectItem value="activity">Activities</SelectItem>
                          <SelectItem value="guide">Guide</SelectItem>
                          <SelectItem value="equipment">Equipment</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        value={exclude.item}
                        onChange={(e) => updateExclude(index, 'item', e.target.value)}
                        placeholder="What's excluded..."
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeExclude(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      value={exclude.description || ''}
                      onChange={(e) => updateExclude(index, 'description', e.target.value)}
                      placeholder="Additional details (optional)..."
                    />
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addExclude}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Excluded Item
                </Button>
              </CardContent>
            </Card>

            {/* FAQs */}
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Common questions and answers about the tour</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.faqs.map((faq, index) => (
                  <div key={index} className="space-y-2 p-4 border rounded-lg">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 space-y-2">
                        <Input
                          value={faq.question}
                          onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                          placeholder="Question..."
                        />
                        <Textarea
                          value={faq.answer}
                          onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                          placeholder="Answer..."
                          rows={2}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFAQ(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addFAQ}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add FAQ
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Itinerary Tab */}
        <TabsContent value="itinerary">
          <div className="space-y-6">
            {/* Simple Steps Editor */}
            <Card>
              <CardHeader>
                <CardTitle>Tour Steps</CardTitle>
                <CardDescription>Individual steps shown on the frontend (Your Journey section)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(formData.itinerarySteps || []).map((step, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                      {index + 1}
                    </div>
                    <Input
                      value={step}
                      onChange={(e) => {
                        const newSteps = [...(formData.itinerarySteps || [])];
                        newSteps[index] = e.target.value;
                        setFormData(prev => ({ ...prev, itinerarySteps: newSteps }));
                      }}
                      placeholder={`Step ${index + 1} (e.g., Hotel pickup)`}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newSteps = (formData.itinerarySteps || []).filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, itinerarySteps: newSteps }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      itinerarySteps: [...(prev.itinerarySteps || []), '']
                    }));
                  }}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Step
                </Button>
              </CardContent>
            </Card>

            {/* Detailed Day-by-Day Editor */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Itinerary (Optional)</CardTitle>
                <CardDescription>Day-by-day breakdown with locations and highlights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.itinerary.map((item, index) => (
                  <div key={index} className="space-y-2 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Day {item.day}</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItineraryItem(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      value={item.title}
                      onChange={(e) => updateItineraryItem(index, 'title', e.target.value)}
                      placeholder="Day title (e.g., Safari Adventure)"
                    />
                    <Textarea
                      value={item.description}
                      onChange={(e) => updateItineraryItem(index, 'description', e.target.value)}
                      placeholder="Detailed description of the day's activities..."
                      rows={3}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={item.location || ''}
                        onChange={(e) => updateItineraryItem(index, 'location', e.target.value)}
                        placeholder="Location"
                      />
                      <Input
                        value={item.duration || ''}
                        onChange={(e) => updateItineraryItem(index, 'duration', e.target.value)}
                        placeholder="Duration (e.g., 4 hours)"
                      />
                    </div>
                    {/* Add highlights for each day */}
                    <div className="space-y-2">
                      <Label>Day Highlights</Label>
                      {(item.highlights || []).map((highlight, hIndex) => (
                        <div key={hIndex} className="flex gap-2">
                          <Input
                            value={highlight}
                            onChange={(e) => {
                              const newHighlights = [...(item.highlights || [])];
                              newHighlights[hIndex] = e.target.value;
                              updateItineraryItem(index, 'highlights', newHighlights);
                            }}
                            placeholder="Highlight..."
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newHighlights = (item.highlights || []).filter((_, i) => i !== hIndex);
                              updateItineraryItem(index, 'highlights', newHighlights);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newHighlights = [...(item.highlights || []), ''];
                          updateItineraryItem(index, 'highlights', newHighlights);
                        }}
                        className="w-full"
                      >
                        <Plus className="mr-2 h-3 w-3" />
                        Add Highlight
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addItineraryItem}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Day
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Tiers</CardTitle>
              <CardDescription>Set up different pricing options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.pricingTiers.map((tier, index) => (
                <div key={index} className="space-y-2 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Tier {index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removePricingTier(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={tier.name}
                      onChange={(e) => updatePricingTier(index, 'name', e.target.value)}
                      placeholder="Tier name (e.g., Adult, Child, Group)"
                    />
                    <div className="flex gap-2">
                      <Select
                        value={tier.currency}
                        onValueChange={(value) => updatePricingTier(index, 'currency', value)}
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ZAR">ZAR</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        value={tier.pricePerPerson}
                        onChange={(e) => updatePricingTier(index, 'pricePerPerson', parseFloat(e.target.value))}
                        placeholder="Price per person"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <Input
                    value={tier.description || ''}
                    onChange={(e) => updatePricingTier(index, 'description', e.target.value)}
                    placeholder="Description (optional)"
                  />
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addPricingTier}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Pricing Tier
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle>Tour Images</CardTitle>
              <CardDescription>Upload and manage tour photos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
                <Input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  id="image-upload"
                />
                <Label
                  htmlFor="image-upload"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  Select Images
                </Label>
              </div>
              
              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url || '/placeholder.jpg'}
                        alt={image.altText || `Tour image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index),
                            }));
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {image.isPrimary && (
                        <Badge className="absolute top-2 left-2">Primary</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>Optimize for search engines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={formData.seoData.titleTag || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    seoData: { ...prev.seoData, titleTag: e.target.value }
                  }))}
                  placeholder="Page title for search results (50-60 characters)"
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground">
                  {(formData.seoData.titleTag || '').length}/60 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDesc">Meta Description</Label>
                <Textarea
                  id="metaDesc"
                  value={formData.seoData.metaDescription || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    seoData: { ...prev.seoData, metaDescription: e.target.value }
                  }))}
                  placeholder="Description for search results (150-160 characters)"
                  rows={3}
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground">
                  {(formData.seoData.metaDescription || '').length}/160 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="h1">H1 Heading</Label>
                <Input
                  id="h1"
                  value={formData.seoData.h1 || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    seoData: { ...prev.seoData, h1: e.target.value }
                  }))}
                  placeholder="Main heading for the page"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heroTagline">Hero Tagline</Label>
                <Input
                  id="heroTagline"
                  value={formData.seoData.heroTagline || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    seoData: { ...prev.seoData, heroTagline: e.target.value }
                  }))}
                  placeholder="Compelling tagline for the hero section"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryKeyword">Primary Keyword</Label>
                <Input
                  id="primaryKeyword"
                  value={formData.seoData.primaryKeyword || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    seoData: { ...prev.seoData, primaryKeyword: e.target.value }
                  }))}
                  placeholder="Main keyword to target"
                />
              </div>

              <div className="space-y-2">
                <Label>Secondary Keywords</Label>
                {(formData.seoData.secondaryKeywords || []).map((keyword, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={keyword}
                      onChange={(e) => {
                        const newKeywords = [...(formData.seoData.secondaryKeywords || [])];
                        newKeywords[index] = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          seoData: { ...prev.seoData, secondaryKeywords: newKeywords }
                        }));
                      }}
                      placeholder="Secondary keyword"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newKeywords = (formData.seoData.secondaryKeywords || [])
                          .filter((_, i) => i !== index);
                        setFormData(prev => ({
                          ...prev,
                          seoData: { ...prev.seoData, secondaryKeywords: newKeywords }
                        }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      seoData: {
                        ...prev.seoData,
                        secondaryKeywords: [...(prev.seoData.secondaryKeywords || []), '']
                      }
                    }));
                  }}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Secondary Keyword
                </Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="canonicalUrl">Canonical URL</Label>
                <Input
                  id="canonicalUrl"
                  value={formData.seoData.canonicalUrl || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    seoData: { ...prev.seoData, canonicalUrl: e.target.value }
                  }))}
                  placeholder="https://example.com/tours/tour-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ogImage">Open Graph Image URL</Label>
                <Input
                  id="ogImage"
                  value={formData.seoData.ogImage || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    seoData: { ...prev.seoData, ogImage: e.target.value }
                  }))}
                  placeholder="https://example.com/images/tour-preview.jpg"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>AI Generation Tools</CardTitle>
              <CardDescription>Use AI to generate and enhance content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-24">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Description
                </Button>
                <Button variant="outline" className="h-24">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Itinerary
                </Button>
                <Button variant="outline" className="h-24">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate FAQs
                </Button>
                <Button variant="outline" className="h-24">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Enhance SEO
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
