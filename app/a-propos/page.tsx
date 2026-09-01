import type { Metadata } from "next"
import { getAPropos } from "@/lib/contenu-pages"

export const metadata: Metadata = {
  title: "À propos",
  description: "TODO — description de la page à propos.",
}

export default function AProposPage() {
  const a = getAPropos()

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">{a.titre}</h1>

      <div className="mt-4 space-y-3 text-base leading-relaxed text-foreground/90">
        {a.intro.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      {a.sections.map((s) => (
        <section key={s.titre} className="mt-10">
          <h2 className="text-lg font-semibold tracking-tight">{s.titre}</h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
            {s.paragraphes.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
