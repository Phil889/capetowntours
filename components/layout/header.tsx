"use client"

import Link from "next/link"
import Image from "next/image"
import { MountainIcon, PhoneCall } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher"
import { Locale } from "@/lib/i18n/config"
import { useLocalizedPath } from "@/lib/i18n/hooks"
import { useEffect, useState } from "react"

interface HeaderProps {
  locale: Locale
  translations: Record<string, string>
}

export function Header({ locale, translations }: HeaderProps) {
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
      'nav.tours': 'Tours',
      'nav.customTours': 'Custom Tours',
      'nav.customToursMobile': 'Custom',
      'nav.about': 'About',
      'nav.contact': 'Contact',
      'bookNow': 'Book Now',
      'siteName': 'Cape Town Safari Tours',
      'tagline': 'Premium Wildlife Experiences',
      'logoAlt': 'Cape Town Safari Tours Logo',
      'trustBadges.bestChoice': 'Best Choice Guarantee',
      'trustBadges.ecoCertified': 'Eco Certified Provider',
      'trustBadges.trustedSeller': 'Trusted Seller',
      'callUsTitle': 'Call Us Now'
    };
    return fallbacks[key] || key;
  }
  
  // Show loading state during hydration if needed
  if (!isClient) {
    return (
      <header className="sticky top-0 z-50 w-full bg-black/90 border border-white/20 backdrop-blur-xl shadow-xl">
        <div className="container mx-auto flex h-20 max-w-screen-2xl items-center justify-between px-4">
          <div className="animate-pulse flex items-center space-x-3">
            <div className="h-12 w-12 bg-white/10 rounded-full"></div>
            <div className="flex flex-col space-y-1">
              <div className="h-6 w-48 bg-white/10 rounded"></div>
              <div className="h-3 w-32 bg-white/10 rounded"></div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-black/90 border border-white/20 backdrop-blur-xl shadow-xl">
      <div className="container mx-auto flex h-20 max-w-screen-2xl items-center justify-between px-4">
        {/* Logo & Tagline */}
        <Link href={getLocalizedPath("/")} className="flex items-center space-x-3 group">
          <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-white shadow-lg bg-white/10 flex items-center justify-center">
            <Image
              src="/Best_Cape_Town_Safari_Tours_Logo.webp"
              alt={t("logoAlt")}
              width={48}
              height={48}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-montserrat font-extrabold text-xl text-white tracking-wide group-hover:text-[#ca8a04] transition-colors">
              {t("siteName")}
            </span>
            <span className="text-xs text-[#ca8a04] font-medium tracking-wide">
              {t("tagline")}
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-base font-semibold" aria-label="Main navigation">
          <Link href={getLocalizedPath("/tours")} className="text-white hover:text-[#ca8a04] transition-colors">
            {t("nav.tours")}
          </Link>
          <Link href={getLocalizedPath("/tours/custom")} className="text-white hover:text-[#ca8a04] transition-colors">
            {t("nav.customTours")}
          </Link>
          <Link href={getLocalizedPath("/about")} className="text-white hover:text-[#ca8a04] transition-colors">
            {t("nav.about")}
          </Link>
          <Link href={getLocalizedPath("/contact")} className="text-white hover:text-[#ca8a04] transition-colors">
            {t("nav.contact")}
          </Link>
        </nav>

        {/* Right: Trust Badges, CTA, Contact */}
        <div className="flex items-center gap-4">
          {/* Trust Badges */}
          <div className="hidden lg:flex items-center gap-2">
            <Image
              src="/best-cape-town-safari-choice-guarantee.webp"
              alt={t("trustBadges.bestChoice")}
              width={36}
              height={36}
              className="rounded bg-white p-1 shadow"
            />
            <Image
              src="/certified eco tourism provider.jpeg"
              alt={t("trustBadges.ecoCertified")}
              width={36}
              height={36}
              className="rounded bg-white p-1 shadow"
            />
            <Image
              src="/privat tours cape town trusted seller.png"
              alt={t("trustBadges.trustedSeller")}
              width={36}
              height={36}
              className="rounded bg-white p-1 shadow"
            />
          </div>
          {/* Language Switcher */}
          <LanguageSwitcher className="hidden lg:block" />
          
          {/* Book Now CTA */}
          <Button
            asChild
            size="lg"
            className="bg-[#ca8a04] hover:bg-[#a16207] text-black font-bold shadow-lg px-6 py-2 rounded-full transition-all"
          >
            <Link href={getLocalizedPath("/tours")}>
              {t("bookNow")}
            </Link>
          </Button>
          {/* Contact Info */}
          <a
            href="tel:+27211234567"
            className="hidden md:flex items-center gap-2 text-white hover:text-[#ca8a04] font-semibold transition-colors"
            title={t("callUsTitle")}
          >
            <PhoneCall className="h-5 w-5" />
            +27 21 123 4567
          </a>
        </div>
      </div>
      {/* Mobile Nav */}
      <div className="md:hidden flex justify-center bg-black/80 py-2 px-4">
        <nav className="flex items-center gap-6 text-base font-semibold" aria-label="Mobile navigation">
          <Link href={getLocalizedPath("/tours")} className="text-white hover:text-[#ca8a04] transition-colors">
            {t("nav.tours")}
          </Link>
          <Link href={getLocalizedPath("/tours/custom")} className="text-white hover:text-[#ca8a04] transition-colors">
            {t("nav.customToursMobile")}
          </Link>
          <Link href={getLocalizedPath("/about")} className="text-white hover:text-[#ca8a04] transition-colors">
            {t("nav.about")}
          </Link>
          <Link href={getLocalizedPath("/contact")} className="text-white hover:text-[#ca8a04] transition-colors">
            {t("nav.contact")}
          </Link>
          <LanguageSwitcher className="lg:hidden" showText={false} />
          <a
            href="tel:+27211234567"
            className="flex items-center gap-1 text-white hover:text-[#ca8a04]"
            title={t("callUsTitle")}
          >
            <PhoneCall className="h-4 w-4" />
          </a>
        </nav>
      </div>
    </header>
  )
}
