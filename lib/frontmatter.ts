import { z } from "zod"
import { TYPES, CADRES, type TypeRealisation, type CadreRealisation } from "@/lib/taxonomie"

/**
 * Schéma strict du frontmatter d'une fiche `content/realisations/<slug>.mdx`.
 *
 * `.strict()` : toute clé inconnue est une erreur — on ne laisse pas passer un
 * champ mal orthographié qui serait silencieusement ignoré.
 *
 * Une fiche dont le frontmatter ne valide pas fait échouer `npm test` (CI) et,
 * dès qu'une page la consomme, `next build`. C'est voulu.
 */

const MOIS_ANNEE = /^\d{4}-(0[1-9]|1[0-2])$/
const moisAnnee = z
  .string({ message: "date attendue sous forme de chaîne AAAA-MM" })
  .regex(MOIS_ANNEE, "format attendu : AAAA-MM (ex. 2026-04)")

const typeKeys = Object.keys(TYPES) as [TypeRealisation, ...TypeRealisation[]]
const cadreKeys = Object.keys(CADRES) as [CadreRealisation, ...CadreRealisation[]]

export const frontmatterSchema = z
  .object({
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug en kebab-case (a-z, 0-9, tirets)"),
    titre: z.string().min(1),
    resume: z.string().min(1),
    type: z.enum(typeKeys),
    cadre: z.enum(cadreKeys),
    secteur: z.string().min(1),
    client: z.string().min(1),
    client_anonymise: z.boolean(),
    role: z.string().min(1),
    debut: moisAnnee,
    production_depuis: moisAnnee.nullable(),
    fin: moisAnnee.nullable(),
    utilisateurs: z.string().min(1),
    // Peut être vide : plusieurs fiches à venir n'exposent aucune techno.
    technologies: z.array(z.string().min(1)),
    mis_en_avant: z.boolean(),
    brouillon: z.boolean(),
    ordre: z.number().int(),
    lien_demo: z
      .string()
      .min(1)
      .refine((v) => URL.canParse(v), "URL absolue attendue")
      .nullable(),
    image_couverture: z.string().min(1).nullable(),
  })
  .strict()

export type Frontmatter = z.infer<typeof frontmatterSchema>
