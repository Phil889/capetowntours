/**
 * RTL (Right-to-Left) Support Tests
 * Tests Arabic language RTL functionality across the application
 */

import { describe, test, expect } from '@jest/globals';
import { localeConfig, type Locale } from '@/lib/i18n/config';

// Mock DOM for testing
const mockDocument = {
  documentElement: {
    dir: 'ltr',
    lang: 'en',
    setAttribute: function(name: string, value: string) {
      this[name] = value;
    }
  }
};

// Mock CSS-in-JS or styled-components for RTL testing
const mockStyledComponent = (locale: Locale, styles: any) => {
  const isRTL = localeConfig[locale].dir === 'rtl';
  return {
    ...styles,
    direction: localeConfig[locale].dir,
    textAlign: isRTL ? 'right' : 'left',
    marginLeft: isRTL ? styles.marginRight : styles.marginLeft,
    marginRight: isRTL ? styles.marginLeft : styles.marginRight,
    paddingLeft: isRTL ? styles.paddingRight : styles.paddingLeft,
    paddingRight: isRTL ? styles.paddingLeft : styles.paddingRight,
  };
};

describe('RTL Support Tests', () => {

  describe('Basic RTL Configuration', () => {
    
    test('should correctly identify RTL locales', () => {
      expect(localeConfig.ar.dir).toBe('rtl');
      expect(localeConfig.en.dir).toBe('ltr');
      expect(localeConfig.de.dir).toBe('ltr');
      expect(localeConfig.fr.dir).toBe('ltr');
      expect(localeConfig.es.dir).toBe('ltr');
    });

    test('should have proper Arabic locale configuration', () => {
      const arabicConfig = localeConfig.ar;
      
      expect(arabicConfig.name).toBe('Arabic');
      expect(arabicConfig.nativeName).toBe('العربية');
      expect(arabicConfig.flag).toBe('🇸🇦');
      expect(arabicConfig.dir).toBe('rtl');
      expect(arabicConfig.currency).toBe('SAR');
      expect(arabicConfig.region).toBe('SA');
    });
  });

  describe('Document Direction Tests', () => {
    
    test('should set document direction for RTL', () => {
      const setDocumentDirection = (locale: Locale) => {
        const direction = localeConfig[locale].dir;
        mockDocument.documentElement.setAttribute('dir', direction);
        return mockDocument.documentElement.dir;
      };

      expect(setDocumentDirection('ar')).toBe('rtl');
      expect(setDocumentDirection('en')).toBe('ltr');
    });

    test('should set document language attribute', () => {
      const setDocumentLang = (locale: Locale) => {
        mockDocument.documentElement.setAttribute('lang', locale);
        return mockDocument.documentElement.lang;
      };

      expect(setDocumentLang('ar')).toBe('ar');
      expect(setDocumentLang('en')).toBe('en');
    });
  });

  describe('Layout and Styling Tests', () => {
    
    test('should apply correct text alignment for RTL', () => {
      const ltrStyles = mockStyledComponent('en', { textAlign: 'left' });
      const rtlStyles = mockStyledComponent('ar', { textAlign: 'left' });
      
      expect(ltrStyles.textAlign).toBe('left');
      expect(rtlStyles.textAlign).toBe('right');
    });

    test('should flip margins for RTL', () => {
      const baseStyles = { marginLeft: '20px', marginRight: '10px' };
      
      const ltrStyles = mockStyledComponent('en', baseStyles);
      const rtlStyles = mockStyledComponent('ar', baseStyles);
      
      expect(ltrStyles.marginLeft).toBe('20px');
      expect(ltrStyles.marginRight).toBe('10px');
      expect(rtlStyles.marginLeft).toBe('10px'); // Flipped
      expect(rtlStyles.marginRight).toBe('20px'); // Flipped
    });

    test('should flip padding for RTL', () => {
      const baseStyles = { paddingLeft: '15px', paddingRight: '25px' };
      
      const ltrStyles = mockStyledComponent('en', baseStyles);
      const rtlStyles = mockStyledComponent('ar', baseStyles);
      
      expect(ltrStyles.paddingLeft).toBe('15px');
      expect(ltrStyles.paddingRight).toBe('25px');
      expect(rtlStyles.paddingLeft).toBe('25px'); // Flipped
      expect(rtlStyles.paddingRight).toBe('15px'); // Flipped
    });

    test('should handle border radius for RTL', () => {
      const applyRTLBorderRadius = (locale: Locale, borderRadius: string) => {
        const isRTL = localeConfig[locale].dir === 'rtl';
        
        // For complex border radius like "10px 5px 15px 20px"
        // In RTL, we need to flip horizontal values
        const values = borderRadius.split(' ');
        if (values.length === 4 && isRTL) {
          // top-left, top-right, bottom-right, bottom-left
          // becomes: top-right, top-left, bottom-left, bottom-right
          return `${values[1]} ${values[0]} ${values[3]} ${values[2]}`;
        }
        
        return borderRadius;
      };

      expect(applyRTLBorderRadius('en', '10px 5px 15px 20px')).toBe('10px 5px 15px 20px');
      expect(applyRTLBorderRadius('ar', '10px 5px 15px 20px')).toBe('5px 10px 20px 15px');
    });
  });

  describe('Form Input RTL Tests', () => {
    
    test('should handle form input direction', () => {
      const mockInput = (locale: Locale) => ({
        dir: localeConfig[locale].dir,
        textAlign: localeConfig[locale].dir === 'rtl' ? 'right' : 'left'
      });

      const englishInput = mockInput('en');
      const arabicInput = mockInput('ar');

      expect(englishInput.dir).toBe('ltr');
      expect(englishInput.textAlign).toBe('left');
      expect(arabicInput.dir).toBe('rtl');
      expect(arabicInput.textAlign).toBe('right');
    });

    test('should handle placeholder text direction', () => {
      // Placeholder text should follow input direction but may need special handling
      const mockPlaceholder = (locale: Locale, text: string) => ({
        placeholder: text,
        dir: localeConfig[locale].dir,
        // In real implementation, might need to add RLE/LRE marks for mixed content
      });

      const englishPlaceholder = mockPlaceholder('en', 'Enter your name');
      const arabicPlaceholder = mockPlaceholder('ar', 'أدخل اسمك');

      expect(englishPlaceholder.dir).toBe('ltr');
      expect(arabicPlaceholder.dir).toBe('rtl');
    });
  });

  describe('Number and Date Formatting Tests', () => {
    
    test('should format numbers correctly for Arabic locale', () => {
      const formatNumber = (locale: Locale, number: number) => {
        const config = localeConfig[locale];
        // Mock implementation - real would use Intl.NumberFormat
        return {
          value: number,
          locale,
          formatted: number.toLocaleString(config.region === 'SA' ? 'ar-SA' : 'en-US'),
          currency: config.currency
        };
      };

      const price = 1500;
      const englishPrice = formatNumber('en', price);
      const arabicPrice = formatNumber('ar', price);

      expect(englishPrice.currency).toBe('USD');
      expect(arabicPrice.currency).toBe('SAR');
      expect(arabicPrice.locale).toBe('ar');
    });

    test('should format dates correctly for Arabic locale', () => {
      const formatDate = (locale: Locale, date: Date) => {
        const config = localeConfig[locale];
        return {
          locale,
          dir: config.dir,
          dateFormat: config.dateFormat,
          // Mock formatted date - real would use Intl.DateTimeFormat
          formatted: date.toLocaleDateString(config.region === 'SA' ? 'ar-SA' : 'en-US')
        };
      };

      const testDate = new Date('2024-01-15');
      const englishDate = formatDate('en', testDate);
      const arabicDate = formatDate('ar', testDate);

      expect(englishDate.dir).toBe('ltr');
      expect(englishDate.dateFormat).toBe('MM/dd/yyyy');
      expect(arabicDate.dir).toBe('rtl');
      expect(arabicDate.dateFormat).toBe('dd/MM/yyyy');
    });
  });

  describe('Navigation and Menu RTL Tests', () => {
    
    test('should handle navigation menu direction', () => {
      const mockNavigation = (locale: Locale) => {
        const isRTL = localeConfig[locale].dir === 'rtl';
        return {
          flexDirection: isRTL ? 'row-reverse' : 'row',
          textAlign: isRTL ? 'right' : 'left',
          dir: localeConfig[locale].dir
        };
      };

      const englishNav = mockNavigation('en');
      const arabicNav = mockNavigation('ar');

      expect(englishNav.flexDirection).toBe('row');
      expect(arabicNav.flexDirection).toBe('row-reverse');
    });

    test('should handle dropdown menu positioning', () => {
      const mockDropdown = (locale: Locale) => {
        const isRTL = localeConfig[locale].dir === 'rtl';
        return {
          left: isRTL ? 'auto' : '0',
          right: isRTL ? '0' : 'auto',
          dir: localeConfig[locale].dir
        };
      };

      const englishDropdown = mockDropdown('en');
      const arabicDropdown = mockDropdown('ar');

      expect(englishDropdown.left).toBe('0');
      expect(englishDropdown.right).toBe('auto');
      expect(arabicDropdown.left).toBe('auto');
      expect(arabicDropdown.right).toBe('0');
    });
  });

  describe('Icon and Image RTL Tests', () => {
    
    test('should handle directional icons', () => {
      const getDirectionalIcon = (locale: Locale, icon: string) => {
        const isRTL = localeConfig[locale].dir === 'rtl';
        
        // Map of icons that should be flipped in RTL
        const iconMap: Record<string, string> = {
          'arrow-left': isRTL ? 'arrow-right' : 'arrow-left',
          'arrow-right': isRTL ? 'arrow-left' : 'arrow-right',
          'chevron-left': isRTL ? 'chevron-right' : 'chevron-left',
          'chevron-right': isRTL ? 'chevron-left' : 'chevron-right',
        };

        return iconMap[icon] || icon;
      };

      expect(getDirectionalIcon('en', 'arrow-left')).toBe('arrow-left');
      expect(getDirectionalIcon('ar', 'arrow-left')).toBe('arrow-right');
      expect(getDirectionalIcon('en', 'arrow-right')).toBe('arrow-right');
      expect(getDirectionalIcon('ar', 'arrow-right')).toBe('arrow-left');
    });

    test('should handle image transformations', () => {
      const applyRTLTransform = (locale: Locale, transform: string = '') => {
        const isRTL = localeConfig[locale].dir === 'rtl';
        
        // For images that should be flipped in RTL (like UI elements, not photos)
        return isRTL ? `scaleX(-1) ${transform}` : transform;
      };

      expect(applyRTLTransform('en', 'rotate(10deg)')).toBe('rotate(10deg)');
      expect(applyRTLTransform('ar', 'rotate(10deg)')).toBe('scaleX(-1) rotate(10deg)');
    });
  });

  describe('Text Content RTL Tests', () => {
    
    test('should handle mixed content direction', () => {
      const handleMixedContent = (locale: Locale, content: string) => {
        const isRTL = localeConfig[locale].dir === 'rtl';
        
        // Check if content contains both Arabic and English
        const hasArabic = /[\u0600-\u06FF]/.test(content);
        const hasLatin = /[a-zA-Z]/.test(content);
        
        if (hasArabic && hasLatin) {
          // Mixed content - might need special handling
          return {
            content,
            dir: isRTL ? 'rtl' : 'ltr',
            needsSpecialHandling: true,
            // In real implementation, might wrap parts with directional marks
          };
        }
        
        return {
          content,
          dir: isRTL ? 'rtl' : 'ltr',
          needsSpecialHandling: false
        };
      };

      const arabicOnly = handleMixedContent('ar', 'مرحبا بكم في رحلاتنا');
      const mixedContent = handleMixedContent('ar', 'Welcome مرحبا to Safari رحلة');

      expect(arabicOnly.needsSpecialHandling).toBe(false);
      expect(mixedContent.needsSpecialHandling).toBe(true);
    });

    test('should handle punctuation in RTL', () => {
      const handleRTLPunctuation = (locale: Locale, text: string) => {
        const isRTL = localeConfig[locale].dir === 'rtl';
        
        if (!isRTL) return text;
        
        // In RTL, some punctuation might need special handling
        // This is a simplified example
        return text
          .replace(/\?/g, '؟') // Arabic question mark
          .replace(/,/g, '،'); // Arabic comma
      };

      const englishText = handleRTLPunctuation('en', 'Hello, how are you?');
      const arabicText = handleRTLPunctuation('ar', 'مرحبا, كيف حالك?');

      expect(englishText).toBe('Hello, how are you?');
      expect(arabicText).toBe('مرحبا، كيف حالك؟');
    });
  });

  describe('CSS Framework Integration Tests', () => {
    
    test('should generate RTL-aware CSS classes', () => {
      const generateRTLClasses = (locale: Locale, baseClasses: string) => {
        const isRTL = localeConfig[locale].dir === 'rtl';
        
        if (!isRTL) return baseClasses;
        
        // Map Tailwind classes to RTL equivalents
        return baseClasses
          .replace(/\bml-(\d+)\b/g, 'mr-$1') // margin-left to margin-right
          .replace(/\bmr-(\d+)\b/g, 'ml-$1') // margin-right to margin-left
          .replace(/\bpl-(\d+)\b/g, 'pr-$1') // padding-left to padding-right
          .replace(/\bpr-(\d+)\b/g, 'pl-$1') // padding-right to padding-left
          .replace(/\bleft-(\d+)\b/g, 'right-$1') // left positioning
          .replace(/\bright-(\d+)\b/g, 'left-$1') // right positioning
          .replace(/\btext-left\b/g, 'text-right') // text alignment
          .replace(/\btext-right\b/g, 'text-left');
      };

      const ltrClasses = generateRTLClasses('en', 'ml-4 pr-2 text-left');
      const rtlClasses = generateRTLClasses('ar', 'ml-4 pr-2 text-left');

      expect(ltrClasses).toBe('ml-4 pr-2 text-left');
      expect(rtlClasses).toBe('mr-4 pl-2 text-right');
    });

    test('should handle responsive RTL classes', () => {
      const generateResponsiveRTL = (locale: Locale, classes: string) => {
        const isRTL = localeConfig[locale].dir === 'rtl';
        
        if (!isRTL) return classes;
        
        // Handle responsive prefixes like sm:, md:, lg:
        return classes.replace(/(\w+:)(ml|mr|pl|pr|left|right|text-left|text-right)-/g, (match, prefix, property) => {
          const flippedProperty = {
            'ml': 'mr', 'mr': 'ml',
            'pl': 'pr', 'pr': 'pl',
            'left': 'right', 'right': 'left',
            'text-left': 'text-right', 'text-right': 'text-left'
          }[property] || property;
          
          return `${prefix}${flippedProperty}-`;
        });
      };

      const classes = 'md:ml-4 lg:text-left sm:pr-2';
      const rtlClasses = generateResponsiveRTL('ar', classes);

      expect(rtlClasses).toBe('md:mr-4 lg:text-right sm:pl-2');
    });
  });

  describe('Performance and Accessibility Tests', () => {
    
    test('should not degrade performance with RTL calculations', () => {
      const start = performance.now();
      
      // Simulate RTL style calculations
      for (let i = 0; i < 1000; i++) {
        mockStyledComponent('ar', {
          marginLeft: `${i}px`,
          paddingRight: `${i * 2}px`,
          textAlign: 'left'
        });
      }
      
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100); // Should complete in reasonable time
    });

    test('should maintain accessibility with RTL', () => {
      const createAccessibleRTLComponent = (locale: Locale) => {
        const isRTL = localeConfig[locale].dir === 'rtl';
        
        return {
          dir: localeConfig[locale].dir,
          lang: locale,
          'aria-label': isRTL ? 'قائمة التنقل' : 'Navigation menu',
          role: 'navigation',
          // Ensure screen readers handle direction correctly
          'aria-orientation': 'horizontal'
        };
      };

      const englishComponent = createAccessibleRTLComponent('en');
      const arabicComponent = createAccessibleRTLComponent('ar');

      expect(englishComponent.dir).toBe('ltr');
      expect(englishComponent.lang).toBe('en');
      expect(arabicComponent.dir).toBe('rtl');
      expect(arabicComponent.lang).toBe('ar');
      expect(arabicComponent['aria-label']).toBe('قائمة التنقل');
    });
  });
});