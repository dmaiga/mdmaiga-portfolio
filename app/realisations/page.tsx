import type { Metadata } from "next"
import { getRealisationsPubliees } from "@/lib/realisations"
import { RealisationsBrowser } from "@/components/realisations-browser"
import { metadonneesPage } from "@/lib/metadonnees"

export function generateMetadata(): Metadata {
  return metadonneesPage("realisations")
}

export default function RealisationsPage() {
  // Brouillons exclus par la chaîne de contenu (ADR-005).
  const realisations = getRealisationsPubliees().map((r) => r.frontmatter)

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Réalisations</h1>

      {realisations.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Les réalisations sont en cours de publication.
        </p>
      ) : (
        <RealisationsBrowser realisations={realisations} />
      )}
    </div>
  )
}
