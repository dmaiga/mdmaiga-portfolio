/**
 * URL absolue du site — seule variable d'environnement lue au build.
 *
 * Utilisée par `metadataBase`, les URLs canoniques, le sitemap et les images
 * Open Graph. `next build` ne doit PAS échouer si elle est absente : on retombe
 * sur une valeur par défaut explicite, et on le signale (repli non silencieux).
 *
 * `FALLBACK` est provisoire (voir la liste de mise en ligne du rapport d'étape 6) :
 * il faut définir `NEXT_PUBLIC_SITE_URL` sur Vercel, puis le passer au domaine
 * définitif (.ml prévu). Ne jamais utiliser localhost comme défaut : les
 * métadonnées absolues (OG, canoniques) seraient cassées en production.
 */
const FALLBACK = "https://portfolio-freelance.vercel.app" // provisoire

if (!process.env.NEXT_PUBLIC_SITE_URL) {
  console.warn(
    `[site] NEXT_PUBLIC_SITE_URL non défini — repli sur ${FALLBACK}. ` +
      "À définir dans les variables d'environnement Vercel avant mise en production.",
  )
}

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK

/**
 * Clé publique Web3Forms pour le formulaire de contact.
 * Absente au build → le formulaire n'est pas rendu, l'e-mail reste affiché et
 * cliquable (dégradation propre — voir `app/contact/page.tsx`).
 */
export const CLE_FORMULAIRE_CONTACT = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || null

