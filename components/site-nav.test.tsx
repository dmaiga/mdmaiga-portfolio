import { describe, it, expect, vi } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"

vi.mock("next/navigation", () => ({ usePathname: () => "/offres" }))
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))

const { SiteNav } = await import("@/components/site-nav")

describe("SiteNav", () => {
  const html = renderToStaticMarkup(<SiteNav />)

  it("cinq entrées, dans l'ordre imposé (Offres en 2e position)", () => {
    const libelles = [...html.matchAll(/>([^<]+)<\/a>/g)].map((m) => m[1])
    expect(libelles).toEqual(["Accueil", "Offres", "Réalisations", "À propos", "Contact"])
  })

  it("marque la page courante avec aria-current=\"page\"", () => {
    expect(html).toMatch(/href="\/offres"[^>]*aria-current="page"/)
  })

  it("n'a qu'une seule entrée aria-current", () => {
    expect([...html.matchAll(/aria-current="page"/g)]).toHaveLength(1)
  })
})
