import type { BlocPage } from "@/lib/offre-frontmatter"
import { Lien } from "@/components/lien"

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
            <Lien
              href={`mailto:${bloc.email}`}
              className="font-medium underline underline-offset-2 hover:text-brand"
            >
              {bloc.email}
            </Lien>
          )}
          {bloc.liens.map((l) => (
            <Lien
              key={l.href}
              href={l.href}
              className="font-medium underline underline-offset-2 hover:text-brand"
            >
              {l.libelle}
            </Lien>
          ))}
        </div>
      )}
    </section>
  )
}
