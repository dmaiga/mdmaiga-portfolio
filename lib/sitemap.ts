import type { MetadataRoute } from "next"

/**
 * Construction pure du sitemap : 5 pages fixes + une entrée par réalisation
 * publiée. Le tri des brouillons se fait EN AMONT (`getSlugsPublies()` ne
 * renvoie que les fiches publiables) ; cette fonction n'ajoute que ce qu'on lui
 * donne. Séparée pour être testable sans le système de fichiers.
 */

const PAGES_FIXES = ["/", "/offres", "/realisations", "/a-propos", "/contact"]

export function construireSitemap(
  base: string,
  slugsRealisationsPubliees: string[],
): MetadataRoute.Sitemap {
  const b = base.replace(/\/$/, "")
  const chemins = [
    ...PAGES_FIXES,
    ...slugsRealisationsPubliees.map((s) => `/realisations/${s}`),
  ]
  return chemins.map((chemin) => ({ url: `${b}${chemin}` }))
}
