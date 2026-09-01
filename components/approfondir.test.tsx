import { describe, it, expect } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { Approfondir } from "@/components/approfondir"

describe("<Approfondir> — couche repliée, contenu indexable", () => {
  const html = renderToStaticMarkup(
    <Approfondir>
      <p>terme-technique-unique-xyz</p>
    </Approfondir>,
  )

  it("s'appuie sur <details>/<summary> natifs (fonctionne sans JavaScript et au clavier)", () => {
    expect(html).toContain("<details")
    expect(html).toContain("<summary")
  })

  it("est replié par défaut : aucun attribut `open`", () => {
    expect(html).not.toMatch(/<details[^>]*\sopen/)
  })

  it("conserve le contenu dans le HTML même replié (indexation, recherche plein texte)", () => {
    expect(html).toContain("terme-technique-unique-xyz")
  })
})
