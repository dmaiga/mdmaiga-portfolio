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

const boutonPrincipal =
  "inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
const boutonSecondaire =
  "inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"

export default function AccueilPage() {
  const a = getAccueil()
  // Lus depuis les mêmes fonctions que /offres et /realisations — jamais recopiés.
  const offres = getOffresPubliees()
  const misesEnAvant = getRealisationsMisesEnAvant()

  return (
    <div className="mx-auto max-w-5xl space-y-20 px-4 py-12">
      {/* Hero */}
      <section>
        <h1 className="max-w-3xl text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">
          {a.hero.titre}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {a.hero.sous_titre}
        </p>
        {a.hero.disponibilite && (
          <p className="mt-4 inline-flex rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            {a.hero.disponibilite}
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <Lien href={a.hero.cta_principal.href} className={boutonPrincipal}>
            {a.hero.cta_principal.libelle}
          </Lien>
          <Lien href={a.hero.cta_secondaire.href} className={boutonSecondaire}>
            {a.hero.cta_secondaire.libelle}
          </Lien>
        </div>
      </section>

      {/* Le problème que je traite */}
      <section>
        <h2 className="text-xl font-semibold tracking-tight">{a.probleme.titre}</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {a.probleme.blocs.map((b) => (
            <div key={b.titre}>
              <p className="text-sm font-semibold">{b.titre}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.texte}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Aperçu des offres */}
      {offres.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold tracking-tight">{a.apercu_offres.titre}</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{a.apercu_offres.texte}</p>
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
              {a.apercu_offres.lien_libelle}
            </Link>
          </p>
        </section>
      )}

      {/* Preuve chiffrée */}
      <section>
        <h2 className="text-xl font-semibold tracking-tight">{a.preuve.titre}</h2>
        <dl className="mt-6 grid gap-6 sm:grid-cols-2">
          {a.preuve.entrees.map((e) => (
            <div key={e.libelle}>
              <dt className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold tracking-tight">{e.chiffre}</span>
                <span className="text-sm text-muted-foreground">{e.libelle}</span>
              </dt>
              {e.detail && (
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{e.detail}</dd>
              )}
            </div>
          ))}
        </dl>
      </section>

      {/* Réalisations mises en avant — le bloc disparaît s'il n'y en a aucune */}
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
              {a.apercu_realisations.lien_libelle}
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
        <p className="mt-4 text-sm">
          <Link href="/a-propos" className="underline underline-offset-2 hover:text-brand">
            {a.demarche.lien_libelle}
          </Link>
        </p>
      </section>

      {/* Appel à l'action final */}
      <section className="border-t border-border pt-10">
        <h2 className="text-xl font-semibold tracking-tight">{a.cta.titre}</h2>
        <div className="mt-3 max-w-2xl space-y-3 text-sm leading-relaxed text-muted-foreground">
          {a.cta.paragraphes.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <p className="mt-3 text-sm">
          <a
            href={`mailto:${a.cta.email}`}
            className="font-medium underline underline-offset-2 hover:text-brand"
          >
            {a.cta.email}
          </a>
        </p>
        <Lien href={a.cta.cta_lien} className={`mt-6 ${boutonPrincipal}`}>
          {a.cta.cta_libelle}
        </Lien>
      </section>
    </div>
  )
}
