import { locales, defaultLocale, type Locale } from '@/lib/i18n/config';

interface HreflangLinksProps {
  currentLocale: Locale;
  pathname: string;
  baseUrl?: string;
}

export function HreflangLinks({ 
  currentLocale, 
  pathname, 
  baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://capetownsafaritours.com' 
}: HreflangLinksProps) {
  // Remove locale from pathname if it exists
  const cleanPathname = pathname.startsWith(`/${currentLocale}`) 
    ? pathname.replace(`/${currentLocale}`, '') || '/'
    : pathname;

  return (
    <>
      {locales.map(locale => {
        const href = locale === defaultLocale 
          ? `${baseUrl}${cleanPathname}`
          : `${baseUrl}/${locale}${cleanPathname}`;
          
        return (
          <link
            key={locale}
            rel="alternate"
            hrefLang={locale}
            href={href}
          />
        );
      })}
      
      {/* x-default for default locale */}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${baseUrl}${cleanPathname}`}
      />
    </>
  );
}

// Server component version for use in layouts
export function HreflangLinksServer({ 
  locale, 
  pathname 
}: { 
  locale: Locale; 
  pathname: string; 
}) {
  return <HreflangLinks currentLocale={locale} pathname={pathname} />;
}