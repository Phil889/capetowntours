import Link from "next/link"
import { MountainIcon, Facebook, Twitter, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-200">
      <div className="container mx-auto grid grid-cols-2 gap-8 px-4 py-12 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="mb-4 flex items-center space-x-2">
            <MountainIcon className="h-8 w-8 text-white" />
            <span className="font-montserrat text-xl font-bold">CapeTownXP</span>
          </Link>
          <p className="text-sm text-slate-400">Your adventure starts here.</p>
        </div>
        <div>
          <h3 className="font-montserrat mb-4 font-bold uppercase tracking-wider">Company</h3>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white">
                Careers
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-montserrat mb-4 font-bold uppercase tracking-wider">Resources</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/tours" className="hover:text-white">
                Explore Tours
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white">
                FAQ
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-montserrat mb-4 font-bold uppercase tracking-wider">Legal</h3>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-700">
        <div className="container mx-auto flex flex-col items-center justify-between px-4 py-6 sm:flex-row">
          <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} CapeTownXP. All rights reserved.</p>
          <div className="mt-4 flex space-x-4 sm:mt-0">
            <Link href="#" aria-label="Facebook">
              <Facebook className="h-6 w-6 hover:text-white" />
            </Link>
            <Link href="#" aria-label="Twitter">
              <Twitter className="h-6 w-6 hover:text-white" />
            </Link>
            <Link href="#" aria-label="Instagram">
              <Instagram className="h-6 w-6 hover:text-white" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
