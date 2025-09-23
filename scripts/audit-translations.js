const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function auditTranslations() {
    console.log('🔍 Starting comprehensive translation audit...\n');
    
    // 1. Check static_translations table
    console.log('1️⃣ Auditing static_translations table...');
    const { data: staticTranslations, error: staticError } = await supabase
        .from('static_translations')
        .select('*');
    
    if (staticError) {
        console.error('❌ Error fetching static translations:', staticError);
        return;
    }
    
    console.log(`📊 Total static translations: ${staticTranslations.length}`);
    
    // Group by locale
    const translationsByLocale = staticTranslations.reduce((acc, translation) => {
        acc[translation.locale] = acc[translation.locale] || [];
        acc[translation.locale].push(translation);
        return acc;
    }, {});
    
    Object.keys(translationsByLocale).forEach(locale => {
        console.log(`   ${locale}: ${translationsByLocale[locale].length} translations`);
    });
    
    // 2. Check for missing German translations
    console.log('\n2️⃣ Checking for missing German translations...');
    const englishKeys = new Set(
        staticTranslations
            .filter(t => t.locale === 'en')
            .map(t => t.key)
    );
    
    const germanKeys = new Set(
        staticTranslations
            .filter(t => t.locale === 'de')
            .map(t => t.key)
    );
    
    const missingGermanKeys = [...englishKeys].filter(key => !germanKeys.has(key));
    
    console.log(`📋 English keys: ${englishKeys.size}`);
    console.log(`📋 German keys: ${germanKeys.size}`);
    console.log(`❌ Missing German translations: ${missingGermanKeys.length}`);
    
    if (missingGermanKeys.length > 0) {
        console.log('\n🚨 Missing German translation keys:');
        missingGermanKeys.slice(0, 20).forEach(key => {
            console.log(`   - ${key}`);
        });
        if (missingGermanKeys.length > 20) {
            console.log(`   ... and ${missingGermanKeys.length - 20} more`);
        }
    }
    
    // 3. Check tour_translations table
    console.log('\n3️⃣ Auditing tour_translations table...');
    const { data: tourTranslations, error: tourError } = await supabase
        .from('tour_translations')
        .select('*');
    
    if (tourError) {
        console.error('❌ Error fetching tour translations:', tourError);
    } else {
        console.log(`📊 Total tour translations: ${tourTranslations.length}`);
        
        const tourTranslationsByLocale = tourTranslations.reduce((acc, translation) => {
            acc[translation.locale] = acc[translation.locale] || [];
            acc[translation.locale].push(translation);
            return acc;
        }, {});
        
        Object.keys(tourTranslationsByLocale).forEach(locale => {
            console.log(`   ${locale}: ${tourTranslationsByLocale[locale].length} tour translations`);
        });
    }
    
    // 4. Check tours table
    console.log('\n4️⃣ Auditing tours table...');
    const { data: tours, error: toursError } = await supabase
        .from('tours')
        .select('id, title, slug, locale');
    
    if (toursError) {
        console.error('❌ Error fetching tours:', toursError);
    } else {
        console.log(`📊 Total tours: ${tours.length}`);
        
        const toursByLocale = tours.reduce((acc, tour) => {
            acc[tour.locale] = acc[tour.locale] || [];
            acc[tour.locale].push(tour);
            return acc;
        }, {});
        
        Object.keys(toursByLocale).forEach(locale => {
            console.log(`   ${locale}: ${toursByLocale[locale].length} tours`);
        });
        
        // Check for inverdoorn-safari-tour specifically
        const inverdoornTour = tours.find(tour => tour.slug === 'inverdoorn-safari-tour');
        if (inverdoornTour) {
            console.log(`✅ Found Inverdoorn Safari Tour: ${inverdoornTour.title} (${inverdoornTour.locale})`);
        } else {
            console.log(`❌ Inverdoorn Safari Tour not found in database`);
        }
    }
    
    // 5. Check if JSON files are being used vs database
    console.log('\n5️⃣ Translation source analysis...');
    
    const sampleKeys = ['navigation.home', 'booking.max_group_size', 'tour_detail.pickup_included'];
    
    for (const key of sampleKeys) {
        const dbTranslation = staticTranslations.find(t => t.key === key && t.locale === 'de');
        console.log(`🔑 ${key}:`);
        console.log(`   Database (de): ${dbTranslation ? dbTranslation.value : '❌ Missing'}`);
    }
    
    console.log('\n✅ Translation audit completed!');
}

// Run the audit
auditTranslations().catch(error => {
    console.error('❌ Audit failed:', error);
    process.exit(1);
});