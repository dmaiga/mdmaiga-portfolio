import { getMeta } from "@/lib/contenu-pages"
import { imageOpenGraph, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og"

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = getMeta().pages.a_propos.description

export default function Image() {
  const { site, pages } = getMeta()
  return imageOpenGraph(site.nom, pages.a_propos.titre ?? site.nom, pages.a_propos.description)
}
