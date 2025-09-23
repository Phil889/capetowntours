#!/usr/bin/env node

/**
 * Populate Translations Script
 *
 * This script populates the Supabase database with translations from the
 * `messages/*.json` files.
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

async function populateTranslations() {
  console.log('🚀 Starting translation population...')

  try {
    const locales = ['en', 'de', 'es', 'fr', 'ar']

    for (const locale of locales) {
      const filePath = path.join(process.cwd(), `messages/${locale}.json`)
      if (fs.existsSync(filePath)) {
        console.log(`\nProcessing ${locale} translations...`)
        const translations = JSON.parse(fs.readFileSync(filePath, 'utf8'))

        // Populate static translations
        for (const section in translations) {
          if (section !== 'tours') {
            for (const key in translations[section]) {
              const value = translations[section][key]
              if (typeof value === 'string') {
                await upsertStaticTranslation(section, key, value, locale)
              } else {
                for (const subKey in value) {
                  const subValue = value[subKey]
                  if (typeof subValue === 'string') {
                    await upsertStaticTranslation(`${section}.${key}`, subKey, subValue, locale)
                  }
                }
              }
            }
          }
        }
      }
    }

    console.log('\n🎉 Translation population completed!')
  } catch (error) {
    console.error('💥 Fatal error during translation population:', error.message)
    process.exit(1)
  }
}

async function upsertStaticTranslation(section, key, value, locale) {
  const { error } = await supabase
    .from('static_translations')
    .upsert({
      key: `${section}.${key}`,
      locale,
      value,
      context: section,
      is_approved: true,
    })

  if (error) {
    console.error(`❌ Error upserting static translation for key "${section}.${key}" (${locale}):`, error.message)
  } else {
    process.stdout.write('.')
  }
}

// Run the script
populateTranslations()
