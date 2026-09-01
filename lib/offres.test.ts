import { fileURLToPath } from "node:url"
import { describe, it, expect } from "vitest"
import {
  getOffresPubliees,
  getBlocPage,
  resolveDejaFait,
  _lireOffresBrouillonsCompris,
  _lireBlocPageBrouillonCompris,
} from "@/lib/offres"

const dir = (nom: string) =>
  fileURLToPath(new URL(`./__fixtures__/${nom}`, import.meta.url))

const OFFRES = dir("offres")
const BLOCS = dir("offres-blocs")
const REALISATIONS = dir("realisations")

describe("offres — filtre brouillon", () => {
  it("la fixture brouillon existe bien", () => {
    expect(_lireOffresBrouillonsCompris(OFFRES).map((o) => o.slug)).toContain("zzz-en-brouillon")
  })

  it("exclue et triée par ordre croissant (ordre intentionnel)", () => {
    const slugs = getOffresPubliees(OFFRES).map((o) => o.slug)
    expect(slugs).not.toContain("zzz-en-brouillon")
    expect(slugs).toEqual(["beta", "alpha"])
  })
})

describe("offres — validation du frontmatter", () => {
  it("rejette un tableau de puces vide et un lien invalide", () => {
    expect(() => _lireOffresBrouillonsCompris(dir("offres-invalide"))).toThrow(
      /Frontmatter invalide/,
    )
  })
})

describe("blocs de page", () => {
  it("un bloc publié est renvoyé", () => {
    expect(getBlocPage("bloc-complet", BLOCS)?.titre).toBe("Bloc fixture complet")
  })

  it("un bloc en brouillon → null (masqué)", () => {
    expect(_lireBlocPageBrouillonCompris("bloc-brouillon", BLOCS)?.brouillon).toBe(true)
    expect(getBlocPage("bloc-brouillon", BLOCS)).toBeNull()
  })

  it("un bloc absent → null, sans erreur", () => {
    expect(getBlocPage("bloc-inexistant", BLOCS)).toBeNull()
  })

  it("rejette un frontmatter invalide (paragraphes vide, e-mail sans @, href invalide)", () => {
    expect(() => _lireBlocPageBrouillonCompris("casse", dir("offres-blocs-invalide"))).toThrow(
      /Frontmatter invalide/,
    )
  })
})

describe("resolveDejaFait — texte toujours affiché, lien conditionnel", () => {
  it("liste vide → liste vide", () => {
    expect(resolveDejaFait([], REALISATIONS)).toEqual([])
  })

  it("réalisation publiée → texte conservé + lien vers la fiche", () => {
    expect(resolveDejaFait([{ slug: "alpha", texte: "T" }], REALISATIONS)).toEqual([
      { texte: "T", lien: "/realisations/alpha" },
    ])
  })

  it("réalisation en brouillon → texte conservé, lien null (pas de lien mort)", () => {
    expect(
      resolveDejaFait([{ slug: "zzz-en-brouillon", texte: "T" }], REALISATIONS),
    ).toEqual([{ texte: "T", lien: null }])
  })

  it("réalisation inexistante → texte conservé, lien null (pas d'erreur)", () => {
    expect(
      resolveDejaFait([{ slug: "ce-slug-n-existe-pas", texte: "T" }], REALISATIONS),
    ).toEqual([{ texte: "T", lien: null }])
  })
})

describe("contenu réel du dépôt", () => {
  it("toutes les offres de content/offres ont un frontmatter valide", () => {
    expect(() => _lireOffresBrouillonsCompris()).not.toThrow()
  })

  it("les trois blocs de content/offres-blocs ont un frontmatter valide", () => {
    for (const slug of ["entete", "mission-longue-renfort-equipe", "bandeau-fin"]) {
      expect(() => _lireBlocPageBrouillonCompris(slug)).not.toThrow()
      expect(_lireBlocPageBrouillonCompris(slug)).not.toBeNull()
    }
  })
})
