import type { NextConfig } from "next"

// Rendu statique par défaut (pas de `output: 'export'`) : toutes les pages sont
// générées au build via `generateStaticParams`, sans appel réseau ni runtime
// serveur — voir docs/DECISIONS.md (ADR-003). Le mode par défaut conserve
// l'optimisation `next/image`, que l'export statique désactiverait.
const nextConfig: NextConfig = {
  // Redirections permanentes depuis l'ancienne taxonomie /projects.
  async redirects() {
    return [
      { source: "/projects", destination: "/realisations", permanent: true },
      { source: "/projects/:slug", destination: "/realisations/:slug", permanent: true },
    ]
  },
}

export default nextConfig
