import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getRealisation, getSlugsPublies } from "@/lib/realisations"
import { TYPES, CADRES } from "@/lib/taxonomie"
import { ContenuMdx } from "@/components/contenu-mdx"
import { formatMoisAnnee, formatPeriode } from "@/lib/affichage"

type Params = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getSlugsPublies().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const fiche = getRealisation(slug)
  if (!fiche) return {}
  return { title: fiche.frontmatter.titre, description: fiche.frontmatter.resume }
}

export default async function FichePage({ params }: Params) {
  const { slug } = await params
  const fiche = getRealisation(slug)
  if (!fiche) notFound()

  const fm = fiche.frontmatter

  // Une seule ligne par métadonnée réellement présente : pas de libellé orphelin.
  const meta: { label: string; valeur: string }[] = [
    { label: "Type", valeur: TYPES[fm.type] },
    { label: "Cadre", valeur: CADRES[fm.cadre] },
    { label: "Secteur", valeur: fm.secteur },
    { label: "Client", valeur: fm.client },
    { label: "Rôle", valeur: fm.role },
    { label: "Période", valeur: formatPeriode(fm.debut, fm.fin) },
    ...(fm.production_depuis
      ? [{ label: "En production", valeur: `depuis ${formatMoisAnnee(fm.production_depuis)}` }]
      : []),
    { label: "Utilisateurs", valeur: fm.utilisateurs },
  ]

  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{TYPES[fm.type]}</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">{fm.titre}</h1>
      <p className="mt-3 text-base leading-relaxed text-foreground/90">{fm.resume}</p>

      {fm.image_couverture && (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl bg-muted">
          <Image
            src={fm.image_couverture}
            alt={fm.alt_couverture ?? ""}
            fill
            sizes="(max-width: 768px) 100vw, 42rem"
            className="object-cover"
            priority
          />
        </div>
      )}

      <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 border-y border-border py-4 text-sm">
        {meta.map(({ label, valeur }) => (
          <div key={label} className="contents">
            <dt className="text-muted-foreground">{label}</dt>
            <dd>{valeur}</dd>
          </div>
        ))}
      </dl>

      {fm.technologies.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {fm.technologies.map((t) => (
            <span
              key={t}
              className="inline-flex rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {fm.lien_demo && (
        <p className="mt-4 text-sm">
          <a
            href={fm.lien_demo}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-brand"
          >
            Voir la démonstration
          </a>
        </p>
      )}

      <div className="mt-10">
        <ContenuMdx source={fiche.corps} />
      </div>
    </article>
  )
}
