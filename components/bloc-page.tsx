import Link from "next/link"
import type { BlocPage } from "@/lib/offre-frontmatter"
import { estLienExterne } from "@/lib/affichage"

/**
 * Bloc de page à emplacement fixe : en-tête de /offres, « Mission longue »,
 * bandeau de fin. Un seul composant, trois usages — `tarif`, `email` et `liens`
 * sont facultatifs et rendus seulement s'ils sont renseignés.
 *
 * `niveauTitre` : l'en-tête porte le `<h1>` de la page ; les autres, un `<h2>`.
 */
export function BlocPageVue({
  bloc,
  niveauTitre = "h2",
}: {
  bloc: BlocPage
  niveauTitre?: "h1" | "h2"
}) {
  const Titre = niveauTitre
  const aMeta = bloc.tarif !== null || bloc.email !== null || bloc.liens.length > 0

  return (
    <section>
      <Titre
        className={
          niveauTitre === "h1"
            ? "text-2xl font-semibold tracking-tight"
            : "text-lg font-semibold tracking-tight"
        }
      >
        {bloc.titre}
      </Titre>

      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
        {bloc.paragraphes.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      {aMeta && (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          {bloc.tarif && (
            <span>
              <span className="text-muted-foreground">Tarif</span> {bloc.tarif}
            </span>
          )}
          {bloc.email && (
            <a
              href={`mailto:${bloc.email}`}
              className="font-medium underline underline-offset-2 hover:text-brand"
            >
              {bloc.email}
            </a>
          )}
          {bloc.liens.map((l) =>
            estLienExterne(l.href) ? (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-2 hover:text-brand"
              >
                {l.libelle}
              </a>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                className="font-medium underline underline-offset-2 hover:text-brand"
              >
                {l.libelle}
              </Link>
            ),
          )}
        </div>
      )}
    </section>
  )
}
