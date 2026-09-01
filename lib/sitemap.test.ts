import { fileURLToPath } from "node:url"
import { describe, it, expect } from "vitest"
import { construireSitemap } from "@/lib/sitemap"
import { getSlugsPublies } from "@/lib/realisations"
import sitemapReel from "@/app/sitemap"

const FIXTURES = fileURLToPath(
  new URL("./__fixtures__/realisations", import.meta.url),
)

describe("construireSitemap", () => {
  it("5 pages fixes + une entrée par réalisation publiée, dans l'ordre", () => {
    const urls = construireSitemap("https://exemple.test/", ["beta", "alpha"]).map(
      (e) => e.url,
    )
    expect(urls).toEqual([
      "https://exemple.test/",
      "https://exemple.test/offres",
      "https://exemple.test/realisations",
      "https://exemple.test/a-propos",
      "https://exemple.test/contact",
      "https://exemple.test/realisations/beta",
      "https://exemple.test/realisations/alpha",
    ])
  })

  it("branché sur getSlugsPublies : un brouillon (zzz-en-brouillon) n'entre pas dans le sitemap", () => {
    const urls = construireSitemap("https://x.test", getSlugsPublies(FIXTURES)).map(
      (e) => e.url,
    )
    expect(urls).toContain("https://x.test/realisations/alpha")
    expect(urls).toContain("https://x.test/realisations/beta")
    expect(urls).not.toContain("https://x.test/realisations/zzz-en-brouillon")
  })
})

describe("app/sitemap.ts — sitemap réel du dépôt", () => {
  const urls = sitemapReel().map((e) => e.url)

  it("contient les 5 pages fixes", () => {
    for (const p of ["/", "/offres", "/realisations", "/a-propos", "/contact"]) {
      const attendu = p === "/" ? /\/$/ : new RegExp(`${p}$`)
      expect(urls.some((u) => attendu.test(u))).toBe(true)
    }
  })

  it("ne référence aucune fiche en brouillon (netsup, exemple-modele)", () => {
    expect(urls.some((u) => u.includes("/realisations/netsup"))).toBe(false)
    expect(urls.some((u) => u.includes("/realisations/exemple-modele"))).toBe(false)
  })
})
