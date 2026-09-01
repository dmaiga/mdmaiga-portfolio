import type { Metadata } from "next"
import { SITE_URL } from "@/lib/site"
import { getMeta } from "@/lib/contenu-pages"

/**
 * Construction des métadonnées à partir du contenu (`content/pages/meta.mdx`).
 * Aucun titre ni description n'est écrit dans les composants de page.
 */

export type CleePage = "accueil" | "offres" | "realisations" | "a_propos" | "contact"

const CHEMINS: Record<CleePage, string> = {
  accueil: "/",
  offres: "/offres",
  realisations: "/realisations",
  a_propos: "/a-propos",
  contact: "/contact",
}

const base = SITE_URL.replace(/\/$/, "")

/** Métadonnées de base + Open Graph du site (layout). */
export function metadonneesSite(): Metadata {
  const { site } = getMeta()
  return {
    metadataBase: new URL(SITE_URL),
    title: { template: `%s | ${site.nom}`, default: site.nom },
    description: site.description,
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: site.nom,
      url: base,
      title: site.nom,
      description: site.description,
    },
    twitter: { card: "summary_large_image" },
  }
}

/**
 * Métadonnées d'une page fixe.
 * `titre` null (accueil) → on n'émet PAS la clé `title`, pour hériter du
 * `title.default` (nom du site) et du `openGraph.title` du layout.
 */
export function metadonneesPage(cle: CleePage): Metadata {
  const m = getMeta().pages[cle]
  const chemin = CHEMINS[cle]
  return {
    description: m.description,
    alternates: { canonical: chemin },
    openGraph: {
      url: `${base}${chemin}`,
      description: m.description,
      ...(m.titre ? { title: m.titre } : {}),
    },
    ...(m.titre ? { title: m.titre } : {}),
  }
}

/** Métadonnées d'une fiche de réalisation (contenu tiré du frontmatter). */
export function metadonneesFiche(titre: string, resume: string, slug: string): Metadata {
  const chemin = `/realisations/${slug}`
  return {
    title: titre,
    description: resume,
    alternates: { canonical: chemin },
    openGraph: { url: `${base}${chemin}`, title: titre, description: resume },
  }
}
