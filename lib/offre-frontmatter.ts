import { z } from "zod"
import { SLUG, lien, lienNommeSchema } from "@/lib/schema-commun"

/**
 * Schémas stricts du contenu de la page /offres — même logique que
 * `lib/frontmatter.ts` : tout vit en frontmatter, rien n'est en dur dans le
 * code (montants et délais compris), validation au build.
 *
 *  - `offreSchema`    : les trois offres principales (gabarit répété) ;
 *  - `blocPageSchema` : les blocs de page (en-tête, mission longue, bandeau de fin).
 */

/**
 * Un exemple « Déjà fait » d'une offre. `texte` est le contenu éditorial rédigé
 * pour la page /offres — jamais dérivé de la fiche. `slug` désigne une
 * réalisation : si elle existe et n'est pas en brouillon, un lien est ajouté ;
 * sinon le texte s'affiche seul (voir `resolveDejaFait`).
 */
const dejaFaitItem = z.object({
  slug: z.string().regex(SLUG, "slug en kebab-case"),
  texte: z.string().min(1),
})

export const offreSchema = z
  .object({
    slug: z.string().regex(SLUG, "slug en kebab-case"),
    titre: z.string().min(1),
    accroche: z.string().min(1),
    concerne_si: z.array(z.string().min(1)).min(1),
    obtenez: z.array(z.string().min(1)).min(1),
    // Rendu en <ol> : la numérotation vient du HTML, pas d'un champ "numéro".
    etapes: z.array(z.string().min(1)).min(1),
    // Texte libre (jamais de montant en dur dans le code).
    delai: z.string().min(1),
    budget: z.string().min(1),
    // Bloc "Note" distinct en fin d'offre (rare). `null` = pas de note.
    note: z.string().min(1).nullable(),
    // Exemples "Déjà fait" (0..n). Chaque item : texte éditorial + slug de fiche.
    deja_fait: z.array(dejaFaitItem),
    cta_libelle: z.string().min(1),
    cta_lien: lien(),
    ordre: z.number().int(),
    brouillon: z.boolean(),
  })
  .strict()

export type Offre = z.infer<typeof offreSchema>
export type DejaFaitItem = z.infer<typeof dejaFaitItem>

/**
 * Bloc de page à emplacement fixe (en-tête, mission longue, bandeau de fin).
 * Schéma souple : `tarif`, `email` et `liens` sont facultatifs et combinés
 * selon le bloc. Pas d'`ordre` — chaque bloc a une place dédiée dans la page.
 */
export const blocPageSchema = z
  .object({
    slug: z.string().regex(SLUG, "slug en kebab-case"),
    titre: z.string().min(1),
    paragraphes: z.array(z.string().min(1)).min(1),
    tarif: z.string().min(1).nullable(),
    email: z
      .string()
      .min(1)
      .refine((v) => v.includes("@"), "adresse e-mail attendue")
      .nullable(),
    liens: z.array(lienNommeSchema),
    brouillon: z.boolean(),
  })
  .strict()

export type BlocPage = z.infer<typeof blocPageSchema>
