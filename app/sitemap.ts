import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"
import { getSlugsPublies } from "@/lib/realisations"
import { construireSitemap } from "@/lib/sitemap"

export default function sitemap(): MetadataRoute.Sitemap {
  // getSlugsPublies() exclut les brouillons — le sitemap aussi, par construction.
  return construireSitemap(SITE_URL, getSlugsPublies())
}
