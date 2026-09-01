import { notFound } from "next/navigation"
import { getRealisation, getSlugsPublies } from "@/lib/realisations"
import { getMeta } from "@/lib/contenu-pages"
import { imageOpenGraph, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og"

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

// Seules les fiches publiées ont une image OG. Une fiche en brouillon n'en
// génère aucune (elle n'est pas dans generateStaticParams, et dynamicParams
// est désactivé).
export const dynamicParams = false

export function generateStaticParams() {
  return getSlugsPublies().map((slug) => ({ slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const fiche = getRealisation(slug)
  if (!fiche) notFound()
  const { site } = getMeta()
  return imageOpenGraph(site.nom, fiche.frontmatter.titre, fiche.frontmatter.resume)
}
