# STACK.md

## Objectif

Choix techniques de référence du projet. Toute nouvelle dépendance ou technologie
se justifie **explicitement**. Par défaut : simplicité, pas d'abstraction prématurée.

Décisions structurantes et leurs compromis : voir `docs/DECISIONS.md` (non répété ici).
Structure technique et modèle de contenu : voir `docs/ARCHITECTURE.md`.

---

## Périmètre

**Frontend uniquement.** Pas de backend, pas de base de données, pas d'ORM, pas d'API.
Le contenu est en fichiers MDX versionnés. Le site est généré statiquement et servi
par Vercel.

---

## Socle

* **Next.js** (App Router) — version alignée sur l'installation (`package.json`).
* **React** / **React DOM**.
* **TypeScript** — obligatoire. Pas de JavaScript applicatif sauf exception demandée.
* **Tailwind CSS v4** (`@tailwindcss/postcss`).
* **ESLint** (`eslint-config-next`).

## UI

Chaque dépendance est installée **au moment où elle sert**, jamais en avance.

Installées :

* **clsx**, **tailwind-merge** — fonction `cn()` (`lib/utils.ts`).

Prévues, encore non installées :

* **next-themes** — thème clair/sombre sans flash ni bug d'hydratation (à l'arrivée du bascule de thème).
* **class-variance-authority** — variantes des composants `button` / `badge`.
* **lucide-react** — icônes.
* **tw-animate-css** — utilitaires d'animation (phase 2).

Composants `button` / `badge` : **code possédé**, à copier de l'ancien dépôt, pas une dépendance.

## Chaîne de contenu

* **gray-matter** — extraction du frontmatter.
* **zod** (v3) — validation stricte (`.strict()`) du frontmatter ; **échec de build** si invalide.
* **next-mdx-remote** (`/rsc`) — compilation + rendu du MDX au build.
* **remark-gfm** — tableaux / listes GFM dans le MDX.
* Pas de coloration syntaxique (`shiki`, `rehype-pretty-code`) : les fiches ne contiennent aucun bloc de code.

## Polices

* **next/font/local** — fichiers `.woff2` versionnés dans `public/fonts/`.
  Jamais `next/font/google` (télécharge au build → dépendance réseau).

## Formulaire de contact

* Service tiers (**Web3Forms** ou **Formspree**), clé publique en variable d'environnement.
  Requête uniquement à la soumission. Voir `docs/DECISIONS.md` ADR-008.

## Tests

* **Vitest** (`environment: node`, `renderToStaticMarkup` pour le rendu). Périmètre **resserré** :
  1. **filtre `brouillon`** — garde-fou central : une fiche brouillon n'apparaît ni dans
     l'index, ni sur l'accueil, ni dans le sitemap, ni comme route générée ;
  2. validation du schéma de frontmatter (zod, schéma strict, `slug` == nom de fichier) ;
  3. dégradation du filtre d'index (le HTML statique liste toutes les fiches) ;
  4. `<Approfondir>` replié par défaut et contenu présent dans le HTML ;
  5. helpers d'affichage des champs optionnels (`lib/affichage.ts`).
* Pas de tests au-delà : pas de rendu pixel, pas de e2e.

## Intégration continue

* GitHub Actions, un seul workflow : `lint` + `typecheck` + `build`.
* Déploiement délégué à l'intégration Vercel (hors workflow).

## Déploiement

* **Vercel.** Rendu statique par défaut de Next (pas de `output: 'export'` — ADR-003).
* Pas de `basePath`, pas de `trailingSlash`.

---

## Ce qu'il faut éviter

* Backend, base de données, ORM, route serveur, server action.
* Appel réseau au build ou au runtime (données, polices, polices d'icônes distantes).
* Gestionnaires d'état (Redux, MobX, Zustand, Recoil) — `useState` / Context suffisent.
* React Query, SWR — aucun *data fetching* à orchestrer.
* Paquet `shadcn` en dépendance runtime (CLI de scaffolding — ADR-009).
* `contentlayer`, `velite` — couche de génération implicite non souhaitée (ADR-004).
* CSS-in-JS lourd, `@next/mdx`, coloration syntaxique (`shiki`, `rehype-pretty-code`).
* Dépendances inutiles, abstractions prématurées.

---

## Next 16 — mise en garde

Cette version de Next comporte des ruptures d'API par rapport aux connaissances
usuelles. Pour toute API dont la certitude n'est pas totale, consulter les guides
présents dans `node_modules/next/dist/docs/` plutôt que se fier à la mémoire, et
signaler à l'auteur les écarts rencontrés.
