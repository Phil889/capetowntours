import type React from "react"
import type { Metadata } from "next"
import { Lato, Montserrat } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Toaster } from "@/components/ui/toaster"

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
  display: "swap",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-montserrat",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://capetownsafaritours.com'),
  title: "Cape Town Safari Tours | #1 Private Wildlife & Wine Tours 2025",
  description: "Experience Cape Town's best private safari tours, wine tastings & Big 5 wildlife adventures. 4.9★ rated with 2,847+ happy guests. Book your luxury tour today!",
  keywords: "Cape Town safari tours, private wildlife tours, Big 5 safari, wine tours Cape Town, Table Mountain tours, luxury safari experiences, South Africa tours, Cape Peninsula tours",
  openGraph: {
    title: "Cape Town Safari Tours | #1 Private Wildlife & Wine Tours",
    description: "Experience Cape Town's best private safari tours, wine tastings & Big 5 wildlife adventures. 4.9★ rated with 2,847+ happy guests.",
    images: [
      {
        url: '/Best_Cape_Town_Safari_Tours_Logo.webp',
        width: 1200,
        height: 630,
        alt: 'Cape Town Safari Tours - Premium Wildlife Experiences',
      }
    ],
    type: 'website',
    siteName: 'Cape Town Safari Tours',
    locale: 'en_ZA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cape Town Safari Tours | #1 Private Wildlife & Wine Tours',
    description: 'Experience Cape Town\'s best private safari tours, wine tastings & Big 5 wildlife adventures. 4.9★ rated with 2,847+ happy guests.',
    images: ['/Best_Cape_Town_Safari_Tours_Logo.webp'],
    creator: '@capetownsafari',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' }
    ],
    other: [
      { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png' }
    ]
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Cape Town Safari Tours'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-slate-50 font-sans text-slate-900 antialiased",
          lato.variable,
          montserrat.variable,
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  )
}
