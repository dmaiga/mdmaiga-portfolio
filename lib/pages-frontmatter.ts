import { z } from "zod"
import {
  SLUG,
  lien,
  lienNommeSchema,
  sectionTexteSchema,
  blocSchema,
} from "@/lib/schema-commun"

/**
 * Schémas stricts du contenu éditorial des pages fixes (accueil, à propos,
 * contact). Un fichier par page dans `content/pages/`. Comme pour les offres :
 * tout le texte vit en frontmatter, validé au build.
 *
 * L'accueil ne stocke que SON texte — les offres et les réalisations mises en
 * avant sont lues en direct depuis `lib/offres.ts` et `lib/realisations.ts`
 * (jamais recopiées).
 */

const email = () =>
  z.string().min(1).refine((v) => v.includes("@"), "adresse e-mail attendue")

/* ------------------------------- Accueil -------------------------------- */

export const accueilSchema = z
  .object({
    hero: z.object({
      titre: z.string().min(1),
      sous_titre: z.string().min(1),
      disponibilite: z.string().min(1).nullable(),
      cta_principal: lienNommeSchema,
      cta_secondaire: lienNommeSchema,
    }),
    probleme: z.object({
      titre: z.string().min(1),
      blocs: z.array(blocSchema).min(1),
    }),
    apercu_offres: z.object({
      titre: z.string().min(1),
      texte: z.string().min(1),
      lien_libelle: z.string().min(1),
    }),
    preuve: z.object({
      titre: z.string().min(1),
      entrees: z
        .array(
          z.object({
            chiffre: z.string().min(1),
            libelle: z.string().min(1),
            detail: z.string().min(1).nullable(),
          }),
        )
        .min(1),
    }),
    apercu_realisations: z.object({
      titre: z.string().min(1),
      lien_libelle: z.string().min(1),
    }),
    demarche: z.object({
      titre: z.string().min(1),
      paragraphes: z.array(z.string().min(1)).min(1),
      lien_libelle: z.string().min(1),
    }),
    cta: z.object({
      titre: z.string().min(1),
      paragraphes: z.array(z.string().min(1)).min(1),
      email: email(),
      cta_libelle: z.string().min(1),
      cta_lien: lien(),
    }),
  })
  .strict()

export type Accueil = z.infer<typeof accueilSchema>

/* ------------------------------- À propos ------------------------------- */

export const aProposSchema = z
  .object({
    titre: z.string().min(1),
    sous_titre: z.string().min(1),
    photo: z.string().min(1).nullable(),
    ce_que_je_fais: sectionTexteSchema,
    comment_je_travaille: z.object({
      titre: z.string().min(1),
      blocs: z.array(blocSchema).min(1),
    }),
    parcours: z.object({
      titre: z.string().min(1),
      items: z.array(z.string().min(1)).min(1),
    }),
    competences: z.object({
      titre: z.string().min(1),
      blocs: z.array(blocSchema).min(1),
    }),
    ce_que_je_ne_fais_pas: sectionTexteSchema,
    cta: z.object({
      texte: z.string().min(1),
      liens: z.array(lienNommeSchema).min(1),
    }),
  })
  .strict()

export type APropos = z.infer<typeof aProposSchema>

/* -------------------------------- Contact ------------------------------- */

const champContactSchema = z
  .object({
    nom: z.string().regex(SLUG, "nom de champ en kebab-case"),
    libelle: z.string().min(1),
    type: z.enum(["texte", "email", "liste", "zone_texte"]),
    requis: z.boolean(),
    options: z.array(z.string().min(1)).min(1).nullable(),
  })
  .refine((c) => (c.type === "liste") === (c.options !== null), {
    message: "`options` doit être renseigné pour le type `liste` (et null sinon)",
    path: ["options"],
  })

export const contactSchema = z
  .object({
    titre: z.string().min(1),
    intro: z.array(z.string().min(1)).min(1),
    email: email(),
    liens: z.array(lienNommeSchema),
    formulaire: z.object({
      champs: z.array(champContactSchema).min(1),
      bouton: z.string().min(1),
      message_repli: z.string().min(1),
    }),
  })
  .strict()

export type Contact = z.infer<typeof contactSchema>
export type ChampContact = z.infer<typeof champContactSchema>

/* --------------------------- Métadonnées ------------------------------ */

/**
 * Titres et descriptions de `<meta>` / Open Graph. Vivent ici, pas dans les
 * composants de page (`content/pages/meta.mdx`). `titre: null` → le nom du site
 * seul (utile pour l'accueil).
 */
const pageMetaSchema = z.object({
  titre: z.string().min(1).nullable(),
  description: z.string().min(1),
})

export const metaSchema = z
  .object({
    site: z.object({
      nom: z.string().min(1),
      description: z.string().min(1),
    }),
    pages: z.object({
      accueil: pageMetaSchema,
      offres: pageMetaSchema,
      realisations: pageMetaSchema,
      a_propos: pageMetaSchema,
      contact: pageMetaSchema,
    }),
  })
  .strict()

export type Meta = z.infer<typeof metaSchema>
export type PageMeta = z.infer<typeof pageMetaSchema>
