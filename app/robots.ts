import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  const base = SITE_URL.replace(/\/$/, "")
  return {
    // Les fiches en brouillon n'ont pas de route (dynamicParams désactivé) :
    // rien à interdire, elles répondent 404.
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
  }
}
