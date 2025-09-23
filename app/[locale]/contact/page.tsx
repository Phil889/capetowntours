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

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContactPageProps) {
  const { locale } = await params;
  
  if (!isValidLocale(locale)) {
    return {};
  }

  const t = await getTranslations(locale);

  return generateLocalizedMetadata({
    locale,
    pathname: '/contact',
    title: t.contact?.meta?.title || 'Contact Us - Cape Town Safari Tours',
    description: t.contact?.meta?.description || 'Get in touch with Cape Town Safari Tours. Plan your dream safari, ask questions, or request a custom quote. Our team is here to help!'
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

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  
  if (!isValidLocale(locale)) {
    notFound();
  }

  // Load translations
  const t = await getTranslations(locale);

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center px-4 py-24"
      style={{
        background:
          "linear-gradient(120deg, #2d1a05 0%, #bfa76a 100%), url('/Best Lion Safari Cape Town.webp') center/cover no-repeat",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="max-w-3xl w-full bg-black/60 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-yellow-700/60">
        <h1 className="font-playfair text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#D4B796] via-[#E59A59] to-[#BFA76A] text-center mb-8 drop-shadow-2xl">
          {t.contact?.title || 'Contact Us'}
        </h1>
        <p className="text-yellow-100/90 text-lg text-center mb-8">
          {t.contact?.subtitle || 'Have a question, need a custom quote, or want to plan your dream safari? Our team is here to help!'}
        </p>
        <form className="space-y-6">
          <div>
            <label className="block text-yellow-200 font-semibold mb-2" htmlFor="name">
              {t.contact?.form?.name || 'Name'}
            </label>
            <input
              className="w-full rounded-lg px-4 py-3 bg-black/40 text-yellow-100 border border-yellow-700/40 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              type="text"
              id="name"
              name="name"
              required
              placeholder={t.contact?.form?.namePlaceholder || 'Your Name'}
            />
          </div>
          <div>
            <label className="block text-yellow-200 font-semibold mb-2" htmlFor="email">
              {t.contact?.form?.email || 'Email'}
            </label>
            <input
              className="w-full rounded-lg px-4 py-3 bg-black/40 text-yellow-100 border border-yellow-700/40 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              type="email"
              id="email"
              name="email"
              required
              placeholder={t.contact?.form?.emailPlaceholder || 'you@email.com'}
            />
          </div>
          <div>
            <label className="block text-yellow-200 font-semibold mb-2" htmlFor="message">
              {t.contact?.form?.message || 'Message'}
            </label>
            <textarea
              className="w-full rounded-lg px-4 py-3 bg-black/40 text-yellow-100 border border-yellow-700/40 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              id="message"
              name="message"
              rows={5}
              required
              placeholder={t.contact?.form?.messagePlaceholder || 'How can we help you?'}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#D4B796] via-[#E59A59] to-[#BFA76A] text-black font-bold text-lg shadow-lg hover:opacity-90 transition"
          >
            {t.contact?.form?.submit || 'Send Message'}
          </button>
        </form>
        <div className="mt-10 text-yellow-100/80 text-center space-y-2">
          <div>
            <span className="font-bold text-yellow-200">{t.contact?.info?.email || 'Email'}:</span> info@capetownsafaritours.com
          </div>
          <div>
            <span className="font-bold text-yellow-200">{t.contact?.info?.phone || 'Phone'}:</span> +27 11 123 4567
          </div>
          <div>
            <span className="font-bold text-yellow-200">{t.contact?.info?.address || 'Address'}:</span> Cape Town, South Africa
          </div>
        </div>
      </div>
    </section>
  );
}