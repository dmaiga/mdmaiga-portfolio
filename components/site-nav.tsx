"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

/**
 * Navigation principale — cinq entrées, ordre imposé.
 * « Offres » en deuxième position, intentionnellement.
 */
const ENTREES = [
  { libelle: "Accueil", href: "/" },
  { libelle: "Offres", href: "/offres" },
  { libelle: "Réalisations", href: "/realisations" },
  { libelle: "À propos", href: "/a-propos" },
  { libelle: "Contact", href: "/contact" },
] as const

export function SiteNav() {
  const pathname = usePathname()

  return (
    <header className="border-b border-border">
      <nav
        aria-label="Navigation principale"
        className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-sm"
      >
        {ENTREES.map(({ libelle, href }) => {
          const actif = href === "/" ? pathname === "/" : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              aria-current={actif ? "page" : undefined}
              className={cn(
                "rounded px-1 py-0.5 transition-colors",
                actif
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {libelle}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
