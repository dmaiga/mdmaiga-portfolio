import { z } from "zod"

/**
 * Briques de schéma partagées entre les modèles de contenu
 * (`frontmatter.ts`, `offre-frontmatter.ts`, `pages-frontmatter.ts`).
 */

/** Slug en kebab-case : a-z, 0-9, tirets simples. */
export const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** Chemin relatif (`/contact`), `mailto:`, `tel:`, ou URL absolue. */
export function lienValide(v: string): boolean {
  return v.startsWith("/") || v.startsWith("mailto:") || v.startsWith("tel:") || URL.canParse(v)
}

export const lien = () =>
  z.string().min(1).refine(lienValide, "lien invalide (/chemin, mailto:, tel: ou URL absolue)")

/** `{ libelle, href }` — un lien nommé. */
export const lienNommeSchema = z.object({
  libelle: z.string().min(1),
  href: lien(),
})

/** `{ titre, paragraphes[] }` — une section de texte (au moins un paragraphe). */
export const sectionTexteSchema = z.object({
  titre: z.string().min(1),
  paragraphes: z.array(z.string().min(1)).min(1),
})
