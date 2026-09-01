import { fileURLToPath } from "node:url"
import { describe, it, expect, vi } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"

// next/link et next/image ne tournent pas hors du runtime Next : on les réduit
// à leurs balises HTML, ce qui suffit pour vérifier ce qui nous intéresse ici
// (la présence des cartes dans le rendu initial).
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element -- simple stub de test
  default: ({ alt = "", ...rest }: { alt?: string }) => <img alt={alt} {...rest} />,
}))

const { RealisationsBrowser } = await import("@/components/realisations-browser")
const { getRealisationsPubliees } = await import("@/lib/realisations")

const FIXTURES = fileURLToPath(new URL("../lib/__fixtures__/realisations", import.meta.url))

describe("RealisationsBrowser — dégradation propre du filtre client", () => {
  const publiees = getRealisationsPubliees(FIXTURES).map((r) => r.frontmatter)
  const html = renderToStaticMarkup(<RealisationsBrowser realisations={publiees} />)

  it("plusieurs fiches publiées dans les fixtures (sinon le test ne prouve rien)", () => {
    expect(publiees.length).toBeGreaterThan(1)
  })

  it("le rendu initial (SSG, état filtre = « tout ») contient TOUTES les fiches publiées", () => {
    for (const r of publiees) {
      expect(html).toContain(`/realisations/${r.slug}`)
    }
  })

  it("n'est jamais une liste vide tant qu'il y a des fiches", () => {
    expect(html).toContain("<li")
  })

  it("les libellés de filtre proviennent de lib/taxonomie.ts (aucune recopie)", () => {
    // beta est de type `decisionnel` → libellé canonique attendu
    expect(html).toContain("Pilotage et décisionnel")
  })
})
