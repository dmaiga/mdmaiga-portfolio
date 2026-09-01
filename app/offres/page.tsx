import type { Metadata } from "next"
import { getOffresPubliees, getComplementsPublies, resolveDejaFait } from "@/lib/offres"
import { OffreCarte } from "@/components/offre-carte"
import { BlocComplementaire } from "@/components/bloc-complementaire"

export const metadata: Metadata = {
  title: "Offres",
  description: "TODO — description de la page offres.",
}

export default function OffresPage() {
  const offres = getOffresPubliees()
  const complements = getComplementsPublies()

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Offres</h1>

      {offres.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Les offres sont en cours de publication.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {offres.map((offre) => (
            <OffreCarte
              key={offre.slug}
              offre={offre}
              dejaFait={resolveDejaFait(offre.deja_fait_slug)}
            />
          ))}
        </div>
      )}

      {complements.length > 0 && (
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {complements.map((bloc) => (
            <BlocComplementaire key={bloc.slug} bloc={bloc} />
          ))}
        </div>
      )}
    </div>
  )
}
