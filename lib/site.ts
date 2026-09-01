/**
 * URL absolue du site — seule variable d'environnement lue au build.
 *
 * Utilisée par `metadataBase`, les URLs canoniques, le sitemap et les images
 * Open Graph. `next build` ne doit PAS échouer si elle est absente : on retombe
 * sur une valeur par défaut explicite, et on le signale (repli non silencieux).
 *
 * TODO — Remplacer FALLBACK par l'URL Vercel de production réelle.
 * Cette valeur changera au passage sur le domaine définitif (.ml prévu).
 * Ne jamais utiliser localhost comme défaut : les métadonnées absolues
 * (OG, canoniques) seraient cassées en production.
 */
const FALLBACK = "https://portfolio-freelance.vercel.app" // TODO — URL Vercel de prod

if (!process.env.NEXT_PUBLIC_SITE_URL) {
  console.warn(
    `[site] NEXT_PUBLIC_SITE_URL non défini — repli sur ${FALLBACK}. ` +
      "À définir dans les variables d'environnement Vercel avant mise en production.",
  )
}

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK
