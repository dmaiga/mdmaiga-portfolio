import type { Metadata } from "next"
import Image from "next/image"
import { getAPropos } from "@/lib/contenu-pages"
import { Lien } from "@/components/lien"
import type { Bloc } from "@/lib/schema-commun"

export const metadata: Metadata = {
  title: "À propos",
  description: "TODO — description de la page à propos.",
}

function SectionBlocs({ titre, blocs }: { titre: string; blocs: Bloc[] }) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold tracking-tight">{titre}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
        {blocs.map((b) => (
          <p key={b.titre}>
            <span className="font-semibold text-foreground">{b.titre}</span> {b.texte}
          </p>
        ))}
      </div>
    </section>
  )
}

function SectionProse({
  titre,
  paragraphes,
}: {
  titre: string
  paragraphes: string[]
}) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold tracking-tight">{titre}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
        {paragraphes.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </section>
  )
}

export default function AProposPage() {
  const a = getAPropos()

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="flex flex-wrap items-center gap-4">
        {a.photo && (
          <Image
            src={a.photo}
            alt={a.titre}
            width={80}
            height={80}
            className="rounded-full object-cover"
          />
        )}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{a.titre}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{a.sous_titre}</p>
        </div>
      </div>

      <SectionProse
        titre={a.ce_que_je_fais.titre}
        paragraphes={a.ce_que_je_fais.paragraphes}
      />
      <SectionBlocs
        titre={a.comment_je_travaille.titre}
        blocs={a.comment_je_travaille.blocs}
      />

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">{a.parcours.titre}</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          {a.parcours.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <SectionBlocs titre={a.competences.titre} blocs={a.competences.blocs} />
      <SectionProse
        titre={a.ce_que_je_ne_fais_pas.titre}
        paragraphes={a.ce_que_je_ne_fais_pas.paragraphes}
      />

      <section className="mt-12 border-t border-border pt-8">
        <p className="text-sm">{a.cta.texte}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {a.cta.liens.map((l) => (
            <Lien
              key={l.href}
              href={l.href}
              className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              {l.libelle}
            </Lien>
          ))}
        </div>
      </section>
    </div>
  )
}
