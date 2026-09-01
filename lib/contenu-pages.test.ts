import { fileURLToPath } from "node:url"
import { describe, it, expect } from "vitest"
import { getAccueil, getAPropos, getContact } from "@/lib/contenu-pages"

const dir = (nom: string) =>
  fileURLToPath(new URL(`./__fixtures__/${nom}`, import.meta.url))

const PAGES = dir("pages")

describe("contenu des pages fixes — lecture et validation", () => {
  it("accueil : lit toutes les sections", () => {
    const a = getAccueil(PAGES)
    expect(a.hero.titre).toBe("Hero fixture")
    expect(a.preuve.chiffre).toBe("6 semaines")
    expect(a.apercu_realisations.titre).toBe("Quelques réalisations")
  })

  it("à propos : lit intro + sections", () => {
    const a = getAPropos(PAGES)
    expect(a.sections).toHaveLength(2)
    expect(a.sections[0].titre).toBe("Ma démarche")
  })

  it("contact : lit e-mail et liens", () => {
    const c = getContact(PAGES)
    expect(c.email).toContain("@")
    expect(c.liens.map((l) => l.libelle)).toEqual(["LinkedIn", "GitHub"])
  })

  it("rejette un frontmatter d'accueil invalide (paragraphes vide, lien cassé, section manquante, clé inconnue)", () => {
    expect(() => getAccueil(dir("pages-invalide"))).toThrow(/Frontmatter invalide/)
  })
})

describe("contenu réel du dépôt", () => {
  it("accueil, à propos et contact ont un frontmatter valide", () => {
    expect(() => getAccueil()).not.toThrow()
    expect(() => getAPropos()).not.toThrow()
    expect(() => getContact()).not.toThrow()
  })
})
