import { readFileSync } from "node:fs"
import { join } from "node:path"
import matter from "gray-matter"
import type { ZodType } from "zod"
import {
  accueilSchema,
  aProposSchema,
  contactSchema,
  type Accueil,
  type APropos,
  type Contact,
} from "@/lib/pages-frontmatter"

/**
 * Lecture du contenu éditorial des pages fixes. Une fonction par page ; le
 * paramètre `dossier` est un point d'entrée de test (fixtures).
 */

const DOSSIER_PAGES = join(process.cwd(), "content", "pages")

function lirePage<T>(nomFichier: string, schema: ZodType<T>, dossier: string): T {
  const { data } = matter(readFileSync(join(dossier, nomFichier), "utf8"))
  const parse = schema.safeParse(data)
  if (!parse.success) {
    const details = parse.error.issues
      .map((i) => `  - ${i.path.join(".") || "(racine)"} : ${i.message}`)
      .join("\n")
    throw new Error(`Frontmatter invalide dans content/pages/${nomFichier} :\n${details}`)
  }
  return parse.data
}

export function getAccueil(dossier: string = DOSSIER_PAGES): Accueil {
  return lirePage("accueil.mdx", accueilSchema, dossier)
}

export function getAPropos(dossier: string = DOSSIER_PAGES): APropos {
  return lirePage("a-propos.mdx", aProposSchema, dossier)
}

export function getContact(dossier: string = DOSSIER_PAGES): Contact {
  return lirePage("contact.mdx", contactSchema, dossier)
}
