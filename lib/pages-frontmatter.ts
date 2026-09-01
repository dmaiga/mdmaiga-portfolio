import { z } from "zod"
import { lien, lienNommeSchema, sectionTexteSchema } from "@/lib/schema-commun"

/**
 * Schémas stricts du contenu éditorial des pages fixes (accueil, à propos,
 * contact). Un fichier par page dans `content/pages/`. Comme pour les offres :
 * tout le texte vit en frontmatter, validé au build.
 *
 * L'accueil ne stocke que SON texte — les aperçus offres / réalisations sont
 * lus en direct depuis `lib/offres.ts` et `lib/realisations.ts` (jamais recopiés).
 */

const blocAvecCta = z.object({
  titre: z.string().min(1),
  paragraphes: z.array(z.string().min(1)).min(1),
  cta_libelle: z.string().min(1),
  cta_lien: lien(),
})

export const accueilSchema = z
  .object({
    hero: blocAvecCta,
    probleme: sectionTexteSchema,
    // Intitulé du bloc « les trois offres en résumé » (les offres elles-mêmes
    // sont lues via getOffresPubliees).
    apercu_offres: z.object({ titre: z.string().min(1) }),
    preuve: z.object({
      chiffre: z.string().min(1),
      libelle: z.string().min(1),
      detail: z.string().min(1).nullable(),
    }),
    // Intitulé du bloc « réalisations mises en avant » (lues via
    // getRealisationsMisesEnAvant ; bloc masqué s'il n'y en a aucune).
    apercu_realisations: z.object({ titre: z.string().min(1) }),
    demarche: sectionTexteSchema,
    cta: blocAvecCta,
  })
  .strict()

export type Accueil = z.infer<typeof accueilSchema>

export const aProposSchema = z
  .object({
    titre: z.string().min(1),
    intro: z.array(z.string().min(1)).min(1),
    sections: z.array(sectionTexteSchema).min(1),
  })
  .strict()

export type APropos = z.infer<typeof aProposSchema>

export const contactSchema = z
  .object({
    titre: z.string().min(1),
    intro: z.array(z.string().min(1)).min(1),
    email: z
      .string()
      .min(1)
      .refine((v) => v.includes("@"), "adresse e-mail attendue"),
    liens: z.array(lienNommeSchema),
  })
  .strict()

export type Contact = z.infer<typeof contactSchema>
