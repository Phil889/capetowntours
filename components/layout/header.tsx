import Link from "next/link"
import Image from "next/image"
import { MountainIcon, PhoneCall } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-black/90 border border-white/20 backdrop-blur-xl shadow-xl">
      <div className="container mx-auto flex h-20 max-w-screen-2xl items-center justify-between px-4">
        {/* Logo & Tagline */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-white shadow-lg bg-white/10 flex items-center justify-center">
            <Image
              src="/Best_Cape_Town_Safari_Tours_Logo.webp"
              alt="Cape Town Safari Tours"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-montserrat font-extrabold text-xl text-white tracking-wide group-hover:text-[#ca8a04] transition-colors">
              Cape Town Safari Tours
            </span>
            <span className="text-xs text-[#ca8a04] font-medium tracking-wide">
              Premium Safari Experiences
            </span>
          </div>
        </Link>

        {/* Navigation */}
        {/* Consider extracting navigation links to a shared array/component for maintainability */}
        <nav className="hidden md:flex items-center gap-8 text-base font-semibold" aria-label="Main navigation">
          <Link href="/tours" className="text-white hover:text-[#ca8a04] transition-colors">
            Tours
          </Link>
          <Link href="/tours/custom" className="text-white hover:text-[#ca8a04] transition-colors">
            Custom Tours
          </Link>
          <Link href="/about" className="text-white hover:text-[#ca8a04] transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-white hover:text-[#ca8a04] transition-colors">
            Contact
          </Link>
        </nav>

        {/* Right: Trust Badges, CTA, Contact */}
        <div className="flex items-center gap-4">
          {/* Trust Badges */}
          <div className="hidden lg:flex items-center gap-2">
            <Image
              src="/best-cape-town-safari-choice-guarantee.webp"
              alt="Best Safari Choice"
              width={36}
              height={36}
              className="rounded bg-white p-1 shadow"
            />
            <Image
              src="/certified eco tourism provider.jpeg"
              alt="Eco Certified"
              width={36}
              height={36}
              className="rounded bg-white p-1 shadow"
            />
            <Image
              src="/privat tours cape town trusted seller.png"
              alt="Trusted Seller"
              width={36}
              height={36}
              className="rounded bg-white p-1 shadow"
            />
          </div>
          {/* Book Now CTA */}
          <Button
            asChild
            size="lg"
            className="bg-[#ca8a04] hover:bg-[#a16207] text-black font-bold shadow-lg px-6 py-2 rounded-full transition-all"
          >
            <Link href="/tours">
              Book Now
            </Link>
          </Button>
          {/* Contact Info */}
          <a
            href="tel:+27211234567"
            className="hidden md:flex items-center gap-2 text-white hover:text-[#ca8a04] font-semibold transition-colors"
            title="Call us to book your safari"
          >
            <PhoneCall className="h-5 w-5" />
            +27 21 123 4567
          </a>
        </div>
      </div>
      {/* Mobile Nav */}
      <div className="md:hidden flex justify-center bg-black/80 py-2 px-4">
        <nav className="flex items-center gap-6 text-base font-semibold" aria-label="Mobile navigation">
          <Link href="/tours" className="text-white hover:text-[#ca8a04] transition-colors">
            Tours
          </Link>
          <Link href="/tours/custom" className="text-white hover:text-[#ca8a04] transition-colors">
            Custom
          </Link>
          <Link href="/about" className="text-white hover:text-[#ca8a04] transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-white hover:text-[#ca8a04] transition-colors">
            Contact
          </Link>
          <a
            href="tel:+27211234567"
            className="flex items-center gap-1 text-white hover:text-[#ca8a04]"
            title="Call us"
          >
            <PhoneCall className="h-4 w-4" />
          </a>
        </nav>
      </div>
    </header>
  )
}
