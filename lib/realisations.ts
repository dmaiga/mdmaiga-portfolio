import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import matter from "gray-matter"
import { frontmatterSchema, type Frontmatter } from "@/lib/frontmatter"

/**
 * Chaîne de contenu : lecture des fiches MDX, validation stricte du frontmatter,
 * exclusion des brouillons, tri.
 *
 * GARANTIE CENTRALE DU PROJET (docs/DECISIONS.md ADR-005) :
 * une fiche `brouillon: true` n'est renvoyée par AUCUNE des fonctions publiques
 * ci-dessous. Comme l'index, l'accueil, le sitemap et `generateStaticParams`
 * consomment tous ces mêmes fonctions, une fiche en brouillon n'apparaît nulle
 * part et n'a pas de route (→ 404 en production). Prouvé par realisations.test.ts.
 *
 * Le paramètre `dossier` est un point d'entrée pour les tests (fixtures) ; le
 * code applicatif appelle toujours ces fonctions sans argument.
 */

const DOSSIER_CONTENU = join(process.cwd(), "content", "realisations")

export interface Realisation {
  frontmatter: Frontmatter
  /** Corps MDX brut. Compilé au rendu (étape 3). */
  corps: string
}

function lireFiche(dossier: string, nomFichier: string): Realisation {
  const brut = readFileSync(join(dossier, nomFichier), "utf8")
  const { data, content } = matter(brut)
  const slugFichier = nomFichier.replace(/\.mdx$/, "")

  const parse = frontmatterSchema.safeParse(data)
  if (!parse.success) {
    const details = parse.error.issues
      .map((i) => `  - ${i.path.join(".") || "(racine)"} : ${i.message}`)
      .join("\n")
    throw new Error(
      `Frontmatter invalide dans content/realisations/${nomFichier} :\n${details}`,
    )
  }
  if (parse.data.slug !== slugFichier) {
    throw new Error(
      `content/realisations/${nomFichier} : le champ slug ("${parse.data.slug}") ` +
        `doit correspondre au nom de fichier ("${slugFichier}").`,
    )
  }
  return { frontmatter: parse.data, corps: content }
}

function lireToutesLesFiches(dossier: string): Realisation[] {
  return readdirSync(dossier)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => lireFiche(dossier, f))
}

/**
 * Toutes les fiches, brouillons compris. Réservé aux tests et à l'outillage —
 * ne jamais utiliser pour un rendu visible.
 */
export function _lireFichesBrouillonsComprises(
  dossier: string = DOSSIER_CONTENU,
): Realisation[] {
  return lireToutesLesFiches(dossier)
}

/** Fiches publiables (brouillon exclu), triées par `ordre` croissant. */
export function getRealisationsPubliees(
  dossier: string = DOSSIER_CONTENU,
): Realisation[] {
  return lireToutesLesFiches(dossier)
    .filter((r) => !r.frontmatter.brouillon)
    .sort((a, b) => a.frontmatter.ordre - b.frontmatter.ordre)
}

/** Une fiche par slug. `null` si absente ou en brouillon. */
export function getRealisation(
  slug: string,
  dossier: string = DOSSIER_CONTENU,
): Realisation | null {
  return getRealisationsPubliees(dossier).find((r) => r.frontmatter.slug === slug) ?? null
}

/** Slugs publiables — pour `generateStaticParams`. */
export function getSlugsPublies(dossier: string = DOSSIER_CONTENU): string[] {
  return getRealisationsPubliees(dossier).map((r) => r.frontmatter.slug)
}

/** Fiches mises en avant sur l'accueil (publiables ET `mis_en_avant`). */
export function getRealisationsMisesEnAvant(
  dossier: string = DOSSIER_CONTENU,
): Realisation[] {
  return getRealisationsPubliees(dossier).filter((r) => r.frontmatter.mis_en_avant)
}
