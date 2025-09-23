const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function loadAllJSONTranslations() {
    const languages = ['en', 'de', 'fr', 'es', 'ar'];
    const translations = {};
    
    for (const lang of languages) {
        try {
            const jsonPath = path.join(process.cwd(), 'messages', `${lang}.json`);
            const content = await fs.readFile(jsonPath, 'utf8');
            translations[lang] = JSON.parse(content);
        } catch (error) {
            console.error(`❌ Error loading ${lang}.json:`, error.message);
            translations[lang] = {};
        }
    }
    
    return translations;
}

function flattenObject(obj, prefix = '') {
    const flattened = {};
    
    for (const key in obj) {
        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;
        
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            Object.assign(flattened, flattenObject(value, newKey));
        } else {
            flattened[newKey] = value;
        }
    }
    
    return flattened;
}

async function multiLanguageAudit() {
    console.log('🌍 COMPREHENSIVE MULTI-LANGUAGE TRANSLATION AUDIT');
    console.log('==================================================\n');
    
    // Load all JSON translations
    const jsonTranslations = await loadAllJSONTranslations();
    const flatTranslations = {};
    
    for (const [lang, content] of Object.entries(jsonTranslations)) {
        flatTranslations[lang] = flattenObject(content);
    }
    
    // Get database translations
    const { data: dbTranslations, error } = await supabase
        .from('static_translations')
        .select('*');
    
    if (error) {
        console.error('❌ Database error:', error);
        return;
    }
    
    // Group database translations by locale
    const dbByLocale = dbTranslations.reduce((acc, translation) => {
        acc[translation.locale] = acc[translation.locale] || [];
        acc[translation.locale].push(translation);
        return acc;
    }, {});
    
    // Define critical translation keys for each component
    const criticalKeys = {
        'Navigation': ['navigation.home', 'navigation.tours', 'navigation.about', 'navigation.contact'],
        'Booking': ['booking.max_group_size', 'booking.per_person', 'booking.from', 'booking.check_availability'],
        'Tour Details': ['tour_detail.pickup_included', 'tour_detail.duration', 'tour_detail.departure'],
        'Common UI': ['common.loading', 'common.error', 'common.success', 'common.cancel']
    };
    
    const languages = ['en', 'de', 'fr', 'es', 'ar'];
    const languageNames = {
        'en': 'English 🇺🇸',
        'de': 'German 🇩🇪', 
        'fr': 'French 🇫🇷',
        'es': 'Spanish 🇪🇸',
        'ar': 'Arabic 🇸🇦'
    };
    
    console.log('📊 OVERVIEW BY LANGUAGE');
    console.log('=======================');
    
    const summary = {};
    
    for (const lang of languages) {
        const jsonKeys = Object.keys(flatTranslations[lang] || {});
        const dbEntries = dbByLocale[lang] || [];
        const jsonToDbSyncRate = jsonKeys.length > 0 ? ((dbEntries.length / jsonKeys.length) * 100).toFixed(1) : '0.0';
        
        summary[lang] = {
            jsonKeys: jsonKeys.length,
            dbEntries: dbEntries.length,
            syncRate: parseFloat(jsonToDbSyncRate)
        };
        
        console.log(`\n${languageNames[lang]}:`);
        console.log(`  JSON Keys: ${jsonKeys.length}`);
        console.log(`  DB Entries: ${dbEntries.length}`);
        console.log(`  Sync Rate: ${jsonToDbSyncRate}%`);
        
        if (lang === 'en') {
            console.log('  Status: ✅ Baseline Reference');
        } else if (parseFloat(jsonToDbSyncRate) >= 95) {
            console.log('  Status: ✅ Excellent Coverage');
        } else if (parseFloat(jsonToDbSyncRate) >= 80) {
            console.log('  Status: 🟡 Good Coverage');
        } else if (parseFloat(jsonToDbSyncRate) >= 50) {
            console.log('  Status: 🟠 Moderate Coverage');
        } else {
            console.log('  Status: ❌ Poor Coverage');
        }
    }
    
    // Critical components analysis
    console.log('\n\n🎯 CRITICAL COMPONENT ANALYSIS BY LANGUAGE');
    console.log('==========================================');
    
    for (const lang of languages.filter(l => l !== 'en')) {
        console.log(`\n${languageNames[lang]} Critical Components:`);
        console.log('─'.repeat(50));
        
        let totalCritical = 0;
        let translatedCritical = 0;
        
        for (const [component, keys] of Object.entries(criticalKeys)) {
            let componentTranslated = 0;
            
            for (const key of keys) {
                totalCritical++;
                const inDb = (dbByLocale[lang] || []).some(t => t.key === key);
                const inJson = key in (flatTranslations[lang] || {});
                
                if (inDb) {
                    translatedCritical++;
                    componentTranslated++;
                } else if (inJson) {
                    // In JSON but not in database
                }
            }
            
            const componentPercentage = ((componentTranslated / keys.length) * 100).toFixed(0);
            const status = componentPercentage >= 100 ? '✅' : componentPercentage >= 75 ? '🟡' : '❌';
            console.log(`  ${status} ${component}: ${componentPercentage}% (${componentTranslated}/${keys.length})`);
        }
        
        const criticalCoverage = ((translatedCritical / totalCritical) * 100).toFixed(1);
        console.log(`  📊 Overall Critical Coverage: ${criticalCoverage}%`);
        
        summary[lang].criticalCoverage = parseFloat(criticalCoverage);
    }
    
    // Missing translations analysis
    console.log('\n\n🔍 MISSING TRANSLATIONS TO SYNC');
    console.log('===============================');
    
    const translationsToSync = [];
    
    for (const lang of languages) {
        const jsonKeys = Object.keys(flatTranslations[lang] || {});
        const dbKeys = new Set((dbByLocale[lang] || []).map(t => t.key));
        const missingKeys = jsonKeys.filter(key => !dbKeys.has(key));
        
        console.log(`\n${languageNames[lang]}:`);
        console.log(`  Missing in DB: ${missingKeys.length} keys`);
        
        if (missingKeys.length > 0) {
            console.log(`  Sample missing keys:`);
            missingKeys.slice(0, 5).forEach(key => {
                const value = flatTranslations[lang][key];
                if (typeof value === 'string' && value.length < 100) {
                    console.log(`    - ${key}: "${value}"`);
                } else {
                    console.log(`    - ${key}: [${typeof value}]`);
                }
            });
            
            if (missingKeys.length > 5) {
                console.log(`    ... and ${missingKeys.length - 5} more`);
            }
        }
        
        // Prepare for batch sync
        for (const key of missingKeys) {
            const value = flatTranslations[lang][key];
            if (typeof value === 'string') {
                translationsToSync.push({
                    key,
                    locale: lang,
                    value,
                    context: key.split('.')[0],
                    description: `Auto-synced from JSON file`,
                    is_approved: true
                });
            }
        }
    }
    
    console.log(`\n📦 TOTAL TRANSLATIONS TO SYNC: ${translationsToSync.length}`);
    
    // Final recommendations
    console.log('\n\n🏆 RECOMMENDATIONS BY PRIORITY');
    console.log('==============================');
    
    console.log('\n🔴 HIGH PRIORITY:');
    for (const lang of languages.filter(l => l !== 'en')) {
        const s = summary[lang];
        if (s.criticalCoverage < 75) {
            console.log(`  ⚠️  ${languageNames[lang]}: Critical UI coverage only ${s.criticalCoverage}%`);
        }
    }
    
    console.log('\n🟡 MEDIUM PRIORITY:');
    for (const lang of languages.filter(l => l !== 'en')) {
        const s = summary[lang];
        if (s.syncRate < 90 && s.criticalCoverage >= 75) {
            console.log(`  📊 ${languageNames[lang]}: Sync rate only ${s.syncRate}%`);
        }
    }
    
    console.log('\n🟢 LOW PRIORITY:');
    for (const lang of languages.filter(l => l !== 'en')) {
        const s = summary[lang];
        if (s.syncRate >= 90 && s.criticalCoverage >= 90) {
            console.log(`  ✅ ${languageNames[lang]}: Well covered, minor improvements only`);
        }
    }
    
    return {
        summary,
        translationsToSync,
        totalToSync: translationsToSync.length
    };
}

// Run multi-language audit
multiLanguageAudit().catch(error => {
    console.error('❌ Multi-language audit failed:', error);
    process.exit(1);
});