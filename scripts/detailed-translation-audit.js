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

async function detailedAudit() {
    console.log('🔍 Starting detailed translation audit...\n');
    
    // Load JSON translations
    const { germanJson, englishJson } = await loadJSONTranslations();
    const flatGerman = flattenObject(germanJson);
    const flatEnglish = flattenObject(englishJson);
    
    console.log('📄 JSON Translation Files Analysis:');
    console.log(`   English JSON keys: ${Object.keys(flatEnglish).length}`);
    console.log(`   German JSON keys: ${Object.keys(flatGerman).length}`);
    
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
    
    console.log('\n💾 Database Translation Analysis:');
    console.log(`   English DB keys: ${dbEnglish.length}`);
    console.log(`   German DB keys: ${dbGerman.length}`);
    
    // Key analysis for critical booking/tour keys
    const criticalKeys = [
        'booking.max_group_size',
        'booking.per_person', 
        'booking.from',
        'booking.check_availability',
        'tour_detail.pickup_included',
        'tour_detail.duration',
        'tour_detail.departure',
        'tour_detail.pickup',
        'navigation.home',
        'navigation.tours',
        'navigation.about',
        'navigation.contact'
    ];
    
    console.log('\n🎯 Critical Translation Keys Analysis:');
    const missingKeys = [];
    
    for (const key of criticalKeys) {
        const inJsonGerman = key in flatGerman;
        const inDbGerman = dbGerman.some(t => t.key === key);
        const inJsonEnglish = key in flatEnglish;
        const inDbEnglish = dbEnglish.some(t => t.key === key);
        
        console.log(`🔑 ${key}:`);
        console.log(`   JSON EN: ${inJsonEnglish ? '✅' : '❌'} | JSON DE: ${inJsonGerman ? '✅' : '❌'}`);
        console.log(`   DB EN:   ${inDbEnglish ? '✅' : '❌'} | DB DE:   ${inDbGerman ? '✅' : '❌'}`);
        
        if (inJsonGerman) {
            console.log(`   Value: "${flatGerman[key]}"`);
        }
        
        if (!inDbGerman && inJsonGerman) {
            missingKeys.push({
                key,
                value: flatGerman[key],
                context: key.split('.')[0]
            });
        }
        console.log('');
    }
    
    // Check for missing JSON keys in database
    console.log('🔄 JSON to Database Sync Analysis:');
    const jsonKeysNotInDb = [];
    
    for (const [key, value] of Object.entries(flatGerman)) {
        const inDb = dbGerman.some(t => t.key === key);
        if (!inDb) {
            jsonKeysNotInDb.push({ key, value, context: key.split('.')[0] });
        }
    }
    
    console.log(`📊 German JSON keys not in database: ${jsonKeysNotInDb.length}`);
    
    if (jsonKeysNotInDb.length > 0) {
        console.log('\n📝 Sample missing keys in database:');
        jsonKeysNotInDb.slice(0, 10).forEach(item => {
            console.log(`   ${item.key}: "${item.value}"`);
        });
    }
    
    // Tours analysis
    console.log('\n🎡 Tours Analysis:');
    const { data: tours } = await supabase
        .from('tours')
        .select('id, title, slug, locale');
    
    const englishTours = tours?.filter(t => t.locale === 'en') || [];
    const germanTours = tours?.filter(t => t.locale === 'de') || [];
    
    console.log(`   English tours: ${englishTours.length}`);
    console.log(`   German tours: ${germanTours.length}`);
    
    const inverdoorn = englishTours.find(t => t.slug === 'inverdoorn-safari-tour');
    if (inverdoorn) {
        console.log(`   ✅ Inverdoorn tour found: ${inverdoorn.title}`);
        
        // Check for German version
        const { data: tourTranslations } = await supabase
            .from('tour_translations')
            .select('*')
            .eq('tour_id', inverdoorn.id)
            .eq('locale', 'de');
        
        console.log(`   German translation: ${tourTranslations?.length > 0 ? '✅ Found' : '❌ Missing'}`);
    }
    
    console.log('\n📋 SUMMARY:');
    console.log(`✅ Static translations working: Database has ${dbGerman.length} German entries`);
    console.log(`❌ Critical missing keys: ${missingKeys.length}`);
    console.log(`🔄 JSON keys to sync to DB: ${jsonKeysNotInDb.length}`);
    
    return {
        missingKeys,
        jsonKeysNotInDb,
        dbGerman: dbGerman.length,
        dbEnglish: dbEnglish.length,
        tours: tours?.length || 0
    };
}

// Run detailed audit
detailedAudit().catch(error => {
    console.error('❌ Detailed audit failed:', error);
    process.exit(1);
});