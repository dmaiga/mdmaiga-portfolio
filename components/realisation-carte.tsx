import Link from "next/link"
import Image from "next/image"
import type { Frontmatter } from "@/lib/frontmatter"
import { TYPES } from "@/lib/taxonomie"
import { annee, technologiesAffichees } from "@/lib/affichage"

/**
 * Carte de l'index. Rend correctement quels que soient les champs optionnels :
 *  - `image_couverture: null` → aucune image, pas de cadre vide ;
 *  - `technologies: []`       → aucun bloc technologies.
 */
export function RealisationCarte({ realisation: r }: { realisation: Frontmatter }) {
  const { visibles, reste } = technologiesAffichees(r.technologies, 4)

  return (
    <Link
      href={`/realisations/${r.slug}`}
      className="group flex h-full flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-brand/40"
    >
      {r.image_couverture && (
        <div className="relative mb-3 aspect-[16/9] overflow-hidden rounded-lg bg-muted">
          <Image
            src={r.image_couverture}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
          {TYPES[r.type]}
        </span>
        <span className="shrink-0 text-xs text-muted-foreground">{annee(r.debut)}</span>
      </div>

      <h2 className="mt-3 text-sm font-semibold leading-snug transition-colors group-hover:text-brand">
        {r.titre}
      </h2>
      <p className="mt-1 text-xs font-medium text-foreground/70">{r.role}</p>
      <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
        {r.resume}
      </p>

      {visibles.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1 pt-4">
          {visibles.map((t) => (
            <span
              key={t}
              className="inline-flex rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
            >
              {t}
            </span>
          ))}
          {reste > 0 && (
            <span className="self-center text-xs text-muted-foreground">+{reste}</span>
          )}
        </div>
      )}
    </Link>
  )
}
