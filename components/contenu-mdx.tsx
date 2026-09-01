import type { ComponentPropsWithoutRef } from "react"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import { Approfondir } from "@/components/approfondir"

/**
 * Rendu du corps MDX d'une fiche. Compilé au build (la page appelante est
 * générée statiquement via generateStaticParams) — aucun runtime serveur.
 *
 * Les fiches ne contiennent aucun bloc de code : pas de coloration syntaxique.
 * `remark-gfm` couvre tableaux et listes.
 */

type Props<T extends keyof React.JSX.IntrinsicElements> = ComponentPropsWithoutRef<T>

const composants = {
  Approfondir,
  h2: (p: Props<"h2">) => <h2 className="mt-10 text-lg font-semibold tracking-tight" {...p} />,
  h3: (p: Props<"h3">) => <h3 className="mt-6 text-base font-semibold" {...p} />,
  p: (p: Props<"p">) => <p className="mt-4 leading-relaxed text-foreground/90" {...p} />,
  ul: (p: Props<"ul">) => <ul className="mt-4 list-disc space-y-1 pl-5" {...p} />,
  ol: (p: Props<"ol">) => <ol className="mt-4 list-decimal space-y-1 pl-5" {...p} />,
  a: (p: Props<"a">) => (
    <a className="underline underline-offset-2 hover:text-brand" {...p} />
  ),
  table: (p: Props<"table">) => (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...p} />
    </div>
  ),
  th: (p: Props<"th">) => (
    <th className="border border-border px-2 py-1 text-left font-medium" {...p} />
  ),
  td: (p: Props<"td">) => <td className="border border-border px-2 py-1" {...p} />,
}

export function ContenuMdx({ source }: { source: string }) {
  return (
    <div className="text-sm">
      <MDXRemote
        source={source}
        components={composants}
        options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
      />
    </div>
  )
}
