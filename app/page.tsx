import type { Metadata } from "next"
import Link from "next/link"
import { getAccueil } from "@/lib/contenu-pages"
import { getOffresPubliees } from "@/lib/offres"
import { getRealisationsMisesEnAvant } from "@/lib/realisations"
import { RealisationCarte } from "@/components/realisation-carte"
import { Lien } from "@/components/lien"

export const metadata: Metadata = {
  description: "TODO — description de l'accueil.",
}

const boutonCta =
  "mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"

export default function AccueilPage() {
  const a = getAccueil()
  // Lus depuis les mêmes fonctions que /offres et /realisations — jamais recopiés.
  const offres = getOffresPubliees()
  const misesEnAvant = getRealisationsMisesEnAvant()

  return (
    <div className="mx-auto max-w-5xl space-y-20 px-4 py-12">
      {/* Hero */}
      <section>
        <h1 className="text-3xl font-semibold tracking-tight">{a.hero.titre}</h1>
        <div className="mt-4 max-w-2xl space-y-3 text-base leading-relaxed text-muted-foreground">
          {a.hero.paragraphes.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <Lien href={a.hero.cta_lien} className={boutonCta}>
          {a.hero.cta_libelle}
        </Lien>
      </section>

      {/* Le problème traité */}
      <section>
        <h2 className="text-xl font-semibold tracking-tight">{a.probleme.titre}</h2>
        <div className="mt-3 max-w-2xl space-y-3 text-sm leading-relaxed text-muted-foreground">
          {a.probleme.paragraphes.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>

      {/* Les trois offres en résumé */}
      {offres.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold tracking-tight">{a.apercu_offres.titre}</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {offres.map((o) => (
              <li key={o.slug}>
                <Link
                  href="/offres"
                  className="flex h-full flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-brand/40"
                >
                  <h3 className="text-sm font-semibold">{o.titre}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{o.accroche}</p>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm">
            <Link href="/offres" className="underline underline-offset-2 hover:text-brand">
              Voir les offres en détail →
            </Link>
          </p>
        </section>
      )}

      {/* Une preuve chiffrée */}
      <section>
        <p className="text-4xl font-semibold tracking-tight">{a.preuve.chiffre}</p>
        <p className="mt-2 text-sm text-muted-foreground">{a.preuve.libelle}</p>
        {a.preuve.detail && (
          <p className="mt-1 text-sm text-muted-foreground">{a.preuve.detail}</p>
        )}
      </section>

      {/* Les réalisations mises en avant — le bloc disparaît s'il n'y en a aucune */}
      {misesEnAvant.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold tracking-tight">
            {a.apercu_realisations.titre}
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {misesEnAvant.map((r) => (
              <li key={r.frontmatter.slug} className="h-full">
                <RealisationCarte realisation={r.frontmatter} />
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm">
            <Link
              href="/realisations"
              className="underline underline-offset-2 hover:text-brand"
            >
              Toutes les réalisations →
            </Link>
          </p>
        </section>
      )}

      {/* La démarche */}
      <section>
        <h2 className="text-xl font-semibold tracking-tight">{a.demarche.titre}</h2>
        <div className="mt-3 max-w-2xl space-y-3 text-sm leading-relaxed text-muted-foreground">
          {a.demarche.paragraphes.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>

      {/* Appel à l'action */}
      <section className="border-t border-border pt-10">
        <h2 className="text-xl font-semibold tracking-tight">{a.cta.titre}</h2>
        <div className="mt-3 max-w-2xl space-y-3 text-sm leading-relaxed text-muted-foreground">
          {a.cta.paragraphes.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <Lien href={a.cta.cta_lien} className={boutonCta}>
          {a.cta.cta_libelle}
        </Lien>
      </section>
    </div>
  )
}
