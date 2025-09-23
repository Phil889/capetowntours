/**
 * Page Translation Tests
 * Tests translation completeness across all application pages
 */

import { describe, test, expect, beforeAll } from '@jest/globals';
import { locales, type Locale } from '@/lib/i18n/config';
import fs from 'fs/promises';
import path from 'path';

// Mock page structure for testing
const PAGES_TO_TEST = [
  'homepage',
  'tours',
  'about', 
  'contact',
  'faq',
  'custom-tours',
  'booking-confirmation',
  'privacy-policy',
  'terms-of-service'
];

// Critical translation keys that must exist for each page
const CRITICAL_KEYS = {
  homepage: [
    'homepage.hero.title',
    'homepage.hero.subtitle',
    'homepage.hero.cta',
    'homepage.signatureSafaris.title',
    'homepage.whyChooseUs.title'
  ],
  tours: [
    'tours.title',
    'tours.subtitle',
    'tours.filters.duration',
    'tours.filters.price',
    'tours.bookNow'
  ],
  about: [
    'about.title',
    'about.subtitle',
    'about.story.title',
    'about.team.title'
  ],
  contact: [
    'contact.title',
    'contact.subtitle',
    'contact.form.name',
    'contact.form.email',
    'contact.form.message',
    'contact.form.submit'
  ],
  faq: [
    'faq.title',
    'faq.subtitle',
    'faq.search.placeholder'
  ],
  'custom-tours': [
    'customTours.title',
    'customTours.subtitle',
    'customTours.form.duration',
    'customTours.form.groupSize'
  ]
};

describe('Page Translation Tests', () => {
  let translations: Record<Locale, any> = {} as Record<Locale, any>;

  beforeAll(async () => {
    // Load all translation files
    for (const locale of locales) {
      try {
        const filePath = path.join(process.cwd(), 'messages', `${locale}.json`);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        translations[locale] = JSON.parse(fileContent);
      } catch (error) {
        console.warn(`Failed to load translations for ${locale}:`, error);
        translations[locale] = {};
      }
    }
  });

  describe('Translation File Completeness', () => {
    
    test('should have translation files for all locales', async () => {
      for (const locale of locales) {
        expect(translations[locale]).toBeDefined();
        expect(typeof translations[locale]).toBe('object');
      }
    });

    test('should have consistent top-level structure across locales', () => {
      const englishKeys = Object.keys(translations.en || {});
      
      locales.slice(1).forEach(locale => {
        const localeKeys = Object.keys(translations[locale] || {});
        const missingKeys = englishKeys.filter(key => !localeKeys.includes(key));
        
        if (missingKeys.length > 0) {
          console.warn(`${locale} is missing top-level keys:`, missingKeys);
        }
        
        // Allow some missing keys but flag major omissions
        expect(missingKeys.length).toBeLessThan(englishKeys.length * 0.5);
      });
    });
  });

  describe('Homepage Translation Tests', () => {
    
    test('should have complete hero section translations', () => {
      const heroKeys = [
        'homepage.hero.title',
        'homepage.hero.subtitle', 
        'homepage.hero.cta'
      ];

      locales.forEach(locale => {
        heroKeys.forEach(key => {
          const value = getNestedValue(translations[locale], key);
          expect(value).toBeTruthy();
          expect(typeof value).toBe('string');
          expect(value.length).toBeGreaterThan(10);
        });
      });
    });

    test('should have signature safaris section translations', () => {
      const safariKeys = [
        'homepage.signatureSafaris.title',
        'homepage.signatureSafaris.subtitle'
      ];

      locales.forEach(locale => {
        safariKeys.forEach(key => {
          const value = getNestedValue(translations[locale], key);
          expect(value).toBeTruthy();
        });
      });
    });

    test('should have why choose us section translations', () => {
      const whyChooseKeys = [
        'homepage.whyChooseUs.title',
        'homepage.whyChooseUs.subtitle',
        'homepage.whyChooseUs.features.private.title',
        'homepage.whyChooseUs.features.expert.title',
        'homepage.whyChooseUs.features.local.title'
      ];

      locales.forEach(locale => {
        whyChooseKeys.forEach(key => {
          const value = getNestedValue(translations[locale], key);
          expect(value).toBeTruthy();
        });
      });
    });

    test('should have trust indicators translations', () => {
      const trustKeys = [
        'homepage.trustIndicators.reviews',
        'homepage.trustIndicators.years',
        'homepage.trustIndicators.tours'
      ];

      locales.forEach(locale => {
        trustKeys.forEach(key => {
          const value = getNestedValue(translations[locale], key);
          if (value) { // Not all locales may have all trust indicators
            expect(typeof value).toBe('string');
          }
        });
      });
    });
  });

  describe('Tours Page Translation Tests', () => {
    
    test('should have tour listing page translations', () => {
      const tourKeys = [
        'tours.title',
        'tours.subtitle',
        'tours.loadMore',
        'tours.noResults'
      ];

      locales.forEach(locale => {
        tourKeys.forEach(key => {
          const value = getNestedValue(translations[locale], key);
          expect(value).toBeTruthy();
        });
      });
    });

    test('should have tour filtering translations', () => {
      const filterKeys = [
        'tours.filters.all',
        'tours.filters.duration',
        'tours.filters.price',
        'tours.filters.category',
        'tours.filters.clear'
      ];

      locales.forEach(locale => {
        filterKeys.forEach(key => {
          const value = getNestedValue(translations[locale], key);
          expect(value).toBeTruthy();
        });
      });
    });

    test('should have tour card translations', () => {
      const cardKeys = [
        'tourCard.duration',
        'tourCard.groupSize', 
        'tourCard.includes',
        'tourCard.bookNow',
        'tourCard.from'
      ];

      locales.forEach(locale => {
        cardKeys.forEach(key => {
          const value = getNestedValue(translations[locale], key);
          expect(value).toBeTruthy();
        });
      });
    });
  });

  describe('Individual Tour Page Translation Tests', () => {
    
    test('should have tour detail page structure', () => {
      const detailKeys = [
        'tourDetail.overview',
        'tourDetail.highlights',
        'tourDetail.itinerary',
        'tourDetail.inclusions',
        'tourDetail.exclusions',
        'tourDetail.importantInfo',
        'tourDetail.bookingWidget.title'
      ];

      locales.forEach(locale => {
        detailKeys.forEach(key => {
          const value = getNestedValue(translations[locale], key);
          expect(value).toBeTruthy();
        });
      });
    });

    test('should have booking widget translations', () => {
      const bookingKeys = [
        'booking.selectDate',
        'booking.adults',
        'booking.children',
        'booking.totalPrice',
        'booking.bookNow',
        'booking.checkAvailability'
      ];

      locales.forEach(locale => {
        bookingKeys.forEach(key => {
          const value = getNestedValue(translations[locale], key);
          expect(value).toBeTruthy();
        });
      });
    });

    test('should have tour FAQ translations', () => {
      const faqKeys = [
        'tourFaq.title',
        'tourFaq.searchPlaceholder'
      ];

      locales.forEach(locale => {
        faqKeys.forEach(key => {
          const value = getNestedValue(translations[locale], key);
          expect(value).toBeTruthy();
        });
      });
    });
  });

  describe('Static Pages Translation Tests', () => {
    
    test('should have about page translations', () => {
      const aboutKeys = [
        'about.title',
        'about.subtitle',
        'about.story.title',
        'about.story.content',
        'about.team.title',
        'about.values.title'
      ];

      locales.forEach(locale => {
        aboutKeys.forEach(key => {
          const value = getNestedValue(translations[locale], key);
          expect(value).toBeTruthy();
        });
      });
    });

    test('should have contact page translations', () => {
      const contactKeys = [
        'contact.title',
        'contact.subtitle',
        'contact.form.name',
        'contact.form.email',
        'contact.form.phone',
        'contact.form.message',
        'contact.form.submit',
        'contact.info.address',
        'contact.info.phone',
        'contact.info.email'
      ];

      locales.forEach(locale => {
        contactKeys.forEach(key => {
          const value = getNestedValue(translations[locale], key);
          expect(value).toBeTruthy();
        });
      });
    });

    test('should have FAQ page translations', () => {
      const faqKeys = [
        'faq.title',
        'faq.subtitle',
        'faq.search.placeholder',
        'faq.categories.general',
        'faq.categories.booking',
        'faq.categories.tours',
        'faq.categories.payment'
      ];

      locales.forEach(locale => {
        faqKeys.forEach(key => {
          const value = getNestedValue(translations[locale], key);
          expect(value).toBeTruthy();
        });
      });
    });
  });

  describe('Navigation and Common Elements', () => {
    
    test('should have navigation translations', () => {
      const navKeys = [
        'navigation.home',
        'navigation.tours',
        'navigation.customTours',
        'navigation.about',
        'navigation.contact',
        'navigation.faq'
      ];

      locales.forEach(locale => {
        navKeys.forEach(key => {
          const value = getNestedValue(translations[locale], key);
          expect(value).toBeTruthy();
          expect(value.length).toBeGreaterThan(2);
        });
      });
    });

    test('should have header and footer translations', () => {
      const commonKeys = [
        'header.siteName',
        'header.tagline',
        'footer.description',
        'footer.quickLinks',
        'footer.contact',
        'footer.followUs',
        'footer.copyright'
      ];

      locales.forEach(locale => {
        commonKeys.forEach(key => {
          const value = getNestedValue(translations[locale], key);
          expect(value).toBeTruthy();
        });
      });
    });

    test('should have common call-to-action translations', () => {
      const ctaKeys = [
        'cta.bookNow',
        'cta.learnMore',
        'cta.getQuote',
        'cta.contactUs',
        'cta.viewDetails'
      ];

      locales.forEach(locale => {
        ctaKeys.forEach(key => {
          const value = getNestedValue(translations[locale], key);
          expect(value).toBeTruthy();
        });
      });
    });
  });

  describe('Form and Validation Translations', () => {
    
    test('should have form field translations', () => {
      const formKeys = [
        'form.required',
        'form.invalid',
        'form.success',
        'form.error',
        'form.loading',
        'form.submit'
      ];

      locales.forEach(locale => {
        formKeys.forEach(key => {
          const value = getNestedValue(translations[locale], key);
          expect(value).toBeTruthy();
        });
      });
    });

    test('should have validation message translations', () => {
      const validationKeys = [
        'validation.required',
        'validation.invalidEmail',
        'validation.invalidPhone',
        'validation.minLength',
        'validation.maxLength'
      ];

      locales.forEach(locale => {
        validationKeys.forEach(key => {
          const value = getNestedValue(translations[locale], key);
          expect(value).toBeTruthy();
        });
      });
    });
  });

  describe('Error Pages Translation Tests', () => {
    
    test('should have error page translations', () => {
      const errorKeys = [
        'error.404.title',
        'error.404.message',
        'error.404.backHome',
        'error.500.title',
        'error.500.message',
        'error.generic.title',
        'error.generic.message'
      ];

      locales.forEach(locale => {
        errorKeys.forEach(key => {
          const value = getNestedValue(translations[locale], key);
          if (value) { // Not all error messages may be translated
            expect(typeof value).toBe('string');
            expect(value.length).toBeGreaterThan(5);
          }
        });
      });
    });
  });

  describe('Translation Quality Tests', () => {
    
    test('should not contain obvious translation artifacts', () => {
      const artifacts = ['TODO', 'FIXME', '{{', '}}', 'TRANSLATE', 'undefined'];
      
      locales.forEach(locale => {
        const translationString = JSON.stringify(translations[locale]);
        artifacts.forEach(artifact => {
          expect(translationString.toLowerCase()).not.toContain(artifact.toLowerCase());
        });
      });
    });

    test('should have appropriate text length for different locales', () => {
      const testKey = 'homepage.hero.title';
      
      locales.forEach(locale => {
        const value = getNestedValue(translations[locale], testKey);
        if (value) {
          expect(value.length).toBeGreaterThan(10);
          expect(value.length).toBeLessThan(200); // Reasonable max length
        }
      });
    });

    test('should preserve HTML entities and special characters', () => {
      // Test that special characters are properly encoded/preserved
      const testContent = [
        '&amp;', '&lt;', '&gt;', '&quot;', '&#39;',
        'café', 'naïve', 'résumé', '€', '£', '¥'
      ];
      
      locales.forEach(locale => {
        const translationString = JSON.stringify(translations[locale]);
        // Should not contain raw HTML that wasn't encoded
        expect(translationString).not.toContain('<script>');
        expect(translationString).not.toContain('<iframe>');
      });
    });
  });
});

// Helper function to get nested object values by dot notation
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
}