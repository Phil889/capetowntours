/**
 * Translation Validation Script
 * Validates translation completeness and generates detailed reports
 */

import fs from 'fs/promises';
import path from 'path';
import { locales, defaultLocale, type Locale } from '../../lib/i18n/config';

interface ValidationResult {
  locale: Locale;
  status: 'pass' | 'fail' | 'warning';
  totalKeys: number;
  missingKeys: string[];
  emptyValues: string[];
  issues: ValidationIssue[];
  completionPercentage: number;
}

interface ValidationIssue {
  type: 'missing_key' | 'empty_value' | 'invalid_format' | 'encoding_issue' | 'length_mismatch';
  key: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
}

interface TranslationReport {
  timestamp: string;
  summary: {
    totalLocales: number;
    totalKeys: number;
    overallCompletion: number;
    passedLocales: number;
    failedLocales: number;
  };
  localeResults: ValidationResult[];
  recommendations: string[];
}

class TranslationValidator {
  private translations: Record<Locale, any> = {} as Record<Locale, any>;
  private baseKeys: string[] = [];

  constructor() {}

  async loadTranslations(): Promise<void> {
    console.log('Loading translation files...');
    
    for (const locale of locales) {
      try {
        const filePath = path.join(process.cwd(), '..', '..', 'messages', `${locale}.json`);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        this.translations[locale] = JSON.parse(fileContent);
        console.log(`✓ Loaded ${locale}.json`);
      } catch (error) {
        console.error(`✗ Failed to load ${locale}.json:`, error);
        this.translations[locale] = {};
      }
    }

    // Extract all keys from the default locale as baseline
    this.baseKeys = this.extractAllKeys(this.translations[defaultLocale] || {});
    console.log(`Found ${this.baseKeys.length} base keys in ${defaultLocale}`);
  }

  private extractAllKeys(obj: any, prefix = ''): string[] {
    let keys: string[] = [];
    
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        keys = keys.concat(this.extractAllKeys(value, fullKey));
      } else {
        keys.push(fullKey);
      }
    }
    
    return keys;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  private validateTranslationValue(value: any, key: string): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Check for empty values
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      issues.push({
        type: 'empty_value',
        key,
        message: 'Translation value is empty or missing',
        severity: 'high'
      });
      return issues;
    }

    // Check for translation artifacts
    if (typeof value === 'string') {
      const artifacts = ['TODO', 'FIXME', '{{', '}}', 'TRANSLATE', 'undefined'];
      const lowerValue = value.toLowerCase();
      
      for (const artifact of artifacts) {
        if (lowerValue.includes(artifact.toLowerCase())) {
          issues.push({
            type: 'invalid_format',
            key,
            message: `Contains translation artifact: ${artifact}`,
            severity: 'high'
          });
        }
      }

      // Check for suspicious HTML
      if (value.includes('<script>') || value.includes('<iframe>')) {
        issues.push({
          type: 'encoding_issue',
          key,
          message: 'Contains potentially unsafe HTML',
          severity: 'high'
        });
      }

      // Check for reasonable length (very short or very long might be issues)
      if (value.length < 2) {
        issues.push({
          type: 'length_mismatch',
          key,
          message: 'Translation is suspiciously short',
          severity: 'medium'
        });
      } else if (value.length > 500) {
        issues.push({
          type: 'length_mismatch',
          key,
          message: 'Translation is suspiciously long',
          severity: 'low'
        });
      }
    }

    return issues;
  }

  async validateLocale(locale: Locale): Promise<ValidationResult> {
    console.log(`Validating ${locale}...`);
    
    const result: ValidationResult = {
      locale,
      status: 'pass',
      totalKeys: this.baseKeys.length,
      missingKeys: [],
      emptyValues: [],
      issues: [],
      completionPercentage: 0
    };

    let validTranslations = 0;

    for (const key of this.baseKeys) {
      const value = this.getNestedValue(this.translations[locale], key);
      
      if (value === null || value === undefined) {
        result.missingKeys.push(key);
      } else {
        const issues = this.validateTranslationValue(value, key);
        result.issues.push(...issues);
        
        if (issues.length === 0) {
          validTranslations++;
        } else if (issues.some(issue => issue.type === 'empty_value')) {
          result.emptyValues.push(key);
        }
      }
    }

    result.completionPercentage = (validTranslations / this.baseKeys.length) * 100;

    // Determine overall status
    if (result.completionPercentage >= 95) {
      result.status = 'pass';
    } else if (result.completionPercentage >= 80) {
      result.status = 'warning';
    } else {
      result.status = 'fail';
    }

    console.log(`${locale}: ${result.completionPercentage.toFixed(1)}% complete (${result.status})`);
    
    return result;
  }

  async validateAll(): Promise<TranslationReport> {
    await this.loadTranslations();
    
    console.log('\nValidating translations...\n');
    
    const results: ValidationResult[] = [];
    
    for (const locale of locales) {
      const result = await this.validateLocale(locale);
      results.push(result);
    }

    const passedLocales = results.filter(r => r.status === 'pass').length;
    const failedLocales = results.filter(r => r.status === 'fail').length;
    const overallCompletion = results.reduce((sum, r) => sum + r.completionPercentage, 0) / results.length;

    const report: TranslationReport = {
      timestamp: new Date().toISOString(),
      summary: {
        totalLocales: locales.length,
        totalKeys: this.baseKeys.length,
        overallCompletion: Math.round(overallCompletion * 100) / 100,
        passedLocales,
        failedLocales
      },
      localeResults: results,
      recommendations: this.generateRecommendations(results)
    };

    return report;
  }

  private generateRecommendations(results: ValidationResult[]): string[] {
    const recommendations: string[] = [];
    
    const failedLocales = results.filter(r => r.status === 'fail');
    if (failedLocales.length > 0) {
      recommendations.push(
        `Priority: Complete translations for ${failedLocales.map(r => r.locale).join(', ')} (below 80% completion)`
      );
    }

    const warningLocales = results.filter(r => r.status === 'warning');
    if (warningLocales.length > 0) {
      recommendations.push(
        `Review translations for ${warningLocales.map(r => r.locale).join(', ')} (80-95% completion)`
      );
    }

    const commonMissingKeys = this.findCommonMissingKeys(results);
    if (commonMissingKeys.length > 0) {
      recommendations.push(
        `Add these missing keys across multiple locales: ${commonMissingKeys.slice(0, 5).join(', ')}`
      );
    }

    const highSeverityIssues = results.reduce((count, r) => 
      count + r.issues.filter(issue => issue.severity === 'high').length, 0
    );
    if (highSeverityIssues > 0) {
      recommendations.push(`Address ${highSeverityIssues} high-severity translation issues`);
    }

    if (results.some(r => r.locale === 'ar' && r.completionPercentage < 90)) {
      recommendations.push('Ensure Arabic translations are complete for proper RTL support');
    }

    return recommendations;
  }

  private findCommonMissingKeys(results: ValidationResult[]): string[] {
    const keyCount: Record<string, number> = {};
    
    results.forEach(result => {
      result.missingKeys.forEach(key => {
        keyCount[key] = (keyCount[key] || 0) + 1;
      });
    });

    return Object.entries(keyCount)
      .filter(([_, count]) => count >= 2) // Missing in 2+ locales
      .sort(([_, countA], [__, countB]) => countB - countA)
      .map(([key, _]) => key);
  }

  async generateReport(): Promise<void> {
    try {
      const report = await this.validateAll();
      
      console.log('\n' + '='.repeat(80));
      console.log('TRANSLATION VALIDATION REPORT');
      console.log('='.repeat(80));
      console.log(`Generated: ${report.timestamp}`);
      console.log(`Total Locales: ${report.summary.totalLocales}`);
      console.log(`Total Translation Keys: ${report.summary.totalKeys}`);
      console.log(`Overall Completion: ${report.summary.overallCompletion}%`);
      console.log(`Passed: ${report.summary.passedLocales}, Failed: ${report.summary.failedLocales}`);
      
      console.log('\nPER-LOCALE RESULTS:');
      console.log('-'.repeat(60));
      
      report.localeResults.forEach(result => {
        const status = result.status === 'pass' ? '✓' : 
                      result.status === 'warning' ? '⚠' : '✗';
        console.log(`${status} ${result.locale.toUpperCase()}: ${result.completionPercentage.toFixed(1)}% complete`);
        
        if (result.missingKeys.length > 0) {
          console.log(`  Missing: ${result.missingKeys.length} keys`);
        }
        if (result.emptyValues.length > 0) {
          console.log(`  Empty: ${result.emptyValues.length} values`);
        }
        if (result.issues.length > 0) {
          const high = result.issues.filter(i => i.severity === 'high').length;
          const medium = result.issues.filter(i => i.severity === 'medium').length;
          const low = result.issues.filter(i => i.severity === 'low').length;
          console.log(`  Issues: ${high} high, ${medium} medium, ${low} low`);
        }
      });
      
      if (report.recommendations.length > 0) {
        console.log('\nRECOMMENDATIONS:');
        console.log('-'.repeat(60));
        report.recommendations.forEach((rec, index) => {
          console.log(`${index + 1}. ${rec}`);
        });
      }

      // Save detailed report to file
      const reportPath = path.join(process.cwd(), 'translation-report.json');
      await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
      console.log(`\nDetailed report saved to: ${reportPath}`);
      
      console.log('\n' + '='.repeat(80));
      
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }
}

// Export for use in tests
export { TranslationValidator, type ValidationResult, type TranslationReport };

// CLI execution
if (require.main === module) {
  const validator = new TranslationValidator();
  validator.generateReport().catch(console.error);
}