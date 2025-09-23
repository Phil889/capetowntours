import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/lib/i18n/config';
import { generateLocalizedMetadata } from '@/lib/i18n/metadata';

// Simple translation loader function
async function getTranslations(locale: Locale) {
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


interface FAQPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: FAQPageProps) {
  const { locale } = await params;
  
  if (!isValidLocale(locale)) {
    return {};
  }

  const t = await getTranslations(locale);

  return generateLocalizedMetadata({
    locale,
    pathname: '/faq',
    title: t.faq?.meta?.title || 'Frequently Asked Questions - Cape Town Safari Tours',
    description: t.faq?.meta?.description || 'Find answers to common questions about Cape Town Safari Tours. Learn about our private tours, booking process, pricing, and more.'
  });
}

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'de' },
    { locale: 'fr' },
    { locale: 'es' },
    { locale: 'ar' }
  ];
}

export default async function FAQPage({ params }: FAQPageProps) {
  const { locale } = await params;
  
  if (!isValidLocale(locale)) {
    notFound();
  }

  // Load translations
  const t = await getTranslations(locale);

  // Helper function for localized links
  const getLocalizedHref = (path: string) => {
    if (locale === 'en') return path;
    return `/${locale}${path}`;
  };

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center px-4 py-24"
      style={{
        background:
          "linear-gradient(120deg, #2d1a05 0%, #bfa76a 100%), url('/Best Lion Safari Cape Town.webp') center/cover no-repeat",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="max-w-4xl w-full bg-black/60 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-yellow-700/60">
        <h1 className="font-playfair text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#D4B796] via-[#E59A59] to-[#BFA76A] text-center mb-8 drop-shadow-2xl">
          {t.faq?.title || 'Frequently Asked Questions'}
        </h1>
        <div className="space-y-8">
          {(t.faq?.questions || []).map((faq: any, i: number) => (
            <div key={i} className="bg-black/30 rounded-xl p-6 border border-yellow-700/30 shadow-lg">
              <h2 className="font-bold text-yellow-200 text-xl mb-2">{faq.question}</h2>
              <p className="text-yellow-100/90 text-lg">{faq.answer}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-yellow-100/80 text-center text-lg">
          <p>
            {t.faq?.contactPrompt || 'Still have questions?'}{' '}
            <a href={getLocalizedHref("/contact")} className="underline text-yellow-300 hover:text-yellow-100">
              {t.faq?.contactLink || 'Contact us'}
            </a>{' '}
            {t.faq?.contactSuffix || 'and our team will be happy to help!'}
          </p>
        </div>
      </div>
    </section>
  );
}