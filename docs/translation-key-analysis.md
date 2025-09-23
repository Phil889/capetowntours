# Translation Key Usage Analysis

## Translation Keys Found in Components

Based on analysis of the codebase, here are the translation usage patterns:

### Key Files Using Translations (24 files identified):

**Tour Components:**
- `components/tours/TourPageTemplate.tsx`
- `components/tours/sections/TourLocation/index.tsx`
- `components/tours/sections/TourImportantInfo/index.tsx`
- `components/tours/sections/TourItinerary/index.tsx`
- `components/tours/PremiumBookingWidget.tsx`
- `components/tours/booking-widget.tsx`
- `components/tours/MobileBookingSheet.tsx`
- `components/tours/sections/TourTrustBar/index.tsx`

**Page Components:**
- `app/[locale]/page.tsx`
- `app/[locale]/tours/page.tsx`
- `app/[locale]/tours/custom/page.tsx`
- `app/[locale]/faq/page.tsx`
- `app/[locale]/about/page.tsx`
- `app/[locale]/contact/page.tsx`

**Utility & Infrastructure:**
- `lib/i18n/hooks.ts`
- `lib/i18n/server.ts`
- `lib/i18n/get-translations.ts`

## Common Translation Patterns

### 1. Header Component Usage
```typescript
// components/layout/header.tsx
{t("logoAlt")}
{t("siteName")}
{t("tagline")}
{t("nav.tours")}
{t("nav.customTours")}
{t("bookNow")}
```

### 2. Footer Component Usage
```typescript
// components/layout/footer.tsx
{t("newsletter.title")}
{t("newsletter.placeholder")}
{t("nav.home")}
{t("sections.navigate")}
{t("legal.copyright")}
```

### 3. Tour Detail Pages
```typescript
{t("tour_detail.about_this_experience")}
{t("tour_detail.your_journey")}
{t("tour_detail.whats_included")}
{t("tour_detail.important_information")}
```

### 4. Booking Flow
```typescript
{t("booking.book_your_tour")}
{t("booking.guests")}
{t("booking.full_name")}
{t("booking.email_address")}
{t("booking.phone_number")}
```

## Translation Key Structure Analysis

### Well-Organized Sections:
- `navigation.*` - Navigation elements
- `header.*` - Header components
- `homepage.*` - Homepage content
- `footer.*` - Footer elements
- `tours.*` - Tour listing pages
- `customTour.*` - Custom tour planner
- `booking.*` - Booking process
- `tour_detail.*` - Tour detail pages
- `badges.*` - Trust badges and indicators
- `accessibility.*` - Accessibility features
- `faq.*` - FAQ pages

### Key Naming Conventions:
- Mostly consistent dot notation (e.g., `header.nav.tours`)
- Some variations: `bookNow` vs `book_now_pay_pickup`
- Hierarchical structure generally maintained
- Some inconsistency in pluralization

## Hardcoded Text Patterns Identified

Based on grep analysis of string literals in components:

### 1. Console Logging (Development artifacts)
- Various console.log statements with hardcoded messages
- Should be removed or made translatable for user-facing errors

### 2. Button Text
- Some button labels might be hardcoded
- Form submission text
- Action labels

### 3. Error Messages
- API error responses
- Validation messages
- System status messages

### 4. Placeholder Text
- Input field placeholders
- Loading states
- Default content

## Translation Function Usage Patterns

### Server-Side Components:
```typescript
import { getTranslations } from '@/lib/i18n/server';
const t = await getTranslations(locale);
```

### Client-Side Components:
```typescript
import { useTranslations } from '@/lib/i18n/hooks';
const t = useTranslations();
```

### Dynamic Translation Loading:
```typescript
import { getTranslations } from "@/lib/i18n/get-translations";
const t = await getTranslations(params.locale);
```

## Potential Issues Identified

### 1. Key Inconsistencies
- Mixed naming conventions (`camelCase` vs `snake_case`)
- Some keys use pluralization, others don't
- Inconsistent depth in nested structures

### 2. Unused Keys Detection Needed
- Some translation keys may not have corresponding usage
- Legacy keys from previous versions might remain
- Extended content in some languages not used

### 3. Missing Context
- Translation keys lack context information
- No description field for translators
- Complex interpolated strings need better documentation

## Recommendations

### Immediate Actions:
1. Standardize key naming conventions across all languages
2. Remove unused translation keys
3. Add context/description fields for translators
4. Implement validation for key completeness

### Development Process:
1. Add eslint rules to catch hardcoded strings
2. Implement translation key usage tracking
3. Create automated tests for translation completeness
4. Set up CI/CD checks for translation validation

### Long-term Improvements:
1. Implement translation management interface
2. Add pluralization support where needed
3. Create translation style guide
4. Set up automated translation quality checks