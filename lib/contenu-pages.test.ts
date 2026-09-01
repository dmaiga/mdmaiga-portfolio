import { fileURLToPath } from "node:url"
import { describe, it, expect } from "vitest"
import { getAccueil, getAPropos, getContact, getMeta } from "@/lib/contenu-pages"

const dir = (nom: string) =>
  fileURLToPath(new URL(`./__fixtures__/${nom}`, import.meta.url))

const PAGES = dir("pages")

describe("contenu des pages fixes — lecture et validation", () => {
  it("accueil : lit hero, problème (blocs), preuve (entrées), aperçus", () => {
    const a = getAccueil(PAGES)
    expect(a.hero.cta_principal.href).toBe("/offres")
    expect(a.probleme.blocs).toHaveLength(2)
    expect(a.preuve.entrees[0].chiffre).toBe("206")
    expect(a.preuve.entrees[1].detail).toBeNull()
    expect(a.apercu_realisations.lien_libelle).toBe("Voir toutes les réalisations")
  })

  it("à propos : lit sections prose, blocs, liste de parcours", () => {
    const a = getAPropos(PAGES)
    expect(a.titre).toBe("Nom Prénom")
    expect(a.comment_je_travaille.blocs[0].titre).toBe("Je cadre.")
    expect(a.parcours.items).toHaveLength(2)
    expect(a.cta.liens.map((l) => l.libelle)).toEqual(["Voir les offres", "Me contacter"])
  })

  it("contact : lit e-mail, liens et description du formulaire", () => {
    const c = getContact(PAGES)
    expect(c.email).toContain("@")
    expect(c.liens.map((l) => l.libelle)).toEqual(["LinkedIn", "GitHub"])
    expect(c.formulaire.champs.map((ch) => ch.nom)).toEqual([
      "nom",
      "email",
      "type-de-besoin",
      "votre-situation",
    ])
    const liste = c.formulaire.champs.find((ch) => ch.type === "liste")!
    expect(liste.options).not.toBeNull()
  })

  it("meta : lit le nom du site et un titre/description par page", () => {
    const m = getMeta(PAGES)
    expect(m.site.nom).toBe("Nom Du Site")
    expect(m.pages.accueil.titre).toBeNull()
    expect(m.pages.offres.titre).toBe("Offres")
    expect(m.pages.contact.description).toContain("fixture")
  })

  it("rejette un frontmatter d'accueil invalide (blocs vide, lien cassé, e-mail sans @, section manquante, clé inconnue)", () => {
    expect(() => getAccueil(dir("pages-invalide"))).toThrow(/Frontmatter invalide/)
  })
})

describe("contenu réel du dépôt", () => {
  it("accueil, à propos, contact et meta ont un frontmatter valide", () => {
    expect(() => getAccueil()).not.toThrow()
    expect(() => getAPropos()).not.toThrow()
    expect(() => getContact()).not.toThrow()
    expect(() => getMeta()).not.toThrow()
  })
})
