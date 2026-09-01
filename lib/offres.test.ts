import { fileURLToPath } from "node:url"
import { describe, it, expect } from "vitest"
import {
  getOffresPubliees,
  getComplementsPublies,
  resolveDejaFait,
  _lireOffresBrouillonsCompris,
  _lireComplementsBrouillonsCompris,
} from "@/lib/offres"

const dir = (nom: string) =>
  fileURLToPath(new URL(`./__fixtures__/${nom}`, import.meta.url))

const OFFRES = dir("offres")
const COMPLEMENTS = dir("offres-complementaires")
const REALISATIONS = dir("realisations")

describe("offres — filtre brouillon", () => {
  it("la fixture brouillon existe bien (sans quoi les assertions ne prouvent rien)", () => {
    const tous = _lireOffresBrouillonsCompris(OFFRES).map((o) => o.slug)
    expect(tous).toContain("zzz-en-brouillon")
  })

  it("exclue et triée par ordre croissant", () => {
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

describe("compléments de bas de page — filtre brouillon", () => {
  it("exclus et triés par ordre croissant", () => {
    const slugs = getComplementsPublies(COMPLEMENTS).map((c) => c.slug)
    expect(slugs).not.toContain("zzz-en-brouillon")
    expect(slugs).toEqual(["beta"])
  })
})

describe("compléments — validation du frontmatter", () => {
  it("rejette un cta_libelle sans cta_lien (paire incohérente)", () => {
    expect(() =>
      _lireComplementsBrouillonsCompris(dir("offres-complementaires-invalide")),
    ).toThrow(/Frontmatter invalide/)
  })
})

describe("resolveDejaFait — jamais de lien mort, jamais d'erreur", () => {
  it("pas de référence (slug null) → aucun bloc", () => {
    expect(resolveDejaFait(null, REALISATIONS)).toBeNull()
  })

  it("réalisation publiée → bloc résolu avec titre et slug", () => {
    expect(resolveDejaFait("alpha", REALISATIONS)).toEqual({
      titre: "Fixture Alpha",
      slug: "alpha",
    })
  })

  it("réalisation en brouillon → le bloc disparaît silencieusement (pas de lien mort)", () => {
    expect(resolveDejaFait("zzz-en-brouillon", REALISATIONS)).toBeNull()
  })

  it("réalisation inexistante → le bloc disparaît silencieusement (pas d'erreur)", () => {
    expect(resolveDejaFait("ce-slug-n-existe-pas", REALISATIONS)).toBeNull()
  })
})

describe("contenu réel du dépôt", () => {
  it("toutes les offres de content/offres ont un frontmatter valide", () => {
    expect(() => _lireOffresBrouillonsCompris()).not.toThrow()
  })

  it("tous les compléments de content/offres-complementaires ont un frontmatter valide", () => {
    expect(() => _lireComplementsBrouillonsCompris()).not.toThrow()
  })
})
