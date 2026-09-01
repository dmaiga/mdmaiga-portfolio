import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { describe, it, expect } from "vitest"
import { _lireFichesBrouillonsComprises } from "@/lib/realisations"
import { _lireOffresBrouillonsCompris } from "@/lib/offres"

/**
 * Garde-fou de publication : une réalisation ou une offre `brouillon: false`
 * ne doit contenir aucun marqueur d'inachèvement (`TODO —`, `[VÉRIFIER`).
 *
 * Les brouillons et les pages fixes (accueil / à propos / contact) en sont
 * exemptés : ils peuvent encore porter des marqueurs pendant la rédaction.
 * Voir le rapport d'étape pour la liste des `[VÉRIFIER]` en cours.
 */
const MARQUEURS = /TODO\s+—|\[VÉRIFIER/

function corps(dossier: string, slug: string): string {
  return readFileSync(join(process.cwd(), "content", dossier, `${slug}.mdx`), "utf8")
}

describe("garde-fou de publication — contenu publié sans marqueur d'inachèvement", () => {
  it("réalisations non brouillon", () => {
    const publiees = _lireFichesBrouillonsComprises()
      .filter((r) => !r.frontmatter.brouillon)
      .map((r) => r.frontmatter.slug)
    for (const slug of publiees) {
      expect(corps("realisations", slug), `content/realisations/${slug}.mdx`).not.toMatch(
        MARQUEURS,
      )
    }
  })

  it("offres non brouillon", () => {
    const publiees = _lireOffresBrouillonsCompris()
      .filter((o) => !o.brouillon)
      .map((o) => o.slug)
    for (const slug of publiees) {
      expect(corps("offres", slug), `content/offres/${slug}.mdx`).not.toMatch(MARQUEURS)
    }
  })

  it("blocs de page publiés", () => {
    const dossier = join(process.cwd(), "content", "offres-blocs")
    for (const fichier of readdirSync(dossier).filter((f) => f.endsWith(".mdx"))) {
      const contenu = readFileSync(join(dossier, fichier), "utf8")
      if (!/brouillon:\s*true/.test(contenu)) {
        expect(contenu, `content/offres-blocs/${fichier}`).not.toMatch(MARQUEURS)
      }
    }
  })
})
