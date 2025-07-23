import Link from "next/link"
import { MountainIcon, UserCog } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <MountainIcon className="h-6 w-6 text-brand-primary" />
          <span className="hidden font-montserrat font-bold sm:inline-block">CapeTownXP</span>
        </Link>
        <nav className="flex flex-1 items-center gap-6 text-sm">
          <Link href="/tours" className="text-foreground/60 transition-colors hover:text-foreground/80">
            Tours
          </Link>
        </nav>
        <div className="flex items-center justify-end">
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin">
              <UserCog className="mr-2 h-4 w-4" />
              Admin
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
