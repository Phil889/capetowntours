# FAQ SEO Enhancement Plan for Cape Town Safari Tours

## Objective
Enhance FAQ sections for each tour page to improve SEO relevancy, target search snippets, and gather questions from Google's "People Also Ask" section. Goal: At least 10 SEO-optimized FAQs per tour.

## Current Setup Analysis
- **Storage**: FAQs stored in Supabase `tours` table, `faqs` column
- **Format**: `Q: question||A: answer||Q: question||A: answer`
- **Display**: On tour detail pages (`app/tours/[slug]/page.tsx`)
- **Available Tools**: Playwright MCP for web scraping

## Implementation Plan

### Phase 1: Research & Data Gathering
1. **Create Python script** (`gather_faq_questions.py`):
   - Fetch all tour titles from Supabase
   - Use Playwright MCP to search Google for each tour
   - Extract "People Also Ask" questions
   - Get related searches and common queries
   - Store gathered questions temporarily

2. **Target Question Types for Featured Snippets**:
   - "What is included in [tour name]?"
   - "How long does [tour] take?"
   - "Is [tour] worth it?"
   - "What should I wear for [tour]?"
   - "Best time to visit [location]"
   - "How much does [tour] cost?"
   - "Is [tour] suitable for children?"
   - "What is the cancellation policy?"
   - "Where does [tour] depart from?"
   - "Do I need to book in advance?"

### Phase 2: FAQ Content Generation
1. **Answer Structure for SEO**:
   - Direct answer in first sentence (featured snippet target)
   - 50-150 words optimal length
   - Include relevant keywords naturally
   - Add tour-specific details and USPs
   - Use lists and structured format where appropriate

2. **FAQ Categories**:
   - **Practical Info**: Duration, pickup, what to bring, meeting point
   - **Experience Details**: What to see, highlights, activities included
   - **Booking & Pricing**: Cancellation, group discounts, payment methods
   - **Safety & Accessibility**: Age limits, fitness requirements, wheelchair access
   - **Seasonal**: Best time to visit, weather considerations

### Phase 3: Database Update
1. **Supabase Updates**:
   - Update `faqs` column with enhanced Q&As
   - Maintain existing format for compatibility
   - Ensure minimum 10 FAQs per tour
   - Include location and tour-specific keywords

### Phase 4: Frontend Enhancement
1. **Improve FAQ Display**:
   - Add collapsible accordion UI
   - Implement schema.org FAQ structured data
   - Add search within FAQs functionality
   - Optimize for Core Web Vitals

### Phase 5: SEO Optimization
1. **Structured Data Implementation**:
   - FAQPage schema markup
   - Question/Answer schema pairs
   - TourismTour schema integration
   - LocalBusiness schema enhancement

## Technical Implementation Steps

### Step 1: Gather Tour Data
```python
# Script: gather_faq_questions.py
1. Connect to Supabase
2. Fetch all tours with slug and title
3. Create output file for questions
```

### Step 2: Google Search & Scraping
```javascript
// Using Playwright MCP
1. Search "[tour name] Cape Town"
2. Extract "People Also Ask" questions
3. Get related searches
4. Search for tour-specific queries
```

### Step 3: Generate SEO Answers
```python
# Script: generate_faq_answers.py
1. For each question, create optimized answer
2. Include keywords: Cape Town, safari, tour, specific locations
3. Format for featured snippets
4. Ensure factual accuracy
```

### Step 4: Update Database
```python
# Script: update_tour_faqs.py
1. Format FAQs in required structure
2. Update Supabase tours table
3. Verify updates
```

### Step 5: Add Schema Markup
```typescript
// Component: components/tours/FAQSchema.tsx
1. Create JSON-LD structured data component
2. Map FAQs to schema.org format
3. Include in tour detail page
```

## Expected SEO Benefits

1. **Featured Snippets**: Direct answers targeting position zero
2. **People Also Ask**: Appearance in PAA boxes
3. **Long-tail Keywords**: Coverage of specific queries
4. **Voice Search**: Optimized for conversational queries
5. **Rich Results**: Enhanced SERP appearance
6. **User Experience**: Comprehensive information reduces bounce rate

## Success Metrics

- Increase in organic traffic from informational queries
- Appearance in featured snippets for tour-related questions
- Higher click-through rates from SERPs
- Reduced bounce rate on tour pages
- Improved average session duration

## Sample FAQ Structure

```json
{
  "tour": "Cape Peninsula Tour",
  "faqs": [
    {
      "question": "How long is the Cape Peninsula tour from Cape Town?",
      "answer": "The Cape Peninsula tour is a full-day experience lasting approximately 8-9 hours. The tour departs at 8:30 AM and returns around 5:30 PM, covering key attractions including Cape Point, Boulder's Beach penguins, and Chapman's Peak Drive."
    },
    {
      "question": "Is the Cape Peninsula tour worth it?",
      "answer": "Yes, the Cape Peninsula tour is absolutely worth it as one of Cape Town's most scenic and diverse experiences. You'll see African penguins, dramatic coastal views, Cape Point lighthouse, and the meeting point of two oceans, all in one memorable day with expert guides."
    }
  ]
}
```

## Next Steps

1. Execute Phase 1: Gather questions from Google
2. Generate SEO-optimized answers
3. Update Supabase with enhanced FAQs
4. Implement schema markup
5. Monitor performance and iterate

---

*Document created: January 8, 2025*
*Purpose: SEO enhancement of tour FAQ sections*
*Target: Featured snippets and People Also Ask boxes*
