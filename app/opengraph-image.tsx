import { getMeta } from "@/lib/contenu-pages"
import { imageOpenGraph, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og"

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = getMeta().site.description

export default function Image() {
  const { site } = getMeta()
  return imageOpenGraph(site.nom, site.nom, site.description)
}
