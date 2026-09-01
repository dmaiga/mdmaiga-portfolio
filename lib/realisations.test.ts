import { fileURLToPath } from "node:url"
import { describe, it, expect } from "vitest"
import {
  getRealisationsPubliees,
  getRealisation,
  getSlugsPublies,
  getRealisationsMisesEnAvant,
  _lireFichesBrouillonsComprises,
} from "@/lib/realisations"
import { frontmatterSchema } from "@/lib/frontmatter"

const dir = (nom: string) =>
  fileURLToPath(new URL(`./__fixtures__/${nom}`, import.meta.url))

const FIXTURES = dir("realisations")
const SLUG_BROUILLON = "zzz-en-brouillon"

/**
 * GARDE-FOU CENTRAL DU PROJET (docs/DECISIONS.md ADR-005).
 *
 * La fixture `zzz-en-brouillon.mdx` est piégée : `ordre: 0` (elle trierait en
 * tête) et `mis_en_avant: true` (elle passerait sur l'accueil). Si le filtre
 * `brouillon` cède, ces tests le voient immédiatement.
 */
describe("filtre brouillon", () => {
  it("la fixture brouillon existe bien (sans quoi les assertions ne prouvent rien)", () => {
    const tous = _lireFichesBrouillonsComprises(FIXTURES).map((r) => r.frontmatter.slug)
    expect(tous).toContain(SLUG_BROUILLON)
  })

  it("exclu de l'index — getRealisationsPubliees", () => {
    const slugs = getRealisationsPubliees(FIXTURES).map((r) => r.frontmatter.slug)
    expect(slugs).not.toContain(SLUG_BROUILLON)
    expect(slugs).toEqual(["beta", "alpha"])
  })

  it("exclu de l'accueil — getRealisationsMisesEnAvant, malgré mis_en_avant: true", () => {
    const slugs = getRealisationsMisesEnAvant(FIXTURES).map((r) => r.frontmatter.slug)
    expect(slugs).not.toContain(SLUG_BROUILLON)
    expect(slugs).toEqual(["alpha"])
  })

  it("exclu des routes générées — getSlugsPublies (generateStaticParams)", () => {
    expect(getSlugsPublies(FIXTURES)).not.toContain(SLUG_BROUILLON)
  })

  it("exclu du sitemap — construit sur la même source getSlugsPublies", () => {
    const urls = getSlugsPublies(FIXTURES).map((s) => `/realisations/${s}`)
    expect(urls).not.toContain(`/realisations/${SLUG_BROUILLON}`)
  })

  it("non résoluble par slug — getRealisation renvoie null (→ 404)", () => {
    expect(getRealisation(SLUG_BROUILLON, FIXTURES)).toBeNull()
  })
})

describe("tri", () => {
  it("fiches publiées triées par `ordre` croissant", () => {
    const ordres = getRealisationsPubliees(FIXTURES).map((r) => r.frontmatter.ordre)
    expect(ordres).toEqual([...ordres].sort((a, b) => a - b))
  })
})

describe("validation du frontmatter", () => {
  it("une fiche conforme ne lève rien", () => {
    expect(() => getRealisationsPubliees(FIXTURES)).not.toThrow()
  })

  it("rejette un frontmatter invalide (type hors taxonomie, titre vide, mois 13, clé inconnue)", () => {
    expect(() => _lireFichesBrouillonsComprises(dir("invalide"))).toThrow(
      /Frontmatter invalide/,
    )
  })

  it("schéma strict : une clé inconnue est refusée", () => {
    const res = frontmatterSchema.safeParse({ champ_en_trop: 1 })
    expect(res.success).toBe(false)
  })

  it("exige slug === nom de fichier", () => {
    expect(() => _lireFichesBrouillonsComprises(dir("slug-incoherent"))).toThrow(
      /doit correspondre au nom de fichier/,
    )
  })
})

describe("contenu réel du dépôt", () => {
  it("toutes les fiches de content/realisations ont un frontmatter valide", () => {
    expect(() => _lireFichesBrouillonsComprises()).not.toThrow()
  })

  it("la fiche modèle est un brouillon : jamais publiée", () => {
    expect(getSlugsPublies()).not.toContain("exemple-modele")
  })
})
