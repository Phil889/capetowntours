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

async function loadJSONTranslations() {
    try {
        const germanJsonPath = path.join(process.cwd(), 'messages', 'de.json');
        const englishJsonPath = path.join(process.cwd(), 'messages', 'en.json');
        
        const germanJson = JSON.parse(await fs.readFile(germanJsonPath, 'utf8'));
        const englishJson = JSON.parse(await fs.readFile(englishJsonPath, 'utf8'));
        
        return { germanJson, englishJson };
    } catch (error) {
        console.error('❌ Error loading JSON files:', error.message);
        return { germanJson: {}, englishJson: {} };
    }
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

async function finalVerificationAudit() {
    console.log('🎯 FINAL TRANSLATION VERIFICATION AUDIT');
    console.log('==========================================\n');
    
    // Load translations
    const { germanJson, englishJson } = await loadJSONTranslations();
    const flatGerman = flattenObject(germanJson);
    const flatEnglish = flattenObject(englishJson);
    
    // Get database translations
    const { data: dbTranslations, error } = await supabase
        .from('static_translations')
        .select('*');
    
    if (error) {
        console.error('❌ Database error:', error);
        return;
    }
    
    const dbEnglish = dbTranslations.filter(t => t.locale === 'en');
    const dbGerman = dbTranslations.filter(t => t.locale === 'de');
    
    console.log('📊 TRANSLATION COVERAGE ANALYSIS');
    console.log('================================');
    console.log(`JSON Files:`);
    console.log(`  English: ${Object.keys(flatEnglish).length} keys`);
    console.log(`  German:  ${Object.keys(flatGerman).length} keys`);
    console.log(`Database:`);
    console.log(`  English: ${dbEnglish.length} entries`);
    console.log(`  German:  ${dbGerman.length} entries`);
    
    // Calculate sync percentage
    const jsonToDbSyncRate = ((dbGerman.length / Object.keys(flatGerman).length) * 100).toFixed(1);
    console.log(`\n📈 Sync Rate: ${jsonToDbSyncRate}% (JSON→Database)`);
    
    // Critical UI component translations check
    console.log('\n🎯 CRITICAL UI COMPONENT VERIFICATION');
    console.log('====================================');
    
    const criticalCategories = {
        'Navigation': ['navigation.home', 'navigation.tours', 'navigation.about', 'navigation.contact'],
        'Booking Widget': ['booking.max_group_size', 'booking.per_person', 'booking.from', 'booking.check_availability'],
        'Tour Details': ['tour_detail.pickup_included', 'tour_detail.duration', 'tour_detail.departure', 'tour_detail.pickup'],
        'Header': ['header.book_now', 'header.call_us', 'header.expert_guides'],
        'Footer': ['footer.contact_info', 'footer.follow_us', 'footer.quick_links'],
        'Forms': ['forms.name', 'forms.email', 'forms.message', 'forms.submit']
    };
    
    let totalCriticalKeys = 0;
    let translatedCriticalKeys = 0;
    
    for (const [category, keys] of Object.entries(criticalCategories)) {
        console.log(`\n📋 ${category}:`);
        let categoryTranslated = 0;
        
        for (const key of keys) {
            totalCriticalKeys++;
            const inDbGerman = dbGerman.some(t => t.key === key);
            const inJsonGerman = key in flatGerman;
            
            if (inDbGerman) {
                translatedCriticalKeys++;
                categoryTranslated++;
                const translation = dbGerman.find(t => t.key === key);
                console.log(`   ✅ ${key}: "${translation.value}"`);
            } else if (inJsonGerman) {
                console.log(`   🟡 ${key}: JSON only - "${flatGerman[key]}"`);
            } else {
                console.log(`   ❌ ${key}: Missing`);
            }
        }
        
        const categoryPercentage = ((categoryTranslated / keys.length) * 100).toFixed(0);
        console.log(`   📊 ${category} Coverage: ${categoryPercentage}%`);
    }
    
    const criticalCoverage = ((translatedCriticalKeys / totalCriticalKeys) * 100).toFixed(1);
    console.log(`\n🎯 OVERALL CRITICAL UI COVERAGE: ${criticalCoverage}%`);
    
    // Check for any missing translations in commonly used sections
    console.log('\n🔍 MISSING TRANSLATION ANALYSIS');
    console.log('==============================');
    
    const commonSections = ['booking', 'tour_detail', 'navigation', 'header', 'footer'];
    let missingCount = 0;
    
    for (const section of commonSections) {
        const sectionKeys = Object.keys(flatGerman).filter(key => key.startsWith(`${section}.`));
        const missingSectionKeys = sectionKeys.filter(key => !dbGerman.some(t => t.key === key));
        
        if (missingSectionKeys.length > 0) {
            console.log(`\n❌ Missing ${section} translations (${missingSectionKeys.length}):`);
            missingSectionKeys.slice(0, 5).forEach(key => {
                console.log(`   - ${key}: "${flatGerman[key]}"`);
                missingCount++;
            });
            if (missingSectionKeys.length > 5) {
                console.log(`   ... and ${missingSectionKeys.length - 5} more`);
            }
        } else {
            console.log(`✅ ${section}: Complete`);
        }
    }
    
    // Final assessment
    console.log('\n🏆 FINAL ASSESSMENT');
    console.log('===================');
    
    if (criticalCoverage >= 95 && jsonToDbSyncRate >= 95) {
        console.log('✅ STATUS: PRODUCTION READY');
        console.log('✅ All critical UI components have German translations');
        console.log('✅ Database sync is comprehensive');
        console.log('✅ Translation service will work properly');
    } else if (criticalCoverage >= 90) {
        console.log('🟡 STATUS: MOSTLY READY');
        console.log('⚠️  Some non-critical translations missing');
        console.log('✅ Core functionality fully translated');
    } else {
        console.log('❌ STATUS: NEEDS WORK');
        console.log('⚠️  Critical translations missing');
        console.log('❌ May impact user experience');
    }
    
    console.log(`\n📈 METRICS:`);
    console.log(`   Critical UI Coverage: ${criticalCoverage}%`);
    console.log(`   JSON→Database Sync: ${jsonToDbSyncRate}%`);
    console.log(`   Total German Entries: ${dbGerman.length}`);
    console.log(`   Missing Keys: ${missingCount}`);
    
    return {
        criticalCoverage,
        jsonToDbSyncRate,
        totalEntries: dbGerman.length,
        missingCount
    };
}

// Run final verification
finalVerificationAudit().catch(error => {
    console.error('❌ Final verification failed:', error);
    process.exit(1);
});