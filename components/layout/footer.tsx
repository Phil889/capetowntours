"use client"
import Link from "next/link"
import Image from "next/image"
import { MountainIcon, Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="bg-brand-primary text-brand-light">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          {/* Branding & Newsletter */}
          <div className="col-span-1 md:col-span-4 lg:col-span-2">
<Link href="/" className="mb-4 flex items-center">
  <Image
    src="/Best_Cape_Town_Safari_Tours_Logo.webp"
    alt="Cape Town Safari Tours"
    width={400}
    height={400}
    className="h-72 w-auto"
    priority={false}
  />
</Link>
            <p className="text-sm text-brand-secondary mb-6 max-w-sm">
              Your adventure, perfectly crafted. Experience the wild heart of Africa with local experts you can trust.
            </p>
            <h3 className="font-montserrat mb-2 font-bold uppercase tracking-wider">Get Exclusive Offers</h3>
            <form className="flex w-full max-w-sm">
              <Input
                type="email"
                placeholder="Enter your email"
                aria-label="Email address for newsletter"
                className="bg-brand-light/10 border-brand-secondary/50 text-white placeholder:text-brand-secondary/70 rounded-r-none focus:ring-brand-accent"
              />
              <Button type="submit" className="bg-brand-accent hover:bg-brand-accent/90 text-white rounded-l-none">Subscribe</Button>
            </form>
          </div>

          {/* Navigate */}
          <div>
            <h3 className="font-montserrat mb-4 font-bold uppercase tracking-wider">Navigate</h3>
            <ul className="space-y-2" aria-label="Footer navigation">
              <li><Link href="/" className="hover:text-white hover:underline">Home</Link></li>
              <li><Link href="/about" className="hover:text-white hover:underline">About Us</Link></li>
              <li><Link href="/tours" className="hover:text-white hover:underline">All Tours</Link></li>
              <li><Link href="/faq" className="hover:text-white hover:underline">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white hover:underline">Contact</Link></li>
            </ul>
          </div>

          {/* Top Experiences */}
          <div>
            <h3 className="font-montserrat mb-4 font-bold uppercase tracking-wider">Top Experiences</h3>
            <ul className="space-y-2">
              <li><Link href="/tours/safari" className="hover:text-white hover:underline">Big 5 Safaris</Link></li>
              <li><Link href="/tours/winelands" className="hover:text-white hover:underline">Private Wine Tours</Link></li>
              <li><Link href="/tours/coastal" className="hover:text-white hover:underline">Shark Cage Diving</Link></li>
              <li><Link href="/tours/garden-route" className="hover:text-white hover:underline">Garden Route</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-montserrat mb-4 font-bold uppercase tracking-wider">Connect With Us</h3>
            <ul className="space-y-2">
              <li><a href="https://wa.me/27818775110" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">WhatsApp</a></li>
              <li><a href="mailto:info@capetownsafaritours.com" className="hover:text-white hover:underline">Email Us</a></li>
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
          <p className="text-sm text-brand-secondary">&copy; {new Date().getFullYear()} Cape Town Safari Tours. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0 text-sm text-brand-secondary">
            <Link href="/privacy-policy" className="hover:text-white hover:underline">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white hover:underline">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
