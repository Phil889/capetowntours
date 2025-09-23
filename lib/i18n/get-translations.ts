import { Locale } from './config';

export async function getTranslations(locale: Locale) {
  try {
    const translations = await import(`@/messages/${locale}.json`);
    return translations.default;
  } catch (error) {
    console.error(`Failed to load translations for ${locale}:`, error);
    // Fallback to English
    const fallback = await import('@/messages/en.json');
    return fallback.default;
  }
}
