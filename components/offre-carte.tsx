import Link from "next/link"
import type { Offre } from "@/lib/offre-frontmatter"
import type { DejaFaitAffiche } from "@/lib/offres"
import { Lien } from "@/components/lien"

/**
 * Gabarit d'offre — UN composant, rendu trois fois avec trois jeux de données
 * (`app/offres/page.tsx`). Aucun contenu ici : titre, puces, délai, budget,
 * note, exemples et appel à l'action viennent tous de `offre`
 * (content/offres/<slug>.mdx).
 *
 * `dejaFait` est déjà résolu par l'appelant (`resolveDejaFait`) : chaque texte
 * s'affiche toujours ; `lien` vaut `null` si la réalisation référencée est
 * absente ou en brouillon → texte seul, sans lien mort.
 */
export function OffreCarte({ offre, dejaFait }: { offre: Offre; dejaFait: DejaFaitAffiche[] }) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold tracking-tight">{offre.titre}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{offre.accroche}</p>

      <Bloc titre="Vous êtes concerné si…">
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

      {offre.note && (
        <p className="mt-4 rounded-md border border-border bg-muted/50 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
          {offre.note}
        </p>
      )}

      {dejaFait.length > 0 && (
        <Bloc titre="Déjà fait">
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            {dejaFait.map((d) => (
              <li key={d.texte}>
                {d.texte}
                {d.lien && (
                  <>
                    {" "}
                    <Link
                      href={d.lien}
                      className="whitespace-nowrap underline underline-offset-2 hover:text-brand"
                    >
                      Voir la réalisation →
                    </Link>
                  </>
                )}
              </li>
            ))}
          </ul>
        </Bloc>
      )}

      <div className="mt-auto pt-6">
        <Lien
          href={offre.cta_lien}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          {offre.cta_libelle}
        </Lien>
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
