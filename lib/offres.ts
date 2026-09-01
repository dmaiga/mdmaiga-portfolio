import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import matter from "gray-matter"
import { offreSchema, complementSchema, type Offre, type Complement } from "@/lib/offre-frontmatter"
import { getRealisation } from "@/lib/realisations"

/**
 * Chaîne de contenu des offres — même logique que `lib/realisations.ts` :
 * lecture fs, validation stricte, `slug` == nom de fichier, filtre brouillon.
 *
 * Pas de compilation MDX ici : le contenu d'une offre est entièrement
 * structuré (frontmatter), il n'y a pas de corps en prose libre à rendre.
 */

const DOSSIER_OFFRES = join(process.cwd(), "content", "offres")
const DOSSIER_COMPLEMENTS = join(process.cwd(), "content", "offres-complementaires")

function erreurFrontmatter(chemin: string, issues: { path: PropertyKey[]; message: string }[]): Error {
  const details = issues
    .map((i) => `  - ${i.path.join(".") || "(racine)"} : ${i.message}`)
    .join("\n")
  return new Error(`Frontmatter invalide dans ${chemin} :\n${details}`)
}

function erreurSlug(chemin: string, slugDeclare: string, slugFichier: string): Error {
  return new Error(
    `${chemin} : le champ slug ("${slugDeclare}") doit correspondre au nom de fichier ("${slugFichier}").`,
  )
}

function lireOffresBrouillonsCompris(dossier: string): Offre[] {
  return readdirSync(dossier)
    .filter((f) => f.endsWith(".mdx"))
    .map((nomFichier) => {
      const { data } = matter(readFileSync(join(dossier, nomFichier), "utf8"))
      const slugFichier = nomFichier.replace(/\.mdx$/, "")
      const parse = offreSchema.safeParse(data)
      if (!parse.success) throw erreurFrontmatter(`content/offres/${nomFichier}`, parse.error.issues)
      if (parse.data.slug !== slugFichier) throw erreurSlug(`content/offres/${nomFichier}`, parse.data.slug, slugFichier)
      return parse.data
    })
}

function lireComplementsBrouillonsCompris(dossier: string): Complement[] {
  return readdirSync(dossier)
    .filter((f) => f.endsWith(".mdx"))
    .map((nomFichier) => {
      const { data } = matter(readFileSync(join(dossier, nomFichier), "utf8"))
      const slugFichier = nomFichier.replace(/\.mdx$/, "")
      const parse = complementSchema.safeParse(data)
      if (!parse.success)
        throw erreurFrontmatter(`content/offres-complementaires/${nomFichier}`, parse.error.issues)
      if (parse.data.slug !== slugFichier)
        throw erreurSlug(`content/offres-complementaires/${nomFichier}`, parse.data.slug, slugFichier)
      return parse.data
    })
}

/** Réservé aux tests et à l'outillage. */
export function _lireOffresBrouillonsCompris(dossier: string = DOSSIER_OFFRES): Offre[] {
  return lireOffresBrouillonsCompris(dossier)
}

/** Offres publiables, triées par `ordre` croissant. */
export function getOffresPubliees(dossier: string = DOSSIER_OFFRES): Offre[] {
  return lireOffresBrouillonsCompris(dossier)
    .filter((o) => !o.brouillon)
    .sort((a, b) => a.ordre - b.ordre)
}

/** Réservé aux tests et à l'outillage. */
export function _lireComplementsBrouillonsCompris(
  dossier: string = DOSSIER_COMPLEMENTS,
): Complement[] {
  return lireComplementsBrouillonsCompris(dossier)
}

/** Blocs de bas de page publiables, triés par `ordre` croissant. */
export function getComplementsPublies(dossier: string = DOSSIER_COMPLEMENTS): Complement[] {
  return lireComplementsBrouillonsCompris(dossier)
    .filter((c) => !c.brouillon)
    .sort((a, b) => a.ordre - b.ordre)
}

export interface DejaFait {
  titre: string
  slug: string
}

/**
 * Résout la référence « Déjà fait » d'une offre vers une réalisation.
 *
 * `null` dans TOUS les cas où le lien ne peut pas être montré : pas de
 * référence, réalisation absente, ou réalisation en brouillon (`getRealisation`
 * renvoie déjà `null` pour un brouillon). Jamais de lien mort, jamais d'erreur —
 * l'offre s'affiche, la référence disparaît silencieusement.
 */
export function resolveDejaFait(
  slug: string | null,
  dossierRealisations?: string,
): DejaFait | null {
  if (!slug) return null
  const fiche = getRealisation(slug, dossierRealisations)
  if (!fiche) return null
  return { titre: fiche.frontmatter.titre, slug: fiche.frontmatter.slug }
}
