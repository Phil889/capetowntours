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

async function syncAllLanguages() {
    console.log('🌍 SYNCING ALL LANGUAGES TO DATABASE');
    console.log('====================================\n');
    
    // Load all JSON translations
    const jsonTranslations = await loadAllJSONTranslations();
    const flatTranslations = {};
    
    for (const [lang, content] of Object.entries(jsonTranslations)) {
        flatTranslations[lang] = flattenObject(content);
    }
    
    // Get existing database translations
    const { data: existingTranslations, error: fetchError } = await supabase
        .from('static_translations')
        .select('key, locale');
    
    if (fetchError) {
        console.error('❌ Error fetching existing translations:', fetchError);
        return;
    }
    
    // Group existing translations by locale
    const existingByLocale = existingTranslations.reduce((acc, translation) => {
        acc[translation.locale] = acc[translation.locale] || new Set();
        acc[translation.locale].add(translation.key);
        return acc;
    }, {});
    
    // Prepare translations to insert
    const translationsToInsert = [];
    const languages = ['en', 'de', 'fr', 'es', 'ar'];
    const languageNames = {
        'en': 'English 🇺🇸',
        'de': 'German 🇩🇪', 
        'fr': 'French 🇫🇷',
        'es': 'Spanish 🇪🇸',
        'ar': 'Arabic 🇸🇦'
    };
    
    for (const lang of languages) {
        const existingKeys = existingByLocale[lang] || new Set();
        const flatLangTranslations = flatTranslations[lang] || {};
        let missingCount = 0;
        
        for (const [key, value] of Object.entries(flatLangTranslations)) {
            if (!existingKeys.has(key) && typeof value === 'string' && value.trim()) {
                translationsToInsert.push({
                    key,
                    locale: lang,
                    value: value.trim(),
                    context: key.split('.')[0],
                    description: `Auto-synced from JSON file`,
                    is_approved: true
                });
                missingCount++;
            }
        }
        
        console.log(`${languageNames[lang]}: ${missingCount} missing translations to sync`);
    }
    
    console.log(`\n🚀 TOTAL TRANSLATIONS TO SYNC: ${translationsToInsert.length}`);
    
    if (translationsToInsert.length === 0) {
        console.log('✅ All translations are already in sync!');
        return { inserted: 0, errors: 0, total: 0 };
    }
    
    // Insert in batches
    const batchSize = 50;
    let inserted = 0;
    let errors = 0;
    
    console.log(`\n📦 Inserting translations in batches of ${batchSize}...`);
    
    for (let i = 0; i < translationsToInsert.length; i += batchSize) {
        const batch = translationsToInsert.slice(i, i + batchSize);
        const batchNum = Math.floor(i/batchSize) + 1;
        const totalBatches = Math.ceil(translationsToInsert.length / batchSize);
        
        console.log(`⏳ Processing batch ${batchNum}/${totalBatches} (${batch.length} translations)...`);
        
        const { data, error } = await supabase
            .from('static_translations')
            .insert(batch)
            .select();
        
        if (error) {
            console.error(`❌ Error inserting batch ${batchNum}:`, error.message);
            errors += batch.length;
        } else {
            inserted += data.length;
            console.log(`✅ Batch ${batchNum}: Successfully inserted ${data.length} translations`);
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log(`\n📊 SYNC RESULTS:`);
    console.log(`✅ Successfully inserted: ${inserted} translations`);
    console.log(`❌ Failed to insert: ${errors} translations`);
    
    // Verify critical translations for each language
    console.log(`\n🔍 VERIFYING CRITICAL TRANSLATIONS...`);
    
    const criticalKeys = [
        'booking.max_group_size',
        'booking.per_person', 
        'booking.check_availability',
        'tour_detail.pickup_included',
        'tour_detail.duration',
        'navigation.home',
        'navigation.tours'
    ];
    
    for (const lang of languages.filter(l => l !== 'en')) {
        console.log(`\n${languageNames[lang]} critical translations:`);
        
        const { data: criticalTranslations } = await supabase
            .from('static_translations')
            .select('key, value')
            .eq('locale', lang)
            .in('key', criticalKeys);
        
        if (criticalTranslations && criticalTranslations.length > 0) {
            criticalTranslations.forEach(t => {
                const preview = t.value.length > 50 ? t.value.substring(0, 47) + '...' : t.value;
                console.log(`   ✅ ${t.key}: "${preview}"`);
            });
            console.log(`   📊 Coverage: ${criticalTranslations.length}/${criticalKeys.length} critical keys`);
        } else {
            console.log('   ❌ No critical translations found');
        }
    }
    
    return {
        inserted,
        errors,
        total: translationsToInsert.length
    };
}

// Run sync for all languages
syncAllLanguages().catch(error => {
    console.error('❌ All-languages sync failed:', error);
    process.exit(1);
});