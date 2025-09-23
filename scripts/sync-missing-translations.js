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

async function syncMissingTranslations() {
    console.log('🔄 Starting translation sync to database...\n');
    
    // Load JSON translations
    const { germanJson, englishJson } = await loadJSONTranslations();
    const flatGerman = flattenObject(germanJson);
    const flatEnglish = flattenObject(englishJson);
    
    console.log(`📄 Loaded ${Object.keys(flatGerman).length} German translations from JSON`);
    console.log(`📄 Loaded ${Object.keys(flatEnglish).length} English translations from JSON`);
    
    // Get existing database translations
    const { data: existingTranslations, error: fetchError } = await supabase
        .from('static_translations')
        .select('key, locale');
    
    if (fetchError) {
        console.error('❌ Error fetching existing translations:', fetchError);
        return;
    }
    
    const existingGermanKeys = new Set(
        existingTranslations
            .filter(t => t.locale === 'de')
            .map(t => t.key)
    );
    
    const existingEnglishKeys = new Set(
        existingTranslations
            .filter(t => t.locale === 'en')
            .map(t => t.key)
    );
    
    // Prepare translations to insert
    const translationsToInsert = [];
    
    // Add missing German translations
    for (const [key, value] of Object.entries(flatGerman)) {
        if (!existingGermanKeys.has(key) && typeof value === 'string') {
            translationsToInsert.push({
                key,
                locale: 'de',
                value,
                context: key.split('.')[0],
                description: `Auto-synced from JSON file`,
                is_approved: true
            });
        }
    }
    
    // Add missing English translations
    for (const [key, value] of Object.entries(flatEnglish)) {
        if (!existingEnglishKeys.has(key) && typeof value === 'string') {
            translationsToInsert.push({
                key,
                locale: 'en',
                value,
                context: key.split('.')[0],
                description: `Auto-synced from JSON file`,
                is_approved: true
            });
        }
    }
    
    console.log(`\n🔍 Found ${translationsToInsert.length} missing translations to sync:`);
    console.log(`   German: ${translationsToInsert.filter(t => t.locale === 'de').length}`);
    console.log(`   English: ${translationsToInsert.filter(t => t.locale === 'en').length}`);
    
    if (translationsToInsert.length === 0) {
        console.log('✅ No missing translations found. Database is in sync!');
        return;
    }
    
    // Show sample of what will be inserted
    console.log('\n📝 Sample translations being added:');
    const criticalKeys = [
        'booking.max_group_size',
        'booking.per_person',
        'booking.check_availability', 
        'tour_detail.pickup_included',
        'tour_detail.duration',
        'tour_detail.departure'
    ];
    
    criticalKeys.forEach(key => {
        const translation = translationsToInsert.find(t => t.key === key && t.locale === 'de');
        if (translation) {
            console.log(`   ✅ ${key}: "${translation.value}"`);
        }
    });
    
    // Insert in batches to avoid timeout
    const batchSize = 50;
    let inserted = 0;
    let errors = 0;
    
    console.log(`\n🚀 Inserting translations in batches of ${batchSize}...`);
    
    for (let i = 0; i < translationsToInsert.length; i += batchSize) {
        const batch = translationsToInsert.slice(i, i + batchSize);
        
        const { data, error } = await supabase
            .from('static_translations')
            .insert(batch)
            .select();
        
        if (error) {
            console.error(`❌ Error inserting batch ${Math.floor(i/batchSize) + 1}:`, error);
            errors += batch.length;
        } else {
            inserted += data.length;
            console.log(`✅ Batch ${Math.floor(i/batchSize) + 1}: Inserted ${data.length} translations`);
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\n📊 SYNC COMPLETE:`);
    console.log(`✅ Successfully inserted: ${inserted} translations`);
    console.log(`❌ Failed to insert: ${errors} translations`);
    
    // Verify critical keys were inserted
    console.log(`\n🔍 Verifying critical booking/tour keys...`);
    
    const { data: verifyTranslations } = await supabase
        .from('static_translations')
        .select('key, value')
        .eq('locale', 'de')
        .in('key', criticalKeys);
    
    if (verifyTranslations) {
        console.log('✅ Critical German translations in database:');
        verifyTranslations.forEach(t => {
            console.log(`   ${t.key}: "${t.value}"`);
        });
    }
    
    return {
        inserted,
        errors,
        total: translationsToInsert.length
    };
}

// Run sync
syncMissingTranslations().catch(error => {
    console.error('❌ Sync failed:', error);
    process.exit(1);
});