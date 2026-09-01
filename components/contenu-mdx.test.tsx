import { describe, it, expect } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { compileMDX } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import { Approfondir } from "@/components/approfondir"

describe("chaîne MDX — <Approfondir> écrit dans une fiche", () => {
  it("mappe la balise MDX sur le composant, replié, contenu présent dans le HTML", async () => {
    const source = [
      "## Aujourd'hui",
      "",
      "Texte de la couche visible.",
      "",
      "<Approfondir>",
      "",
      "### Technique",
      "",
      "terme-cache-abc123 propre à la couche approfondie.",
      "",
      "</Approfondir>",
      "",
    ].join("\n")

    const { content } = await compileMDX({
      source,
      components: { Approfondir },
      options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
    })
    const html = renderToStaticMarkup(content)

    expect(html).toContain("<details")
    expect(html).not.toMatch(/<details[^>]*\sopen/)
    expect(html).toContain("terme-cache-abc123")
  })
})
