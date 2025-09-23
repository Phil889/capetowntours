#!/usr/bin/env node

/**
 * Database Translation Execution Script
 *
 * This script executes all database translations for the Cape Town Safari Tours
 * internationalization system using the Supabase JavaScript client.
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=')
      if (key && value) {
        process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '')
      }
    })
  }
}

loadEnvFile()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL')
  console.error('   SUPABASE_SERVICE_ROLE_KEY')
  console.error('\nPlease check your .env.local file.')
  process.exit(1)
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Translation data for tours
const tourTranslations = [
  // Tour 1: Table Mountain Cable Car Tour
  { table_name: 'tours', record_id: 1, locale: 'de', field_name: 'title', translated_value: 'Tafelberg-Seilbahn Tour' },
  { table_name: 'tours', record_id: 1, locale: 'de', field_name: 'description', translated_value: 'Erleben Sie atemberaubende Panoramablicke auf Kapstadt und die Umgebung mit der berühmten Tafelberg-Seilbahn. Diese ikonische Attraktion bietet eine unvergessliche Reise zum Gipfel des Tafelbergs, wo Sie spektakuläre 360-Grad-Ausblicke genießen können.' },
  { table_name: 'tours', record_id: 1, locale: 'de', field_name: 'location', translated_value: 'Tafelberg, Kapstadt' },
  
  { table_name: 'tours', record_id: 1, locale: 'fr', field_name: 'title', translated_value: 'Tour du Téléphérique de Table Mountain' },
  { table_name: 'tours', record_id: 1, locale: 'fr', field_name: 'description', translated_value: 'Découvrez des vues panoramiques à couper le souffle sur Le Cap et ses environs avec le célèbre téléphérique de Table Mountain. Cette attraction emblématique offre un voyage inoubliable au sommet de Table Mountain, où vous pourrez profiter de vues spectaculaires à 360 degrés.' },
  { table_name: 'tours', record_id: 1, locale: 'fr', field_name: 'location', translated_value: 'Table Mountain, Le Cap' },
  
  { table_name: 'tours', record_id: 1, locale: 'es', field_name: 'title', translated_value: 'Tour del Teleférico de Table Mountain' },
  { table_name: 'tours', record_id: 1, locale: 'es', field_name: 'description', translated_value: 'Experimenta vistas panorámicas impresionantes de Ciudad del Cabo y sus alrededores con el famoso teleférico de Table Mountain. Esta atracción icónica ofrece un viaje inolvidable a la cima de Table Mountain, donde podrás disfrutar de vistas espectaculares de 360 grados.' },
  { table_name: 'tours', record_id: 1, locale: 'es', field_name: 'location', translated_value: 'Table Mountain, Ciudad del Cabo' },
  
  { table_name: 'tours', record_id: 1, locale: 'ar', field_name: 'title', translated_value: 'جولة التلفريك في جبل الطاولة' },
  { table_name: 'tours', record_id: 1, locale: 'ar', field_name: 'description', translated_value: 'استمتع بإطلالات بانورامية خلابة على كيب تاون والمناطق المحيطة بها مع التلفريك الشهير في جبل الطاولة. تقدم هذه المعلم الأيقوني رحلة لا تُنسى إلى قمة جبل الطاولة، حيث يمكنك الاستمتاع بإطلالات رائعة بزاوية 360 درجة.' },
  { table_name: 'tours', record_id: 1, locale: 'ar', field_name: 'location', translated_value: 'جبل الطاولة، كيب تاون' },

  // Tour 2: Cape Point & Penguins Full Day Tour
  { table_name: 'tours', record_id: 2, locale: 'de', field_name: 'title', translated_value: 'Kap der Guten Hoffnung & Pinguine Ganztagestour' },
  { table_name: 'tours', record_id: 2, locale: 'de', field_name: 'description', translated_value: 'Entdecken Sie die dramatische Schönheit des Kap der Guten Hoffnung und besuchen Sie die bezaubernden Pinguine am Boulders Beach. Diese ganztägige Tour führt Sie durch einige der spektakulärsten Landschaften Südafrikas.' },
  { table_name: 'tours', record_id: 2, locale: 'de', field_name: 'location', translated_value: 'Kap der Guten Hoffnung, Boulders Beach' },
  
  { table_name: 'tours', record_id: 2, locale: 'fr', field_name: 'title', translated_value: 'Tour d\'une Journée Complète du Cap de Bonne-Espérance et des Manchots' },
  { table_name: 'tours', record_id: 2, locale: 'fr', field_name: 'description', translated_value: 'Découvrez la beauté dramatique du Cap de Bonne-Espérance et visitez les charmants manchots de Boulders Beach. Cette excursion d\'une journée complète vous emmène à travers certains des paysages les plus spectaculaires d\'Afrique du Sud.' },
  { table_name: 'tours', record_id: 2, locale: 'fr', field_name: 'location', translated_value: 'Cap de Bonne-Espérance, Boulders Beach' },
  
  { table_name: 'tours', record_id: 2, locale: 'es', field_name: 'title', translated_value: 'Tour de Día Completo al Cabo de Buena Esperanza y Pingüinos' },
  { table_name: 'tours', record_id: 2, locale: 'es', field_name: 'description', translated_value: 'Descubre la belleza dramática del Cabo de Buena Esperanza y visita los encantadores pingüinos en Boulders Beach. Este tour de día completo te lleva a través de algunos de los paisajes más espectaculares de Sudáfrica.' },
  { table_name: 'tours', record_id: 2, locale: 'es', field_name: 'location', translated_value: 'Cabo de Buena Esperanza, Boulders Beach' },
  
  { table_name: 'tours', record_id: 2, locale: 'ar', field_name: 'title', translated_value: 'جولة يوم كامل إلى رأس الرجاء الصالح والبطاريق' },
  { table_name: 'tours', record_id: 2, locale: 'ar', field_name: 'description', translated_value: 'اكتشف الجمال الدراماتيكي لرأس الرجاء الصالح وقم بزيارة البطاريق الساحرة في شاطئ بولدرز. تأخذك هذه الجولة ليوم كامل عبر بعض من أروع المناظر الطبيعية في جنوب أفريقيا.' },
  { table_name: 'tours', record_id: 2, locale: 'ar', field_name: 'location', translated_value: 'رأس الرجاء الصالح، شاطئ بولدرز' },

  // Tour 3: Wine Tasting in Stellenbosch
  { table_name: 'tours', record_id: 3, locale: 'de', field_name: 'title', translated_value: 'Weinverkostung in Stellenbosch' },
  { table_name: 'tours', record_id: 3, locale: 'de', field_name: 'description', translated_value: 'Genießen Sie eine exquisite Weinverkostung in der historischen Stadt Stellenbosch, dem Herzen der südafrikanischen Weinregion. Besuchen Sie preisgekrönte Weingüter und probieren Sie weltklasse Weine inmitten atemberaubender Landschaften.' },
  { table_name: 'tours', record_id: 3, locale: 'de', field_name: 'location', translated_value: 'Stellenbosch Weinregion' },
  
  { table_name: 'tours', record_id: 3, locale: 'fr', field_name: 'title', translated_value: 'Dégustation de Vins à Stellenbosch' },
  { table_name: 'tours', record_id: 3, locale: 'fr', field_name: 'description', translated_value: 'Profitez d\'une dégustation de vins exquise dans la ville historique de Stellenbosch, le cœur de la région viticole sud-africaine. Visitez des domaines viticoles primés et dégustez des vins de classe mondiale au milieu de paysages à couper le souffle.' },
  { table_name: 'tours', record_id: 3, locale: 'fr', field_name: 'location', translated_value: 'Région Viticole de Stellenbosch' },
  
  { table_name: 'tours', record_id: 3, locale: 'es', field_name: 'title', translated_value: 'Cata de Vinos en Stellenbosch' },
  { table_name: 'tours', record_id: 3, locale: 'es', field_name: 'description', translated_value: 'Disfruta de una exquisita cata de vinos en la histórica ciudad de Stellenbosch, el corazón de la región vinícola sudafricana. Visita bodegas galardonadas y prueba vinos de clase mundial en medio de paisajes impresionantes.' },
  { table_name: 'tours', record_id: 3, locale: 'es', field_name: 'location', translated_value: 'Región Vinícola de Stellenbosch' },
  
  { table_name: 'tours', record_id: 3, locale: 'ar', field_name: 'title', translated_value: 'تذوق النبيذ في ستيلينبوش' },
  { table_name: 'tours', record_id: 3, locale: 'ar', field_name: 'description', translated_value: 'استمتع بتذوق نبيذ رائع في مدينة ستيلينبوش التاريخية، قلب منطقة النبيذ في جنوب أفريقيا. قم بزيارة مصانع النبيذ الحائزة على جوائز وتذوق نبيذ عالمي الطراز وسط مناظر طبيعية خلابة.' },
  { table_name: 'tours', record_id: 3, locale: 'ar', field_name: 'location', translated_value: 'منطقة النبيذ في ستيلينبوش' }
]

// Blog post translations
const blogTranslations = [
  // Blog Post 1: Top 10 Must-Visit Attractions in Cape Town
  { table_name: 'blog_posts', record_id: 1, locale: 'de', field_name: 'title', translated_value: 'Top 10 Sehenswürdigkeiten in Kapstadt, die Sie besuchen müssen' },
  { table_name: 'blog_posts', record_id: 1, locale: 'de', field_name: 'excerpt', translated_value: 'Entdecken Sie die besten Attraktionen, die Kapstadt zu einem der beliebtesten Reiseziele der Welt machen.' },
  { table_name: 'blog_posts', record_id: 1, locale: 'de', field_name: 'meta_description', translated_value: 'Entdecken Sie die Top 10 Sehenswürdigkeiten in Kapstadt, von der Tafelberg-Seilbahn bis zu den Pinguinen am Boulders Beach. Ihr ultimativer Kapstadt-Reiseführer.' },
  
  { table_name: 'blog_posts', record_id: 1, locale: 'fr', field_name: 'title', translated_value: 'Top 10 des Attractions Incontournables au Cap' },
  { table_name: 'blog_posts', record_id: 1, locale: 'fr', field_name: 'excerpt', translated_value: 'Découvrez les meilleures attractions qui font du Cap l\'une des destinations les plus populaires au monde.' },
  { table_name: 'blog_posts', record_id: 1, locale: 'fr', field_name: 'meta_description', translated_value: 'Découvrez le top 10 des attractions incontournables au Cap, du téléphérique de Table Mountain aux manchots de Boulders Beach. Votre guide ultime du Cap.' },
  
  { table_name: 'blog_posts', record_id: 1, locale: 'es', field_name: 'title', translated_value: 'Top 10 Atracciones Imprescindibles en Ciudad del Cabo' },
  { table_name: 'blog_posts', record_id: 1, locale: 'es', field_name: 'excerpt', translated_value: 'Descubre las mejores atracciones que hacen de Ciudad del Cabo uno de los destinos más populares del mundo.' },
  { table_name: 'blog_posts', record_id: 1, locale: 'es', field_name: 'meta_description', translated_value: 'Descubre las top 10 atracciones imprescindibles en Ciudad del Cabo, desde el teleférico de Table Mountain hasta los pingüinos de Boulders Beach. Tu guía definitiva de Ciudad del Cabo.' },
  
  { table_name: 'blog_posts', record_id: 1, locale: 'ar', field_name: 'title', translated_value: 'أفضل 10 معالم يجب زيارتها في كيب تاون' },
  { table_name: 'blog_posts', record_id: 1, locale: 'ar', field_name: 'excerpt', translated_value: 'اكتشف أفضل المعالم التي تجعل كيب تاون واحدة من أشهر الوجهات السياحية في العالم.' },
  { table_name: 'blog_posts', record_id: 1, locale: 'ar', field_name: 'meta_description', translated_value: 'اكتشف أفضل 10 معالم يجب زيارتها في كيب تاون، من تلفريك جبل الطاولة إلى البطاريق في شاطئ بولدرز. دليلك الشامل لكيب تاون.' }
]

async function executeTranslations() {
  console.log('🚀 Starting database translation execution...\n')

  try {
    // Test database connection
    console.log('🔍 Testing database connection...')
    const { data: testData, error: testError } = await supabase
      .from('tours')
      .select('id, title')
      .limit(1)

    if (testError) {
      throw new Error(`Database connection failed: ${testError.message}`)
    }

    console.log('✅ Database connection successful')
    console.log(`📊 Found ${testData?.length || 0} tours in database\n`)

    // Check if translations table exists
    console.log('🔍 Checking translations table...')
    const { data: existingTranslations, error: checkError } = await supabase
      .from('translations')
      .select('id')
      .limit(1)

    if (checkError) {
      throw new Error(`Translations table check failed: ${checkError.message}`)
    }

    console.log('✅ Translations table exists\n')

    // Execute tour translations
    console.log('📝 Inserting tour translations...')
    let successCount = 0
    let errorCount = 0

    for (const translation of tourTranslations) {
      try {
        const { error } = await supabase
          .from('translations')
          .insert([translation])

        if (error) {
          console.error(`❌ Error inserting translation for tour ${translation.record_id} (${translation.locale}):`, error.message)
          errorCount++
        } else {
          successCount++
          process.stdout.write('.')
        }
      } catch (err) {
        console.error(`❌ Unexpected error:`, err.message)
        errorCount++
      }
    }

    console.log(`\n✅ Tour translations: ${successCount} successful, ${errorCount} errors\n`)

    // Execute blog translations
    console.log('📝 Inserting blog post translations...')
    let blogSuccessCount = 0
    let blogErrorCount = 0

    for (const translation of blogTranslations) {
      try {
        const { error } = await supabase
          .from('translations')
          .insert([translation])

        if (error) {
          console.error(`❌ Error inserting blog translation ${translation.record_id} (${translation.locale}):`, error.message)
          blogErrorCount++
        } else {
          blogSuccessCount++
          process.stdout.write('.')
        }
      } catch (err) {
        console.error(`❌ Unexpected error:`, err.message)
        blogErrorCount++
      }
    }

    console.log(`\n✅ Blog translations: ${blogSuccessCount} successful, ${blogErrorCount} errors\n`)

    // Verify translations
    console.log('🔍 Verifying translation completeness...')
    const { data: translationStats, error: statsError } = await supabase
      .from('translations')
      .select('table_name, record_id, locale')

    if (statsError) {
      console.error('❌ Error fetching translation stats:', statsError.message)
    } else {
      const stats = {}
      translationStats.forEach(t => {
        const key = `${t.table_name}_${t.record_id}`
        if (!stats[key]) stats[key] = new Set()
        stats[key].add(t.locale)
      })

      console.log('📊 Translation Coverage:')
      Object.entries(stats).forEach(([key, locales]) => {
        const [table, id] = key.split('_')
        console.log(`   ${table} #${id}: ${Array.from(locales).join(', ')} (${locales.size}/4 languages)`)
      })
    }

    console.log('\n🎉 Translation execution completed!')
    console.log(`📈 Total: ${successCount + blogSuccessCount} successful, ${errorCount + blogErrorCount} errors`)

  } catch (error) {
    console.error('💥 Fatal error during translation execution:', error.message)
    process.exit(1)
  }
}

// Run the script
executeTranslations()