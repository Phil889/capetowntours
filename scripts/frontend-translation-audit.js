const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

// Define languages and test pages
const languages = [
    { code: 'de', name: 'German 🇩🇪', flag: '🇩🇪' },
    { code: 'fr', name: 'French 🇫🇷', flag: '🇫🇷' },
    { code: 'es', name: 'Spanish 🇪🇸', flag: '🇪🇸' },
    { code: 'ar', name: 'Arabic 🇸🇦', flag: '🇸🇦' }
];

const testPages = [
    { path: '', name: 'Homepage' },
    { path: 'tours', name: 'Tours List' },
    { path: 'tours/inverdoorn-safari-tour', name: 'Tour Detail' },
    { path: 'about', name: 'About Page' },
    { path: 'contact', name: 'Contact Page' }
];

// Common translation key patterns that might appear as naked strings
const criticalTranslationKeys = [
    // Navigation
    'navigation.home', 'navigation.tours', 'navigation.about', 'navigation.contact',
    // Booking
    'booking.max_group_size', 'booking.per_person', 'booking.from', 'booking.check_availability',
    'booking.book_now', 'booking.select_date', 'booking.guests', 
    // Tour details
    'tour_detail.pickup_included', 'tour_detail.duration', 'tour_detail.departure',
    'tour_detail.pickup', 'tour_detail.overview', 'tour_detail.highlights',
    // Common UI
    'common.loading', 'common.error', 'common.success', 'common.cancel',
    'header.book_now', 'header.call_us', 'footer.contact_info',
    // Forms
    'forms.name', 'forms.email', 'forms.message', 'forms.submit'
];

// English words/phrases that shouldn't appear on non-English pages
const englishFallbackPhrases = [
    'Book Now', 'Check Availability', 'Max Group Size', 'per person', 
    'Duration', 'Pickup Included', 'What\'s Included', 'Tour Highlights',
    'About Us', 'Contact Us', 'Home', 'Tours', 'Loading', 'Error',
    'Book Tour', 'Select Date', 'Choose Package', 'Private Tour',
    'Group Size', 'Free Pickup', 'Hotel Pickup', 'Full Day',
    'Half Day', 'Safari Tour', 'Wine Tour', 'City Tour'
];

async function fetchPageContent(url) {
    try {
        const command = process.platform === 'win32' 
            ? `powershell -Command "Invoke-WebRequest -Uri '${url}' -UseBasicParsing | Select-Object -ExpandProperty Content"`
            : `curl -s "${url}"`;
        
        const { stdout, stderr } = await execAsync(command, { timeout: 10000 });
        
        if (stderr) {
            console.log(`⚠️  Warning for ${url}: ${stderr}`);
        }
        
        return stdout;
    } catch (error) {
        console.error(`❌ Error fetching ${url}:`, error.message);
        return null;
    }
}

function analyzePageContent(content, language, pageName) {
    const issues = [];
    
    if (!content) {
        issues.push({
            type: 'FETCH_ERROR',
            severity: 'HIGH',
            message: 'Could not fetch page content'
        });
        return issues;
    }
    
    // Check for 404 errors
    if (content.includes('404') && content.includes('This page could not be found')) {
        issues.push({
            type: 'PAGE_NOT_FOUND',
            severity: 'CRITICAL', 
            message: 'Page returns 404 error'
        });
        return issues;
    }
    
    // Check for naked translation keys (translation keys appearing as raw strings)
    criticalTranslationKeys.forEach(key => {
        if (content.includes(key)) {
            issues.push({
                type: 'NAKED_TRANSLATION_KEY',
                severity: 'HIGH',
                message: `Translation key "${key}" appears as raw string`,
                key: key
            });
        }
    });
    
    // Check for English fallbacks (only for non-English pages)
    if (language.code !== 'en') {
        englishFallbackPhrases.forEach(phrase => {
            if (content.includes(phrase)) {
                issues.push({
                    type: 'ENGLISH_FALLBACK',
                    severity: 'MEDIUM',
                    message: `English text "${phrase}" found on ${language.name} page`,
                    phrase: phrase
                });
            }
        });
    }
    
    // Check for common error patterns
    if (content.includes('Translation missing') || content.includes('Missing translation')) {
        issues.push({
            type: 'MISSING_TRANSLATION_ERROR',
            severity: 'HIGH',
            message: 'Page shows "Translation missing" errors'
        });
    }
    
    // Check for JavaScript errors that might affect translations
    if (content.includes('ReferenceError') || content.includes('TypeError') || content.includes('undefined')) {
        issues.push({
            type: 'JAVASCRIPT_ERROR',
            severity: 'MEDIUM',
            message: 'Page contains JavaScript errors that may affect translations'
        });
    }
    
    // Check if page has minimal content (might indicate rendering issues)
    const textContent = content.replace(/<[^>]*>/g, '').trim();
    if (textContent.length < 500) {
        issues.push({
            type: 'MINIMAL_CONTENT',
            severity: 'MEDIUM',
            message: 'Page appears to have minimal content (possible rendering issue)'
        });
    }
    
    return issues;
}

async function auditFrontendTranslations() {
    console.log('🔍 COMPREHENSIVE FRONTEND TRANSLATION AUDIT');
    console.log('===========================================\n');
    
    const results = {};
    let totalIssues = 0;
    let criticalIssues = 0;
    let highIssues = 0;
    
    for (const language of languages) {
        console.log(`\n${language.flag} TESTING ${language.name.toUpperCase()}`);
        console.log('─'.repeat(50));
        
        results[language.code] = {};
        
        for (const page of testPages) {
            const url = `http://localhost:3000/${language.code}/${page.path}`;
            console.log(`\n🌐 Testing: ${page.name} (${url})`);
            
            const content = await fetchPageContent(url);
            const issues = analyzePageContent(content, language, page.name);
            
            results[language.code][page.name] = {
                url,
                issues,
                hasContent: !!content && content.length > 0
            };
            
            if (issues.length === 0) {
                console.log('   ✅ No issues found');
            } else {
                issues.forEach(issue => {
                    const emoji = issue.severity === 'CRITICAL' ? '🔴' : 
                                 issue.severity === 'HIGH' ? '🟠' : '🟡';
                    console.log(`   ${emoji} ${issue.type}: ${issue.message}`);
                    
                    totalIssues++;
                    if (issue.severity === 'CRITICAL') criticalIssues++;
                    if (issue.severity === 'HIGH') highIssues++;
                });
            }
            
            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
    
    // Generate summary
    console.log('\n\n📊 AUDIT SUMMARY');
    console.log('================');
    console.log(`Total Issues Found: ${totalIssues}`);
    console.log(`🔴 Critical Issues: ${criticalIssues}`);
    console.log(`🟠 High Priority Issues: ${highIssues}`);
    console.log(`🟡 Medium Priority Issues: ${totalIssues - criticalIssues - highIssues}`);
    
    // Language-by-language breakdown
    console.log('\n📈 ISSUES BY LANGUAGE:');
    for (const language of languages) {
        const langResults = results[language.code];
        const langIssues = Object.values(langResults).reduce((acc, page) => acc + page.issues.length, 0);
        const status = langIssues === 0 ? '✅' : langIssues <= 2 ? '🟡' : '❌';
        console.log(`${status} ${language.name}: ${langIssues} issues`);
    }
    
    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    if (criticalIssues > 0) {
        console.log('🔴 URGENT: Fix critical issues that prevent page loading');
    }
    if (highIssues > 0) {
        console.log('🟠 HIGH PRIORITY: Address naked translation keys and major fallbacks');
    }
    if (totalIssues === 0) {
        console.log('✅ EXCELLENT: All translations are displaying correctly!');
    }
    
    return results;
}

// Run the audit
auditFrontendTranslations().catch(error => {
    console.error('❌ Frontend audit failed:', error);
    process.exit(1);
});