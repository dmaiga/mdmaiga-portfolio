import type { Complement } from "@/lib/offre-frontmatter"
import { estLienExterne } from "@/lib/affichage"

/**
 * Bloc de bas de page (contrôle de paie, mission longue…), distinct des trois
 * offres. `cta_libelle`/`cta_lien` sont facultatifs : pas de bouton si absents.
 */
export function BlocComplementaire({ bloc }: { bloc: Complement }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-base font-semibold tracking-tight">{bloc.titre}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{bloc.texte}</p>
      {bloc.cta_libelle && bloc.cta_lien && (
        <a
          href={bloc.cta_lien}
          {...(estLienExterne(bloc.cta_lien) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="mt-4 inline-flex text-sm font-medium underline underline-offset-2 hover:text-brand"
        >
          {bloc.cta_libelle}
        </a>
      )}
    </div>
  )
}
