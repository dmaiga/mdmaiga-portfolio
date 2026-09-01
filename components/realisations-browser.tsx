"use client"

import { useState } from "react"
import type { Frontmatter } from "@/lib/frontmatter"
import { TYPES, TYPES_ORDRE, type TypeRealisation } from "@/lib/taxonomie"
import { RealisationCarte } from "@/components/realisation-carte"
import { cn } from "@/lib/utils"

type Filtre = TypeRealisation | "tout"

/**
 * Filtre de l'index par `type`, côté client.
 *
 * Dégradation : l'état initial est "tout". Ce composant est rendu au build
 * (SSG) avec cet état → le HTML statique contient DÉJÀ toutes les cartes.
 * Sans JavaScript ou avant hydratation, l'utilisateur voit la liste complète ;
 * jamais une liste vide. Le JavaScript n'ajoute que le tri visuel.
 *
 * Libellés : lus depuis lib/taxonomie.ts, aucune recopie.
 */
export function RealisationsBrowser({ realisations }: { realisations: Frontmatter[] }) {
  const [filtre, setFiltre] = useState<Filtre>("tout")

  // Types réellement présents, dans l'ordre canonique — pas de pastille morte.
  const typesPresents = TYPES_ORDRE.filter((t) => realisations.some((r) => r.type === t))
  const pastilles: { cle: Filtre; libelle: string }[] = [
    { cle: "tout", libelle: "Tout" },
    ...typesPresents.map((t) => ({ cle: t, libelle: TYPES[t] })),
  ]

  const affichees =
    filtre === "tout" ? realisations : realisations.filter((r) => r.type === filtre)

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par type">
        {pastilles.map(({ cle, libelle }) => {
          const actif = filtre === cle
          return (
            <button
              key={cle}
              type="button"
              onClick={() => setFiltre(cle)}
              aria-pressed={actif}
              className={cn(
                "rounded-full border border-border px-3 py-1 text-sm transition-colors",
                actif
                  ? "bg-secondary font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {libelle}
            </button>
          )
        })}
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {affichees.map((r) => (
          <li key={r.slug} className="h-full">
            <RealisationCarte realisation={r} />
          </li>
        ))}
      </ul>
    </div>
  )
}
