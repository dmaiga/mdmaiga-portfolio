import type { Metadata } from "next"
import { getOffresPubliees, getBlocPage, resolveDejaFait } from "@/lib/offres"
import { OffreCarte } from "@/components/offre-carte"
import { BlocPageVue } from "@/components/bloc-page"

export const metadata: Metadata = {
  title: "Offres",
  description: "TODO — description de la page offres.",
}

export default function OffresPage() {
  const offres = getOffresPubliees()
  const entete = getBlocPage("entete")
  const missionLongue = getBlocPage("mission-longue-renfort-equipe")
  const bandeauFin = getBlocPage("bandeau-fin")

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {entete ? (
        <BlocPageVue bloc={entete} niveauTitre="h1" />
      ) : (
        <h1 className="text-2xl font-semibold tracking-tight">Offres</h1>
      )}

      {offres.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          Les offres sont en cours de publication.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {offres.map((offre) => (
            <OffreCarte
              key={offre.slug}
              offre={offre}
              dejaFait={resolveDejaFait(offre.deja_fait)}
            />
          ))}
        </div>
      )}

      {missionLongue && (
        <div className="mt-16 rounded-xl border border-border bg-muted/30 p-6">
          <BlocPageVue bloc={missionLongue} />
        </div>
      )}

      {bandeauFin && (
        <div className="mt-12 border-t border-border pt-8">
          <BlocPageVue bloc={bandeauFin} />
        </div>
      )}
    </div>
  )
}
