import { ImageResponse } from "next/og"

/**
 * Image Open Graph générée au build (aucun appel réseau). Design volontairement
 * sobre : fond sombre, nom du site, titre de la page, une phrase, un trait
 * d'accent. Un lien partagé sur LinkedIn ou WhatsApp affiche donc quelque chose
 * de lisible même sans police web (les couleurs sont en dur ici, une image ne
 * lit pas les tokens CSS).
 */

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = "image/png"

function tronquer(texte: string, max: number): string {
  return texte.length <= max ? texte : `${texte.slice(0, max - 1).trimEnd()}…`
}

export function imageOpenGraph(nomSite: string, titre: string, sousTitre: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          backgroundColor: "#12131a",
          color: "#f5f6f8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 30, color: "#9aa4b2" }}>{nomSite}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.12 }}>
            {tronquer(titre, 90)}
          </div>
          <div style={{ fontSize: 27, color: "#c2c8d2", lineHeight: 1.35, marginTop: 28 }}>
            {tronquer(sousTitre, 160)}
          </div>
        </div>
        <div style={{ display: "flex", height: 6, width: 120, backgroundColor: "#5b7cfa" }} />
      </div>
    ),
    OG_SIZE,
  )
}
