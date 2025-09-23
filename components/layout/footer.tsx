"use client"
import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InlineLanguageSwitcher } from "@/components/i18n/LanguageSwitcher"
import { Locale } from "@/lib/i18n/config"
import { useLocalizedPath } from "@/lib/i18n/hooks"
import { useEffect, useState } from "react"

interface FooterProps {
  locale: Locale
  translations: Record<string, string>
}

export function Footer({ locale, translations }: FooterProps) {
  const { getLocalizedPath, locale: clientLocale } = useLocalizedPath()
  const [isClient, setIsClient] = useState(false)
  const [currentTranslations, setCurrentTranslations] = useState(translations)
  
  // Handle hydration and locale changes
  useEffect(() => {
    setIsClient(true)
    // Update translations if client locale differs from server locale
    if (clientLocale !== locale && Object.keys(translations).length > 0) {
      setCurrentTranslations(translations)
    }
  }, [clientLocale, locale, translations])

  const t = (key: string) => {
    // Fallback to key if translation not found, but ensure it's a string
    const translation = currentTranslations[key];
    if (translation && typeof translation === 'string') {
      return translation;
    }
    // Return a user-friendly fallback for common keys
    const fallbacks: Record<string, string> = {
      'logoAlt': 'Cape Town Safari Tours Logo',
      'tagline': 'Premium Wildlife Experiences',
      'newsletter.title': 'Newsletter',
      'newsletter.placeholder': 'Enter your email',
      'newsletter.button': 'Subscribe',
      'sections.navigate': 'Navigate',
      'sections.topExperiences': 'Top Experiences',
      'sections.connect': 'Connect',
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.allTours': 'All Tours',
      'nav.faq': 'FAQ',
      'nav.contact': 'Contact',
      'experiences.big5Safaris': 'Big 5 Safaris',
      'experiences.privateWineTours': 'Private Wine Tours',
      'experiences.sharkCageDiving': 'Shark Cage Diving',
      'experiences.gardenRoute': 'Garden Route',
      'connect.whatsapp': 'WhatsApp',
      'connect.email': 'Email Us',
      'legal.copyright': 'Cape Town Safari Tours. All rights reserved.',
      'legal.privacyPolicy': 'Privacy Policy',
      'legal.termsOfService': 'Terms of Service'
    };
    return fallbacks[key] || key;
  }
  
  // Show loading state during hydration if needed
  if (!isClient) {
    return (
      <footer className="bg-brand-primary text-brand-light">
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-1 md:col-span-4 lg:col-span-2">
              <div className="h-72 w-96 bg-white/10 rounded"></div>
            </div>
            <div>
              <div className="h-4 w-20 bg-white/10 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 w-16 bg-white/10 rounded"></div>
                <div className="h-3 w-14 bg-white/10 rounded"></div>
                <div className="h-3 w-18 bg-white/10 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-brand-primary text-brand-light">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          {/* Branding & Newsletter */}
          <div className="col-span-1 md:col-span-4 lg:col-span-2">
            <Link href={getLocalizedPath("/")} className="mb-4 flex items-center">
              <Image
                src="/Best_Cape_Town_Safari_Tours_Logo.webp"
                alt={t("logoAlt")}
                width={400}
                height={400}
                className="h-72 w-auto"
                priority={false}
              />
            </Link>
            <p className="text-sm text-brand-secondary mb-6 max-w-sm">
              {t("tagline")}
            </p>
            <h3 className="font-montserrat mb-2 font-bold uppercase tracking-wider">{t("newsletter.title")}</h3>
            <form className="flex w-full max-w-sm">
              <Input
                type="email"
                placeholder={t("newsletter.placeholder")}
                aria-label="Email address for newsletter"
                className="bg-brand-light/10 border-brand-secondary/50 text-white placeholder:text-brand-secondary/70 rounded-r-none focus:ring-brand-accent"
              />
              <Button type="submit" className="bg-brand-accent hover:bg-brand-accent/90 text-white rounded-l-none">{t("newsletter.button")}</Button>
            </form>
          </div>

          {/* Navigate */}
          <div>
            <h3 className="font-montserrat mb-4 font-bold uppercase tracking-wider">{t("sections.navigate")}</h3>
            <ul className="space-y-2" aria-label="Footer navigation">
              <li><Link href={getLocalizedPath("/")} className="hover:text-white hover:underline">{t("nav.home")}</Link></li>
              <li><Link href={getLocalizedPath("/about")} className="hover:text-white hover:underline">{t("nav.about")}</Link></li>
              <li><Link href={getLocalizedPath("/tours")} className="hover:text-white hover:underline">{t("nav.allTours")}</Link></li>
              <li><Link href={getLocalizedPath("/faq")} className="hover:text-white hover:underline">{t("nav.faq")}</Link></li>
              <li><Link href={getLocalizedPath("/contact")} className="hover:text-white hover:underline">{t("nav.contact")}</Link></li>
            </ul>
          </div>

          {/* Top Experiences */}
          <div>
            <h3 className="font-montserrat mb-4 font-bold uppercase tracking-wider">{t("sections.topExperiences")}</h3>
            <ul className="space-y-2">
              <li><Link href={getLocalizedPath("/tours/safari")} className="hover:text-white hover:underline">{t("experiences.big5Safaris")}</Link></li>
              <li><Link href={getLocalizedPath("/tours/winelands")} className="hover:text-white hover:underline">{t("experiences.privateWineTours")}</Link></li>
              <li><Link href={getLocalizedPath("/tours/coastal")} className="hover:text-white hover:underline">{t("experiences.sharkCageDiving")}</Link></li>
              <li><Link href={getLocalizedPath("/tours/garden-route")} className="hover:text-white hover:underline">{t("experiences.gardenRoute")}</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-montserrat mb-4 font-bold uppercase tracking-wider">{t("sections.connect")}</h3>
            <ul className="space-y-2">
              <li><a href="https://wa.me/27818775110" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">{t("connect.whatsapp")}</a></li>
              <li><a href="mailto:info@capetownsafaritours.com" className="hover:text-white hover:underline">{t("connect.email")}</a></li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <Link href="#" aria-label="Facebook"><Facebook className="h-6 w-6 hover:text-white" /></Link>
              <Link href="#" aria-label="Instagram"><Instagram className="h-6 w-6 hover:text-white" /></Link>
              <Link href="#" aria-label="YouTube"><Youtube className="h-6 w-6 hover:text-white" /></Link>
            </div>
          </div>

        </div>
      </div>
      <div className="border-t border-brand-light/10">
        <div className="container mx-auto flex flex-col items-center justify-between px-4 py-6 sm:flex-row">
          <p className="text-sm text-brand-secondary">&copy; {new Date().getFullYear()} {t("legal.copyright")}</p>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-0 text-sm text-brand-secondary">
            <InlineLanguageSwitcher className="mb-2 sm:mb-0" />
            <div className="flex space-x-4">
              <Link href={getLocalizedPath("/privacy-policy")} className="hover:text-white hover:underline">{t("legal.privacyPolicy")}</Link>
              <Link href={getLocalizedPath("/terms-of-service")} className="hover:text-white hover:underline">{t("legal.termsOfService")}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
