import { z } from "zod"

/**
 * Schémas stricts du contenu des offres — même logique que `lib/frontmatter.ts`
 * pour les réalisations : tout vit en frontmatter, rien n'est en dur dans le code
 * (prix compris), validation au build.
 *
 * Deux modèles distincts :
 *  - `offreSchema`      : les trois offres principales (gabarit répété) ;
 *  - `complementSchema` : les blocs de bas de page (contrôle de paie, mission longue).
 */

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** Chemin relatif (`/contact`), `mailto:`, `tel:`, ou URL absolue. */
function lienValide(v: string): boolean {
  return v.startsWith("/") || v.startsWith("mailto:") || v.startsWith("tel:") || URL.canParse(v)
}
const lien = () => z.string().min(1).refine(lienValide, "lien invalide (/chemin, mailto:, tel: ou URL absolue)")

export const offreSchema = z
  .object({
    slug: z.string().regex(SLUG, "slug en kebab-case"),
    titre: z.string().min(1),
    accroche: z.string().min(1),
    // Puces éditables une à une par l'auteur, sans toucher au composant.
    concerne_si: z.array(z.string().min(1)).min(1),
    obtenez: z.array(z.string().min(1)).min(1),
    // Rendu en <ol> : la numérotation vient du HTML, pas d'un champ "numéro".
    etapes: z.array(z.string().min(1)).min(1),
    // Texte libre (jamais de montant en dur dans le code) : "2 à 4 semaines",
    // "À partir de 500 000 FCFA", etc.
    delai: z.string().min(1),
    budget: z.string().min(1),
    // Référence une réalisation par son slug. Résolue via lib/realisations.ts,
    // qui renvoie `null` pour une fiche brouillon ou absente : le bloc « Déjà
    // fait » disparaît alors sans lien mort ni erreur de build (ADR à consigner).
    deja_fait_slug: z.string().min(1).nullable(),
    cta_libelle: z.string().min(1),
    cta_lien: lien(),
    ordre: z.number().int(),
    brouillon: z.boolean(),
  })
  .strict()

export type Offre = z.infer<typeof offreSchema>

export const complementSchema = z
  .object({
    slug: z.string().regex(SLUG, "slug en kebab-case"),
    titre: z.string().min(1),
    texte: z.string().min(1),
    cta_libelle: z.string().min(1).nullable(),
    cta_lien: lien().nullable(),
    ordre: z.number().int(),
    brouillon: z.boolean(),
  })
  .strict()
  .refine((d) => (d.cta_libelle === null) === (d.cta_lien === null), {
    message: "cta_libelle et cta_lien doivent être renseignés ensemble (ou tous les deux null)",
    path: ["cta_lien"],
  })

export type Complement = z.infer<typeof complementSchema>
