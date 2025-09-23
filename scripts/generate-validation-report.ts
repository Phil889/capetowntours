#!/usr/bin/env tsx
/**
 * Tour Pages Validation Report Generator
 * Creates comprehensive markdown report with detailed findings and recommendations
 */

import TourPageValidator from './validate-tour-pages';
import fs from 'fs/promises';
import path from 'path';

interface ValidationResult {
  tourSlug: string;
  locale: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  score: number;
  metrics: {
    loadTime: number;
    reviewsCount: number;
    averageRating: number;
    hasValidContent: boolean;
    hasLanguageSpecificContent: boolean;
    seoOptimized: boolean;
    performanceGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  };
  issues: Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
    impact: 'high' | 'medium' | 'low';
  }>;
}

interface ValidationReport {
  timestamp: string;
  totalTours: number;
  totalLanguages: number;
  totalTests: number;
  overallScore: number;
  results: ValidationResult[];
  summary: {
    statusDistribution: Record<'PASS' | 'FAIL' | 'WARNING', number>;
    languageScores: Record<string, number>;
    tourScores: Record<string, number>;
    performanceMetrics: {
      averageLoadTime: number;
      fastestTour: string;
      slowestTour: string;
      reviewsCoverage: number;
    };
    recommendations: string[];
  };
}

class ReportGenerator {
  private report: ValidationReport;

  constructor(report: ValidationReport) {
    this.report = report;
  }

  async generateMarkdownReport(): Promise<string> {
    const timestamp = new Date(this.report.timestamp).toLocaleString();
    
    let markdown = `# Tour Pages Validation Report

**Generated:** ${timestamp}  
**Total Tours:** ${this.report.totalTours}  
**Languages:** ${this.report.totalLanguages}  
**Total Tests:** ${this.report.totalTests}  

## 🎯 Executive Summary

| Metric | Value | Status |
|--------|-------|--------|
| **Overall Score** | ${this.report.overallScore}% | ${this.getScoreEmoji(this.report.overallScore)} ${this.getScoreStatus(this.report.overallScore)} |
| **Tests Passed** | ${this.report.summary.statusDistribution.PASS}/${this.report.totalTests} | ${Math.round((this.report.summary.statusDistribution.PASS / this.report.totalTests) * 100)}% |
| **Avg Load Time** | ${this.report.summary.performanceMetrics.averageLoadTime}ms | ${this.getPerformanceStatus(this.report.summary.performanceMetrics.averageLoadTime)} |
| **Reviews Coverage** | ${this.report.summary.performanceMetrics.reviewsCoverage}% | ${this.getCoverageStatus(this.report.summary.performanceMetrics.reviewsCoverage)} |

## 📊 Test Results Distribution

\`\`\`
✅ PASS:    ${this.report.summary.statusDistribution.PASS.toString().padStart(3)} tests (${Math.round((this.report.summary.statusDistribution.PASS / this.report.totalTests) * 100)}%)
⚠️  WARNING: ${this.report.summary.statusDistribution.WARNING.toString().padStart(3)} tests (${Math.round((this.report.summary.statusDistribution.WARNING / this.report.totalTests) * 100)}%)
❌ FAIL:    ${this.report.summary.statusDistribution.FAIL.toString().padStart(3)} tests (${Math.round((this.report.summary.statusDistribution.FAIL / this.report.totalTests) * 100)}%)
\`\`\`

`;

    // Language Performance Section
    markdown += this.generateLanguagePerformanceSection();
    
    // Tour Performance Section
    markdown += this.generateTourPerformanceSection();
    
    // Detailed Test Results
    markdown += this.generateDetailedResultsSection();
    
    // Performance Analysis
    markdown += this.generatePerformanceAnalysisSection();
    
    // Issues Analysis
    markdown += this.generateIssuesAnalysisSection();
    
    // Recommendations
    markdown += this.generateRecommendationsSection();
    
    // Appendix
    markdown += this.generateAppendixSection();

    return markdown;
  }

  private generateLanguagePerformanceSection(): string {
    let section = `## 🌍 Language Performance Analysis

| Language | Score | Status | Test Results | Performance |
|----------|-------|--------|--------------|-------------|
`;

    Object.entries(this.report.summary.languageScores).forEach(([locale, score]) => {
      const localeResults = this.report.results.filter(r => r.locale === locale);
      const passed = localeResults.filter(r => r.status === 'PASS').length;
      const total = localeResults.length;
      const avgLoadTime = Math.round(
        localeResults.reduce((sum, r) => sum + r.metrics.loadTime, 0) / localeResults.length
      );
      
      section += `| ${this.getLanguageName(locale)} (${locale}) | ${score}% | ${this.getScoreEmoji(score)} | ${passed}/${total} | ${avgLoadTime}ms |\n`;
    });

    section += '\n### Language-Specific Insights\n\n';
    
    // Find best and worst performing languages
    const languageEntries = Object.entries(this.report.summary.languageScores);
    const bestLanguage = languageEntries.reduce((best, current) => current[1] > best[1] ? current : best);
    const worstLanguage = languageEntries.reduce((worst, current) => current[1] < worst[1] ? current : worst);

    section += `🏆 **Best Performing Language:** ${this.getLanguageName(bestLanguage[0])} (${bestLanguage[1]}%)  
🚨 **Needs Attention:** ${this.getLanguageName(worstLanguage[0])} (${worstLanguage[1]}%)

`;

    // Arabic RTL specific analysis
    const arabicResults = this.report.results.filter(r => r.locale === 'ar');
    const arabicRTLSupport = arabicResults.filter(r => r.metrics.hasLanguageSpecificContent).length;
    
    section += `📝 **Arabic RTL Support:** ${arabicRTLSupport}/${arabicResults.length} tours have proper RTL content\n\n`;

    return section;
  }

  private generateTourPerformanceSection(): string {
    let section = `## 🏞️ Tour Performance Analysis

### Top Performing Tours

| Tour | Score | Reviews | Rating | Load Time | Status |
|------|-------|---------|---------|-----------|--------|
`;

    const topTours = Object.entries(this.report.summary.tourScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    topTours.forEach(([tourSlug, score]) => {
      const tourResults = this.report.results.filter(r => r.tourSlug === tourSlug);
      const avgReviews = Math.round(tourResults.reduce((sum, r) => sum + r.metrics.reviewsCount, 0) / tourResults.length);
      const avgRating = (tourResults.reduce((sum, r) => sum + r.metrics.averageRating, 0) / tourResults.length).toFixed(1);
      const avgLoadTime = Math.round(tourResults.reduce((sum, r) => sum + r.metrics.loadTime, 0) / tourResults.length);
      
      section += `| ${this.formatTourName(tourSlug)} | ${score}% | ${avgReviews} | ${avgRating}⭐ | ${avgLoadTime}ms | ${this.getScoreEmoji(score)} |\n`;
    });

    section += '\n### Tours Needing Attention\n\n';

    const bottomTours = Object.entries(this.report.summary.tourScores)
      .sort(([,a], [,b]) => a - b)
      .slice(0, 5);

    section += '| Tour | Score | Issues | Priority |\n|------|-------|--------|----------|\n';

    bottomTours.forEach(([tourSlug, score]) => {
      const tourResults = this.report.results.filter(r => r.tourSlug === tourSlug);
      const totalIssues = tourResults.reduce((sum, r) => sum + r.issues.length, 0);
      const criticalIssues = tourResults.reduce((sum, r) => sum + r.issues.filter(i => i.impact === 'high').length, 0);
      const priority = score < 60 ? '🔴 Critical' : score < 75 ? '🟡 High' : '🟢 Medium';
      
      section += `| ${this.formatTourName(tourSlug)} | ${score}% | ${totalIssues} (${criticalIssues} critical) | ${priority} |\n`;
    });

    section += '\n';
    return section;
  }

  private generateDetailedResultsSection(): string {
    let section = `## 📋 Detailed Test Results

### By Tour and Language

`;

    // Group results by tour
    const tourGroups = this.groupBy(this.report.results, 'tourSlug');

    Object.entries(tourGroups).forEach(([tourSlug, results]) => {
      section += `#### ${this.formatTourName(tourSlug)}\n\n`;
      section += '| Language | Status | Score | Reviews | Rating | Load Time | Issues |\n';
      section += '|----------|--------|-------|---------|--------|-----------|--------|\n';

      results.forEach(result => {
        const issueCount = result.issues.length;
        const criticalIssues = result.issues.filter(i => i.impact === 'high').length;
        const issueText = issueCount > 0 ? `${issueCount} (${criticalIssues} critical)` : 'None';
        
        section += `| ${this.getLanguageName(result.locale)} | ${this.getStatusEmoji(result.status)} | ${result.score}% | ${result.metrics.reviewsCount} | ${result.metrics.averageRating.toFixed(1)}⭐ | ${result.metrics.loadTime}ms | ${issueText} |\n`;
      });

      section += '\n';

      // Show issues if any
      const allIssues = results.flatMap(r => r.issues.map(i => ({ ...i, locale: r.locale })));
      if (allIssues.length > 0) {
        section += '**Issues Found:**\n\n';
        allIssues.forEach(issue => {
          const emoji = issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : 'ℹ️';
          section += `- ${emoji} **${issue.locale}**: ${issue.message} _(${issue.impact} impact)_\n`;
        });
        section += '\n';
      }
    });

    return section;
  }

  private generatePerformanceAnalysisSection(): string {
    let section = `## ⚡ Performance Analysis

### Load Time Distribution

`;

    const loadTimes = this.report.results.map(r => r.metrics.loadTime);
    const avgLoadTime = Math.round(loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length);
    const minLoadTime = Math.min(...loadTimes);
    const maxLoadTime = Math.max(...loadTimes);

    section += `| Metric | Value |
|--------|--------|
| **Average Load Time** | ${avgLoadTime}ms |
| **Fastest Load** | ${minLoadTime}ms (${this.report.summary.performanceMetrics.fastestTour}) |
| **Slowest Load** | ${maxLoadTime}ms (${this.report.summary.performanceMetrics.slowestTour}) |
| **Target Load Time** | < 2000ms |

### Performance Grades Distribution

`;

    const gradeDistribution = this.report.results.reduce((acc, result) => {
      acc[result.metrics.performanceGrade] = (acc[result.metrics.performanceGrade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    section += '| Grade | Count | Percentage |\n|-------|-------|------------|\n';
    ['A', 'B', 'C', 'D', 'F'].forEach(grade => {
      const count = gradeDistribution[grade] || 0;
      const percentage = Math.round((count / this.report.totalTests) * 100);
      section += `| ${grade} | ${count} | ${percentage}% |\n`;
    });

    section += '\n### Performance Recommendations\n\n';
    
    if (avgLoadTime > 1500) {
      section += '🚨 **Critical**: Average load time exceeds 1.5 seconds. Consider database optimization.\n\n';
    } else if (avgLoadTime > 1000) {
      section += '⚠️ **Warning**: Average load time above 1 second. Performance improvements recommended.\n\n';
    } else {
      section += '✅ **Good**: Load times are within acceptable ranges.\n\n';
    }

    return section;
  }

  private generateIssuesAnalysisSection(): string {
    let section = `## 🔍 Issues Analysis

### Issue Frequency Analysis

`;

    const allIssues = this.report.results.flatMap(r => r.issues);
    const issueFrequency = allIssues.reduce((acc, issue) => {
      acc[issue.message] = (acc[issue.message] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedIssues = Object.entries(issueFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    section += '| Issue | Frequency | Impact |\n|-------|-----------|--------|\n';
    
    sortedIssues.forEach(([issue, count]) => {
      const sampleIssue = allIssues.find(i => i.message === issue);
      const impact = sampleIssue ? sampleIssue.impact : 'unknown';
      const emoji = impact === 'high' ? '🔴' : impact === 'medium' ? '🟡' : '🟢';
      section += `| ${issue} | ${count} | ${emoji} ${impact} |\n`;
    });

    section += '\n### Issue Types Distribution\n\n';

    const typeDistribution = allIssues.reduce((acc, issue) => {
      acc[issue.type] = (acc[issue.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    section += '```\n';
    Object.entries(typeDistribution).forEach(([type, count]) => {
      const emoji = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
      section += `${emoji} ${type.toUpperCase()}: ${count}\n`;
    });
    section += '```\n\n';

    return section;
  }

  private generateRecommendationsSection(): string {
    let section = `## 💡 Action Plan & Recommendations

### Priority Actions

`;

    const priorityRecommendations = this.report.summary.recommendations.slice(0, 5);
    
    priorityRecommendations.forEach((recommendation, index) => {
      section += `${index + 1}. **${recommendation}**\n\n`;
    });

    section += `### Implementation Roadmap

#### Phase 1: Critical Issues (Week 1)
- Fix all FAIL status tests
- Address high-impact issues across all tours
- Optimize slowest loading tours

#### Phase 2: Performance Optimization (Week 2-3)
- Improve database query performance
- Implement caching strategies
- Optimize review loading mechanisms

#### Phase 3: Content Enhancement (Week 4)
- Improve language-specific content quality
- Enhance SEO optimization scores
- Complete reviews coverage for all tours

#### Phase 4: Quality Assurance (Week 5)
- Implement automated testing pipeline
- Set up monitoring and alerting
- Document maintenance procedures

### Monitoring & Maintenance

1. **Daily**: Monitor tour page load times
2. **Weekly**: Review new issues and validate fixes
3. **Monthly**: Run full validation suite and update baselines
4. **Quarterly**: Comprehensive performance audit

`;

    return section;
  }

  private generateAppendixSection(): string {
    let section = `## 📎 Appendix

### Complete Tour List

| # | Tour Slug | Formatted Name |
|---|-----------|----------------|
`;

    const tours = [...new Set(this.report.results.map(r => r.tourSlug))].sort();
    tours.forEach((tour, index) => {
      section += `| ${index + 1} | \`${tour}\` | ${this.formatTourName(tour)} |\n`;
    });

    section += `\n### Language Configurations

| Code | Language | Direction | Special Characters |
|------|----------|-----------|-------------------|
| en | English | LTR | Standard ASCII |
| de | German | LTR | ä, ö, ü, ß |
| fr | French | LTR | à, é, è, ê, ç |
| es | Spanish | LTR | á, é, í, ó, ú, ñ, ¿, ¡ |
| ar | Arabic | RTL | Arabic Unicode characters |

### Validation Criteria

#### Scoring System
- **Content Quality**: 30 points
- **Performance**: 25 points  
- **SEO Optimization**: 25 points
- **Language Localization**: 20 points

#### Performance Thresholds
- **A Grade**: < 500ms load time
- **B Grade**: 500-1000ms load time
- **C Grade**: 1000-1500ms load time
- **D Grade**: 1500-2000ms load time
- **F Grade**: > 2000ms load time

### Generated Information

**Report Generated:** ${new Date(this.report.timestamp).toLocaleString()}  
**Script Version:** 1.0.0  
**Environment:** Production Validation  

---

*This report was automatically generated by the Tour Pages Validation System.*
*For questions or issues, please contact the development team.*
`;

    return section;
  }

  // Helper methods
  private getScoreEmoji(score: number): string {
    if (score >= 95) return '🟢';
    if (score >= 85) return '🟡';
    if (score >= 70) return '🟠';
    return '🔴';
  }

  private getScoreStatus(score: number): string {
    if (score >= 95) return 'Excellent';
    if (score >= 85) return 'Good';
    if (score >= 70) return 'Needs Improvement';
    return 'Critical';
  }

  private getStatusEmoji(status: string): string {
    switch (status) {
      case 'PASS': return '✅';
      case 'WARNING': return '⚠️';
      case 'FAIL': return '❌';
      default: return '❓';
    }
  }

  private getLanguageName(locale: string): string {
    const names = {
      'en': 'English',
      'de': 'German',
      'fr': 'French',
      'es': 'Spanish',
      'ar': 'Arabic'
    };
    return names[locale] || locale;
  }

  private formatTourName(slug: string): string {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private getPerformanceStatus(loadTime: number): string {
    if (loadTime < 500) return '🟢 Excellent';
    if (loadTime < 1000) return '🟡 Good';
    if (loadTime < 2000) return '🟠 Acceptable';
    return '🔴 Poor';
  }

  private getCoverageStatus(coverage: number): string {
    if (coverage >= 95) return '🟢 Excellent';
    if (coverage >= 85) return '🟡 Good';
    if (coverage >= 70) return '🟠 Acceptable';
    return '🔴 Poor';
  }

  private groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((groups, item) => {
      const groupKey = String(item[key]);
      groups[groupKey] = groups[groupKey] || [];
      groups[groupKey].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  }
}

async function main() {
  console.log('🚀 Running tour pages validation...');
  
  const validator = new TourPageValidator();
  const report = await validator.runFullValidation();
  validator.printSummary();

  console.log('\n📝 Generating comprehensive report...');
  
  const generator = new ReportGenerator(report);
  const markdown = await generator.generateMarkdownReport();

  const reportsDir = path.join(process.cwd(), 'docs');
  await fs.mkdir(reportsDir, { recursive: true });

  // Save JSON report
  const jsonReportPath = path.join(reportsDir, 'tour-pages-validation-data.json');
  await fs.writeFile(jsonReportPath, JSON.stringify(report, null, 2), 'utf-8');

  // Save Markdown report
  const markdownReportPath = path.join(reportsDir, 'TOUR_PAGES_VALIDATION_REPORT.md');
  await fs.writeFile(markdownReportPath, markdown, 'utf-8');

  console.log(`✅ Reports generated:`);
  console.log(`   📊 JSON: ${jsonReportPath}`);
  console.log(`   📄 Markdown: ${markdownReportPath}`);

  process.exit(report.overallScore >= 85 ? 0 : 1);
}

if (require.main === module) {
  main();
}