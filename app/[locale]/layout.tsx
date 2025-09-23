import { TranslationService } from '@/lib/i18n/translation-service'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Locale } from '@/lib/i18n/config'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const translationService = TranslationService.getInstance()
  const headerTranslations = await translationService.getStaticTranslations(locale, 'header')
  const footerTranslations = await translationService.getStaticTranslations(locale, 'footer')

  return (
    <>
      <Header locale={locale} translations={headerTranslations} />
      {children}
      <Footer locale={locale} translations={footerTranslations} />
    </>
  )
}
