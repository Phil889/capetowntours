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

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps) {
  const { locale } = await params;
  
  if (!isValidLocale(locale)) {
    return {};
  }

  const t = await getTranslations(locale);

  return generateLocalizedMetadata({
    locale,
    pathname: '/about',
    title: t.about?.meta?.title || 'About Cape Town Safari Tours',
    description: t.about?.meta?.description || 'Learn about Cape Town Safari Tours - locally owned and operated company dedicated to creating unforgettable, private adventures in South Africa.'
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

export default async function AboutPage({ params }: AboutPageProps) {
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
          {t.about?.title || 'About Cape Town Safari Tours'}
        </h1>
        <div className="text-yellow-100/90 text-lg leading-relaxed space-y-6">
          <p>
            <span className="font-bold text-yellow-200">{t.about?.intro?.companyName || 'Cape Town Safari Tours'}</span> {t.about?.intro?.description || 'is a locally owned and operated company dedicated to creating unforgettable, private adventures in South Africa. Our mission is to connect travelers with the magic of Africa through expertly crafted, luxury experiences.'}
          </p>
          <h2 className="font-bold text-yellow-200 text-2xl mt-8 mb-2">{t.about?.story?.title || 'Our Story'}</h2>
          <p>
            {t.about?.story?.content || 'Founded by passionate locals with decades of experience in tourism and wildlife, we believe that every journey should be as unique as the traveler. We started with a simple idea: to offer truly private, customizable tours that go beyond the ordinary.'}
          </p>
          <h2 className="font-bold text-yellow-200 text-2xl mt-8 mb-2">{t.about?.values?.title || 'Our Values'}</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><span className="font-bold text-yellow-200">{t.about?.values?.authenticity?.title || 'Authenticity:'}</span> {t.about?.values?.authenticity?.description || 'We showcase the real South Africa, from its wild beauty to its vibrant cultures.'}</li>
            <li><span className="font-bold text-yellow-200">{t.about?.values?.exclusivity?.title || 'Exclusivity:'}</span> {t.about?.values?.exclusivity?.description || 'Every tour is private, tailored, and never shared with strangers.'}</li>
            <li><span className="font-bold text-yellow-200">{t.about?.values?.sustainability?.title || 'Sustainability:'}</span> {t.about?.values?.sustainability?.description || 'We support eco-friendly practices and local communities.'}</li>
            <li><span className="font-bold text-yellow-200">{t.about?.values?.excellence?.title || 'Excellence:'}</span> {t.about?.values?.excellence?.description || 'Our guides are experts, storytellers, and passionate hosts.'}</li>
          </ul>
          <h2 className="font-bold text-yellow-200 text-2xl mt-8 mb-2">{t.about?.team?.title || 'Meet Our Team'}</h2>
          <p>
            {t.about?.team?.description || 'Our team is made up of wildlife specialists, wine connoisseurs, adventure seekers, and cultural ambassadors—all united by a love for Africa and a commitment to exceptional service.'}
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><span className="font-bold text-yellow-200">{t.about?.team?.members?.james?.name || 'James:'}</span> {t.about?.team?.members?.james?.role || 'Safari guide & wildlife expert'}</li>
            <li><span className="font-bold text-yellow-200">{t.about?.team?.members?.lindiwe?.name || 'Lindiwe:'}</span> {t.about?.team?.members?.lindiwe?.role || 'Cultural tour leader & historian'}</li>
            <li><span className="font-bold text-yellow-200">{t.about?.team?.members?.michael?.name || 'Michael:'}</span> {t.about?.team?.members?.michael?.role || 'Wine & culinary specialist'}</li>
            <li><span className="font-bold text-yellow-200">{t.about?.team?.members?.sarah?.name || 'Sarah:'}</span> {t.about?.team?.members?.sarah?.role || 'Guest experience manager'}</li>
          </ul>
          <h2 className="font-bold text-yellow-200 text-2xl mt-8 mb-2">{t.about?.whyChoose?.title || 'Why Choose Us?'}</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t.about?.whyChoose?.reasons?.private || '100% private, luxury tours—no strangers, ever.'}</li>
            <li>{t.about?.whyChoose?.reasons?.handpicked || 'Handpicked experiences, from Big 5 safaris to gourmet wine tours.'}</li>
            <li>{t.about?.whyChoose?.reasons?.transparent || 'Transparent pricing, no hidden fees.'}</li>
            <li>{t.about?.whyChoose?.reasons?.trusted || 'Trusted by thousands of travelers worldwide.'}</li>
          </ul>
          <p className="mt-8">
            <span className="font-bold text-yellow-200">{t.about?.closing?.joinUs || 'Join us'}</span> {t.about?.closing?.description || 'for the adventure of a lifetime. Discover Africa your way—with Cape Town Safari Tours.'}
          </p>
        </div>
      </div>
    </section>
  );
}