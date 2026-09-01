import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

// Alias `@/*` → racine du projet, aligné sur tsconfig.json.
// Résolu à la main pour ne pas ajouter de dépendance (vite-tsconfig-paths).
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
})
