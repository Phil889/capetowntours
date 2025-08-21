import { createClient } from '@supabase/supabase-js';
import { 
  EnhancedTour, 
  TourTemplate, 
  TourFormData, 
  AIGenerationRequest, 
  AIGenerationResponse,
  FAQItem,
  IncludeItem 
} from '@/types/tour-management';

export class TourManagementService {
  private supabase;

  constructor() {
    // Use service role key for admin operations (server-side only)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    // Use service role key if available (server-side), otherwise use anon key (client-side)
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      throw new Error('Supabase configuration missing');
    }
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // ====== TOUR CRUD OPERATIONS ======

  async createTour(data: Partial<TourFormData>, userId?: string): Promise<{ success: boolean; tour?: EnhancedTour; error?: string }> {
    try {
      const slug = this.generateSlug(data.title || '');
      
      const tourData = {
        ...data,
        slug,
        status: data.status || 'draft',
        version: 1,
        structured_itinerary: data.itinerary,
        structured_highlights: data.highlights,
        structured_includes: data.includes,
        structured_excludes: data.excludes,
        structured_faqs: data.faqs,
        pricing_tiers: data.pricingTiers,
        images: data.images,
        seo_data: data.seoData,
        ai_generated: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: tour, error } = await this.supabase
        .from('tours')
        .insert([tourData])
        .select()
        .single();

      if (error) throw error;

      return { success: true, tour: this.mapDbToEnhancedTour(tour) };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateTour(id: string, data: Partial<TourFormData>): Promise<{ success: boolean; tour?: EnhancedTour; error?: string }> {
    try {
      // First get current version
      const { data: currentTour, error: fetchError } = await this.supabase
        .from('tours')
        .select('version')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Convert highlights array to legacy format for backward compatibility
      const legacyHighlights = data.highlights && Array.isArray(data.highlights) 
        ? data.highlights.join('|') 
        : undefined;
      
      // Convert includes/excludes to legacy format
      const legacyIncludes = data.includes && Array.isArray(data.includes)
        ? data.includes.map((item: any) => typeof item === 'object' ? item.item : item).join('|')
        : undefined;
      
      const legacyExcludes = data.excludes && Array.isArray(data.excludes)
        ? data.excludes.map((item: any) => typeof item === 'object' ? item.item : item).join('|')
        : undefined;

      // Convert FAQs to legacy format
      const legacyFaqs = data.faqs && Array.isArray(data.faqs)
        ? JSON.stringify(data.faqs)
        : undefined;

      const updateData: any = {
        // Only include fields that actually need updating
        title: data.title,
        slug: data.slug,
        description: data.description,
        category: data.category,
        status: data.status,
        
        // Update both enhanced and legacy fields
        structured_itinerary: data.itinerary,
        structured_highlights: data.highlights,
        structured_includes: data.includes,
        structured_excludes: data.excludes,
        structured_faqs: data.faqs,
        pricing_tiers: data.pricingTiers,
        images: data.images,
        seo_data: data.seoData,
        
        // Also update legacy fields for backward compatibility
        highlights: legacyHighlights,
        included: legacyIncludes,
        excluded: legacyExcludes,
        faqs: legacyFaqs,
        
        // Map other fields (using exact database column names)
        duration_days: data.durationDays,
        departure_time: data.departureTime,
        group_size_max: data.groupSizeMax,
        cancellation_policy: data.cancellationPolicy,
        seasonal_notes: data.seasonalNotes,
        child_policy: data.childPolicy,
        map_embed: data.mapEmbed,
        accessibility: data.accessibility,
        
        updated_at: new Date().toISOString(),
        // Don't increment version to avoid tour_versions RLS issue
        // version: (currentTour?.version || 0) + 1,
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      // Update directly without triggering versioning
      const { data: tour, error } = await this.supabase
        .from('tours')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Update error:', error);
        throw error;
      }

      return { success: true, tour: this.mapDbToEnhancedTour(tour) };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getTour(id: string): Promise<{ success: boolean; tour?: EnhancedTour; error?: string }> {
    try {
      const { data: tour, error } = await this.supabase
        .from('tours')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { success: true, tour: this.mapDbToEnhancedTour(tour) };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async listTours(params: {
    page?: number;
    pageSize?: number;
    status?: string;
    category?: string;
    search?: string;
  }): Promise<{ success: boolean; tours?: EnhancedTour[]; total?: number; error?: string }> {
    try {
      const { page = 1, pageSize = 20, status, category, search } = params;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = this.supabase
        .from('tours')
        .select('*', { count: 'exact' });

      if (status) {
        query = query.eq('status', status);
      }
      if (category) {
        query = query.eq('category', category);
      }
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      query = query
        .order('created_at', { ascending: false })
        .range(from, to);

      const { data: tours, error, count } = await query;

      if (error) throw error;

      return {
        success: true,
        tours: tours?.map(t => this.mapDbToEnhancedTour(t)) || [],
        total: count || 0,
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async deleteTour(id: string, soft: boolean = true): Promise<{ success: boolean; error?: string }> {
    try {
      if (soft) {
        const { error } = await this.supabase
          .from('tours')
          .update({ 
            deleted_at: new Date().toISOString(),
            status: 'archived'
          })
          .eq('id', id);
        
        if (error) throw error;
      } else {
        const { error } = await this.supabase
          .from('tours')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // ====== TOUR STATUS MANAGEMENT ======

  async publishTour(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from('tours')
        .update({
          status: 'published',
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async unpublishTour(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from('tours')
        .update({
          status: 'draft',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // ====== TEMPLATE MANAGEMENT ======

  async createTemplate(name: string, tourId: string): Promise<{ success: boolean; template?: TourTemplate; error?: string }> {
    try {
      const { data: tour, error: tourError } = await this.supabase
        .from('tours')
        .select('*')
        .eq('id', tourId)
        .single();

      if (tourError) throw tourError;

      const templateData = {
        structure: this.extractStructure(tour),
        defaults: this.extractDefaults(tour),
        prompts: {},
      };

      const { data: template, error } = await this.supabase
        .from('tour_templates')
        .insert([{
          name,
          description: `Template based on ${tour.title}`,
          category: tour.category,
          template_data: templateData,
          is_active: true,
        }])
        .select()
        .single();

      if (error) throw error;

      return { success: true, template: this.mapDbToTemplate(template) };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async listTemplates(): Promise<{ success: boolean; templates?: TourTemplate[]; error?: string }> {
    try {
      const { data: templates, error } = await this.supabase
        .from('tour_templates')
        .select('*')
        .eq('is_active', true)
        .order('usage_count', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        templates: templates?.map(t => this.mapDbToTemplate(t)) || [],
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async createFromTemplate(templateId: string, overrides: Partial<TourFormData>): Promise<{ success: boolean; tour?: EnhancedTour; error?: string }> {
    try {
      const { data: template, error: templateError } = await this.supabase
        .from('tour_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (templateError) throw templateError;

      const templateData = template.template_data as any;
      const tourData = {
        ...templateData.defaults,
        ...overrides,
        template_id: templateId,
      };

      const result = await this.createTour(tourData);

      // Update template usage count
      await this.supabase
        .from('tour_templates')
        .update({ usage_count: template.usage_count + 1 })
        .eq('id', templateId);

      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // ====== AI GENERATION ======

  async generateWithAI(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    try {
      // Log the generation request
      const { data: log, error: logError } = await this.supabase
        .from('ai_generation_logs')
        .insert([{
          template_id: request.templateId,
          prompt: JSON.stringify(request),
          generation_type: request.type,
          status: 'pending',
          model: request.options?.model || 'gpt-4',
        }])
        .select()
        .single();

      if (logError) throw logError;

      // Call AI service (this would integrate with OpenAI, Anthropic, etc.)
      const generatedContent = await this.callAIService(request);

      // Update log with response
      await this.supabase
        .from('ai_generation_logs')
        .update({
          response: generatedContent,
          status: 'success',
          tokens_used: generatedContent.tokensUsed,
        })
        .eq('id', log.id);

      return {
        success: true,
        data: generatedContent.data,
        logId: log.id,
        tokensUsed: generatedContent.tokensUsed,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        logId: '',
      };
    }
  }

  // ====== HELPER METHODS ======

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private mapDbToEnhancedTour(dbTour: any): EnhancedTour {
    // Parse legacy string arrays/JSON if needed
    const parseArray = (field: any): string[] => {
      if (!field) return [];
      if (Array.isArray(field)) return field;
      if (typeof field === 'string') {
        try {
          const parsed = JSON.parse(field);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          // Split by newlines or semicolons for legacy format
          return field.split(/[\n;]/).map((s: string) => s.trim()).filter(Boolean);
        }
      }
      return [];
    };

    // Parse legacy FAQs
    const parseFAQs = (faqs: any): FAQItem[] => {
      if (!faqs) return [];
      if (Array.isArray(faqs)) {
        return faqs.map((faq, index) => ({
          question: faq.question || faq.q || '',
          answer: faq.answer || faq.a || '',
          order: faq.order || index + 1,
        }));
      }
      if (typeof faqs === 'string') {
        // Try to parse as JSON first
        try {
          const parsed = JSON.parse(faqs);
          if (Array.isArray(parsed)) {
            return parsed.map((faq, index) => ({
              question: faq.question || faq.q || '',
              answer: faq.answer || faq.a || '',
              order: faq.order || index + 1,
            }));
          }
        } catch {
          // Parse pipe-delimited format: "Q: Question||A: Answer||Q: Question2||A: Answer2"
          const parts = faqs.split('||');
          const faqItems: FAQItem[] = [];
          let currentQuestion = '';
          
          for (let i = 0; i < parts.length; i++) {
            const part = parts[i].trim();
            if (part.startsWith('Q:')) {
              currentQuestion = part.substring(2).trim();
            } else if (part.startsWith('A:') && currentQuestion) {
              faqItems.push({
                question: currentQuestion,
                answer: part.substring(2).trim(),
                order: faqItems.length + 1,
              });
              currentQuestion = '';
            }
          }
          
          return faqItems;
        }
      }
      return [];
    };

    // Convert legacy includes/excludes to structured format
    const convertToIncludeItems = (items: any): IncludeItem[] => {
      const parsed = parseArray(items);
      return parsed.map(item => ({
        category: 'other',
        item: item,
        description: '',
      }));
    };

    return {
      id: dbTour.id,
      slug: dbTour.slug,
      title: dbTour.title || dbTour.name,
      description: dbTour.description,
      status: dbTour.status || 'published',
      version: dbTour.version || 1,
      templateId: dbTour.template_id,
      
      category: dbTour.category,
      durationDays: dbTour.duration_days,
      duration: dbTour.duration,
      departureTime: dbTour.departure_time,
      pickup: dbTour.pickup,
      groupSizeMax: dbTour.group_size_max,
      
      // Use structured fields if available, otherwise convert from legacy
      structuredItinerary: dbTour.structured_itinerary || [],
      structuredHighlights: dbTour.structured_highlights || parseArray(dbTour.highlights),
      structuredIncludes: dbTour.structured_includes || convertToIncludeItems(dbTour.included),
      structuredExcludes: dbTour.structured_excludes || convertToIncludeItems(dbTour.excluded),
      structuredFaqs: dbTour.structured_faqs || parseFAQs(dbTour.faqs),
      
      pricingTiers: dbTour.pricing_tiers || (dbTour.price ? [{
        id: 'default',
        name: 'Standard',
        pricePerPerson: dbTour.price,
        currency: 'ZAR',
      }] : []),
      images: dbTour.images || [],
      seoData: dbTour.seo_data || {},
      
      aiGenerated: dbTour.ai_generated || false,
      publishedAt: dbTour.published_at,
      createdAt: dbTour.created_at,
      updatedAt: dbTour.updated_at,
      deletedAt: dbTour.deleted_at,
      
      // Keep legacy fields for backward compatibility
      price: dbTour.price,
      imageUrl: dbTour.image_url,
      itinerary: dbTour.itinerary,
      highlights: dbTour.highlights,
      included: dbTour.included,
      excluded: dbTour.excluded,
      faqs: dbTour.faqs,
      
      cancellationPolicy: dbTour.cancellation_policy,
      seasonalNotes: dbTour.seasonal_notes,
      childPolicy: dbTour.child_policy,
      accessibility: dbTour.accessibility,
      mapEmbed: dbTour.map_embed,
      reviewSnippet: dbTour.review_snippet,
    };
  }

  private mapDbToTemplate(dbTemplate: any): TourTemplate {
    return {
      id: dbTemplate.id,
      name: dbTemplate.name,
      description: dbTemplate.description,
      category: dbTemplate.category,
      templateData: dbTemplate.template_data,
      isActive: dbTemplate.is_active,
      usageCount: dbTemplate.usage_count,
      createdAt: dbTemplate.created_at,
      updatedAt: dbTemplate.updated_at,
    };
  }

  private extractStructure(tour: any) {
    return {
      sections: {
        overview: !!tour.description,
        itinerary: !!tour.structured_itinerary,
        highlights: !!tour.structured_highlights,
        includes: !!tour.structured_includes,
        excludes: !!tour.structured_excludes,
        faqs: !!tour.structured_faqs,
        pricing: !!tour.pricing_tiers,
        location: !!tour.map_embed,
        reviews: false,
      },
      requiredFields: ['title', 'description', 'category'],
      optionalFields: ['duration', 'departureTime', 'pickup'],
    };
  }

  private extractDefaults(tour: any) {
    return {
      category: tour.category,
      durationDays: tour.duration_days,
      duration: tour.duration,
      departureTime: tour.departure_time,
      pickup: tour.pickup,
      groupSizeMax: tour.group_size_max,
      cancellationPolicy: tour.cancellation_policy,
      childPolicy: tour.child_policy,
      accessibility: tour.accessibility,
    };
  }

  private async callAIService(request: AIGenerationRequest): Promise<{ data: Partial<EnhancedTour>; tokensUsed: number }> {
    // This is a placeholder for AI integration
    // You would integrate with OpenAI, Anthropic, or other AI services here
    
    // For now, return sample generated content
    const sampleContent: Partial<EnhancedTour> = {
      title: request.input.title || 'Generated Tour',
      description: 'This is an AI-generated tour description. In production, this would be generated by the AI service.',
      structuredHighlights: [
        'AI-generated highlight 1',
        'AI-generated highlight 2',
        'AI-generated highlight 3',
      ],
      structuredFaqs: [
        {
          question: 'Is this tour suitable for children?',
          answer: 'Yes, this tour is family-friendly and suitable for children of all ages.',
          order: 1,
        },
        {
          question: 'What should I bring?',
          answer: 'Comfortable walking shoes, sunscreen, and a camera are recommended.',
          order: 2,
        },
      ],
    };

    return {
      data: sampleContent,
      tokensUsed: 500, // Mock token count
    };
  }
}

export const tourService = new TourManagementService();
