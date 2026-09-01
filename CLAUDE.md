# CLAUDE.md

## Rôle de ce fichier

**Orchestration pure.** Il dit *où* est la vérité et *comment* travailler — il ne
duplique aucun contenu. En cas d'hésitation entre recopier une info ici ou pointer
vers son fichier : **pointe**.

---

## Le projet en une ligne

Portfolio **freelance** : Next.js (App Router, TypeScript), génération statique
intégrale, **aucun backend ni base de données**, contenu en fichiers MDX versionnés.
Déploiement Vercel.

---

## Sources de vérité (ne jamais dupliquer — toujours référencer)

| Fichier | Autorité sur |
|---|---|
| `docs/ARCHITECTURE.md` | Structure technique, modèle de contenu, routes, rendu, métadonnées, perf, a11y. |
| `docs/DECISIONS.md` | Journal des décisions (ADR léger) : décision, pourquoi, alternatives écartées. |
| `rules/STACK.md` | Stack officielle, dépendances autorisées / interdites. |
| `rules/ABOUT-ME.md` | Qui est l'auteur, **et la posture d'interaction attendue**. |
| `rules/GIT.md` | Convention de commits. |

---

## État d'avancement

Construction initiale par étapes (brief de bootstrap). Chaque étape se termine par un
**point d'arrêt** : présentation à l'auteur, pas de passage à l'étape suivante sans
validation.

- **Étape 1 — Squelette.** ✅ init projet, structure, config TS + lint, `docs/`.
- **Étape 2 — Chaîne de contenu.** ✅ lecture MDX (`lib/realisations.ts`), schéma zod strict
  (`lib/frontmatter.ts`), taxonomie source unique (`lib/taxonomie.ts`), filtre brouillon + tri,
  fiche modèle `content/realisations/exemple-modele.mdx` (`brouillon: true`), tests Vitest
  (`lib/realisations.test.ts`) — le filtre brouillon est le garde-fou central (ADR-005).
- **Étape 3 — Réalisations.** ✅ index filtrable par `type` (`components/realisations-browser.tsx`,
  filtre client qui dégrade proprement — ADR-012), gabarit de fiche `/realisations/[slug]`
  (`generateStaticParams`, champs optionnels tolérés — ADR-013), `<Approfondir>` en `<details>`
  natif (`components/approfondir.tsx`), rendu MDX via `next-mdx-remote/rsc` + `remark-gfm`
  (ADR-011), système de tokens `globals.css` porté. Tests : dégradation, `<Approfondir>`
  replié + indexable, chaîne MDX, helpers d'affichage.
- **Étape 4 — Offres.** ✅ gabarit unique `components/offre-carte.tsx` rendu trois fois
  (`app/offres/page.tsx`), contenu en frontmatter seul (`content/offres/`, ADR-014) —
  aucun prix en dur, `content/offres-complementaires/` pour les deux blocs de bas de
  page, bloc « Déjà fait » résolu par slug via `getRealisation` (ADR-015, jamais de
  lien mort — vérifié par build de contrôle). Scaffolding `offre-1/2/3` + les deux
  compléments en `brouillon: true`, `TODO —`, en attente du contenu de l'auteur.
- Étape 5 — Accueil, à propos, contact.
- Étape 6 — Finition (métadonnées, sitemap, redirections, a11y, poids des pages).

---

## Règles permanentes

1. **N'invente aucun contenu éditorial.** Les textes des projets, de l'accueil et des
   offres sont fournis par l'auteur. Là où un texte manque, mettre un contenu de
   remplacement explicitement marqué `TODO —` (impossible à publier par inadvertance).
2. **Procède par étapes, avec un point d'arrêt à la fin de chacune.**
3. **Aucune dépendance ajoutée sans justification.** En cas de besoin, demander d'abord.
4. **Si une information manque, arrête-toi et demande.** Ne pas combler par une
   supposition plausible.
5. **Posture d'interaction : voir `rules/ABOUT-ME.md`.** Non complaisant, nuancé,
   challenge les hypothèses, présente les compromis. Pas de validation réflexe.
6. **Commits : voir `rules/GIT.md`.** Français, orientés métier, regroupés par
   fonctionnalité (jamais par fichier). Un commit = une évolution cohérente.
7. **Stack : voir `rules/STACK.md`.** Par défaut : simplicité, pas d'abstraction
   prématurée.
8. **Anti-duplication.** Une info qui existe déjà se référence, ne se recopie pas.
   Toute divergence entre deux fichiers est un bug de documentation.
9. **Décisions structurantes** consignées dans `docs/DECISIONS.md`, format ADR court :
   contexte, décision, conséquences.

---

## Next 16

Cette version comporte des ruptures d'API. Pour toute API incertaine, consulter
`node_modules/next/dist/docs/` plutôt que se fier à la mémoire, et signaler les écarts.

---

## Dépôt de référence (lecture seule)

L'ancien portfolio vit dans `../portfolio/`. Il alimente le site **en production** :
**interdiction d'y écrire**. Il peut être lu pour copier les fichiers d'interface et
de conventions listés dans le brief de bootstrap.
