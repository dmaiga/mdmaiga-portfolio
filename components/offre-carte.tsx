import Link from "next/link"
import type { Offre } from "@/lib/offre-frontmatter"
import type { DejaFait } from "@/lib/offres"
import { estLienExterne } from "@/lib/affichage"

/**
 * Gabarit d'offre — UN composant, rendu trois fois avec trois jeux de données
 * (`app/offres/page.tsx`). Aucun contenu ici : titre, puces, délai, budget,
 * appel à l'action viennent tous de `offre` (content/offres/<slug>.mdx).
 *
 * `dejaFait` est déjà résolu par l'appelant (`resolveDejaFait`) : `null` quand
 * il n'y a pas de référence OU quand la réalisation référencée est en
 * brouillon/absente — dans les deux cas le bloc ne s'affiche pas, sans lien
 * mort ni erreur.
 */
export function OffreCarte({ offre, dejaFait }: { offre: Offre; dejaFait: DejaFait | null }) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold tracking-tight">{offre.titre}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{offre.accroche}</p>

      <Bloc titre="Vous êtes concerné·e si…">
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          {offre.concerne_si.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Bloc>

      <Bloc titre="Ce que vous obtenez">
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          {offre.obtenez.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Bloc>

      <Bloc titre="Comment ça se passe">
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
          {offre.etapes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </Bloc>

      <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 border-t border-border pt-4 text-sm">
        <dt className="text-muted-foreground">Délai</dt>
        <dd>{offre.delai}</dd>
        <dt className="text-muted-foreground">Budget</dt>
        <dd>{offre.budget}</dd>
      </dl>

      {dejaFait && (
        <p className="mt-4 text-sm">
          <span className="text-muted-foreground">Déjà fait : </span>
          <Link
            href={`/realisations/${dejaFait.slug}`}
            className="underline underline-offset-2 hover:text-brand"
          >
            {dejaFait.titre}
          </Link>
        </p>
      )}

      <div className="mt-auto pt-6">
        <a
          href={offre.cta_lien}
          {...(estLienExterne(offre.cta_lien)
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          {offre.cta_libelle}
        </a>
      </div>
    </article>
  )
}

function Bloc({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {titre}
      </h3>
      {children}
    </div>
  )
}
