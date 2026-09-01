import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import matter from "gray-matter"
import {
  offreSchema,
  blocPageSchema,
  type Offre,
  type DejaFaitItem,
  type BlocPage,
} from "@/lib/offre-frontmatter"
import { getRealisation } from "@/lib/realisations"

/**
 * Chaîne de contenu de la page /offres — même logique que `lib/realisations.ts` :
 * lecture fs, validation stricte, `slug` == nom de fichier, filtre brouillon.
 *
 * Pas de compilation MDX : le contenu est entièrement structuré (frontmatter),
 * il n'y a pas de corps en prose libre à rendre.
 */

const DOSSIER_OFFRES = join(process.cwd(), "content", "offres")
const DOSSIER_BLOCS = join(process.cwd(), "content", "offres-blocs")

function erreurFrontmatter(
  chemin: string,
  issues: { path: PropertyKey[]; message: string }[],
): Error {
  const details = issues
    .map((i) => `  - ${i.path.join(".") || "(racine)"} : ${i.message}`)
    .join("\n")
  return new Error(`Frontmatter invalide dans ${chemin} :\n${details}`)
}

function lireOffresBrouillonsCompris(dossier: string): Offre[] {
  return readdirSync(dossier)
    .filter((f) => f.endsWith(".mdx"))
    .map((nomFichier) => {
      const { data } = matter(readFileSync(join(dossier, nomFichier), "utf8"))
      const slugFichier = nomFichier.replace(/\.mdx$/, "")
      const parse = offreSchema.safeParse(data)
      if (!parse.success) throw erreurFrontmatter(`content/offres/${nomFichier}`, parse.error.issues)
      if (parse.data.slug !== slugFichier) {
        throw new Error(
          `content/offres/${nomFichier} : le champ slug ("${parse.data.slug}") doit correspondre au nom de fichier ("${slugFichier}").`,
        )
      }
      return parse.data
    })
}

/** Réservé aux tests et à l'outillage. */
export function _lireOffresBrouillonsCompris(dossier: string = DOSSIER_OFFRES): Offre[] {
  return lireOffresBrouillonsCompris(dossier)
}

/** Offres publiables, triées par `ordre` croissant (l'ordre est intentionnel). */
export function getOffresPubliees(dossier: string = DOSSIER_OFFRES): Offre[] {
  return lireOffresBrouillonsCompris(dossier)
    .filter((o) => !o.brouillon)
    .sort((a, b) => a.ordre - b.ordre)
}

function lireBlocPage(dossier: string, slug: string): BlocPage | null {
  const chemin = join(dossier, `${slug}.mdx`)
  if (!existsSync(chemin)) return null
  const { data } = matter(readFileSync(chemin, "utf8"))
  const parse = blocPageSchema.safeParse(data)
  if (!parse.success) throw erreurFrontmatter(`content/offres-blocs/${slug}.mdx`, parse.error.issues)
  if (parse.data.slug !== slug) {
    throw new Error(
      `content/offres-blocs/${slug}.mdx : le champ slug ("${parse.data.slug}") doit correspondre au nom de fichier ("${slug}").`,
    )
  }
  return parse.data
}

/** Réservé aux tests et à l'outillage. */
export function _lireBlocPageBrouillonCompris(
  slug: string,
  dossier: string = DOSSIER_BLOCS,
): BlocPage | null {
  return lireBlocPage(dossier, slug)
}

/** Bloc de page par slug. `null` si absent ou en brouillon. */
export function getBlocPage(slug: string, dossier: string = DOSSIER_BLOCS): BlocPage | null {
  const bloc = lireBlocPage(dossier, slug)
  return bloc && !bloc.brouillon ? bloc : null
}

export interface DejaFaitAffiche {
  texte: string
  /** Route vers la fiche, ou `null` si la réalisation est absente ou en brouillon. */
  lien: string | null
}

/**
 * Résout les exemples « Déjà fait » d'une offre.
 *
 * Le `texte` est TOUJOURS conservé (contenu éditorial de la page /offres).
 * Le lien n'est ajouté que si `getRealisation` trouve une fiche publiée —
 * il renvoie déjà `null` pour une fiche absente OU en brouillon. Résultat :
 * texte affiché, lien absent quand la fiche n'est pas publiable. Jamais de
 * lien mort, jamais d'erreur de build.
 */
export function resolveDejaFait(
  items: DejaFaitItem[],
  dossierRealisations?: string,
): DejaFaitAffiche[] {
  return items.map((item) => ({
    texte: item.texte,
    lien: getRealisation(item.slug, dossierRealisations)
      ? `/realisations/${item.slug}`
      : null,
  }))
}
