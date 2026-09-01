# ARCHITECTURE

Autorité sur : structure technique du site, modèle de contenu, contrat des routes,
règles de rendu, métadonnées, performance et accessibilité.
Les *décisions* et leurs compromis vivent dans `docs/DECISIONS.md` (non dupliqués ici).

---

## 1. Vue d'ensemble

- **Next.js (App Router, TypeScript)**, rendu **statique par défaut**, déployé sur **Vercel**.
- **Aucun backend, aucune base de données, aucun appel API** au build ou au runtime.
- Le contenu vit dans des fichiers **MDX versionnés** sous `content/realisations/`,
  `content/offres/` et `content/offres-blocs/`.
- Le build ne dépend d'aucun réseau (données locales, polices auto-hébergées).

## 2. Routes

| Route | Contenu | Génération |
|---|---|---|
| `/` | Accueil | statique |
| `/offres` | En-tête + 3 offres (gabarit répété) + 2 blocs de page | statique |
| `/realisations` | Index filtrable par `type` | statique |
| `/realisations/[slug]` | Fiche de cas, deux couches | `generateStaticParams` (hors brouillons) |
| `/a-propos` | Démarche et parcours | statique |
| `/contact` | Liens directs + formulaire (service tiers) | statique |

**Redirections permanentes** (`next.config.ts`) :
`/projects` → `/realisations`, `/projects/:slug` → `/realisations/:slug`.

## 3. Modèle de contenu

Une réalisation = un fichier `content/realisations/<slug>.mdx`.

### Frontmatter (validé par zod au build — échec de build si invalide)

| Champ | Type | Notes |
|---|---|---|
| `slug` | string | doit correspondre au nom de fichier |
| `titre` | string | |
| `resume` | string | 1–2 phrases, affiché sur les cartes |
| `type` | enum | `plateforme-metier` \| `decisionnel` \| `institutionnel` \| `laboratoire` |
| `cadre` | enum | `salarie` \| `independant` \| `academique` — affiché, non filtrant |
| `secteur` | string | |
| `client` | string | |
| `client_anonymise` | boolean | |
| `role` | string | |
| `debut` | date `YYYY-MM` | |
| `production_depuis` | date `YYYY-MM` \| null | |
| `fin` | date `YYYY-MM` \| null | `null` = mission en cours |
| `utilisateurs` | string | |
| `technologies` | string[] | peut être vide (`[]`) |
| `mis_en_avant` | boolean | apparaît sur l'accueil |
| `brouillon` | boolean | `true` = exclu du build, de l'index, de l'accueil, du sitemap |
| `ordre` | number | tri manuel dans l'index |
| `lien_demo` | string \| null | URL absolue ou `null` |
| `image_couverture` | string \| null | chemin relatif, `public/realisations/<slug>.<ext>`, ≤ 300 Ko |
| `alt_couverture` | string \| null \| _absent_ | **seule clé facultative** ; texte alternatif de la couverture. Absent/`null` → `alt=""` (décorative). À renseigner pour une capture d'interface. |

### Corps MDX — deux couches

```mdx
## Avant
## Ce qui a été mis en place
## Aujourd'hui

<Approfondir>
### Choix de conception
### Modèle de données
### Technique
### Retour d'expérience
</Approfondir>
```

`<Approfondir>` : bloc **replié par défaut**, dépliable au clic. `<details>` natif ou
disclosure accessible (clavier, `aria-expanded`), sans dépendance lourde.

### Chaîne de lecture (`lib/`)

| Module | Rôle |
|---|---|
| `lib/frontmatter.ts` | schéma zod strict (`.strict()`), `Frontmatter` inféré ; rejette clé inconnue, `type`/`cadre` hors taxonomie, date hors `AAAA-MM`, `technologies` vide |
| `lib/realisations.ts` | lecture `fs` de `content/realisations/*.mdx`, `gray-matter`, validation, contrôle `slug === nom de fichier` |

API publique (toutes filtrent les brouillons, sauf la première) :

- `_lireFichesBrouillonsComprises()` — tout, réservé aux tests/outillage ;
- `getRealisationsPubliees()` — publiables, triées par `ordre` croissant ;
- `getRealisation(slug)` — `null` si absente **ou** brouillon (→ 404) ;
- `getSlugsPublies()` — pour `generateStaticParams` ;
- `getRealisationsMisesEnAvant()` — publiables **et** `mis_en_avant`.

Le paramètre `dossier` optionnel de ces fonctions est un point d'entrée de test
(fixtures) ; le code applicatif les appelle sans argument.

### Rendu (composants)

| Composant | Rôle |
|---|---|
| `components/contenu-mdx.tsx` | compile le corps MDX (`next-mdx-remote/rsc` + `remark-gfm`) au build, mappe `<Approfondir>` et les éléments de base |
| `components/approfondir.tsx` | `<details>`/`<summary>` natif : replié sans JS, clavier, annoncé par lecteur d'écran, contenu conservé dans le DOM (indexable) |
| `components/realisations-browser.tsx` | filtre `type` côté client ; état initial « tout » → le HTML statique liste déjà toutes les fiches (ADR-012) |
| `components/realisation-carte.tsx` | carte d'index ; tolère `image_couverture: null` et `technologies: []` |
| `lib/affichage.ts` | helpers purs testés (`formatPeriode`, `technologiesAffichees`, …) — aucun libellé orphelin quand un champ optionnel manque |

## 4. Modèle de contenu — Offres

La page `/offres` = **un en-tête** + **trois offres** (gabarit unique répété) +
**deux blocs de page** (« Mission longue », bandeau de fin). Contenu dans
`content/offres/<slug>.mdx` et `content/offres-blocs/<slug>.mdx`, validé par zod
au build. **Aucun contenu (montants et délais compris) n'est en dur dans le
code.** Pas de corps MDX : tout est structuré en frontmatter, rien à compiler.

### Frontmatter d'une offre

| Champ | Type | Notes |
|---|---|---|
| `slug` | string | doit correspondre au nom de fichier |
| `titre`, `accroche` | string | |
| `concerne_si`, `obtenez`, `etapes` | string[] | listes du gabarit ; `etapes` rendu en `<ol>` |
| `delai`, `budget` | string | texte libre — jamais de montant en dur dans le code |
| `note` | string \| null | bloc « Note » distinct en fin d'offre (rare) |
| `deja_fait` | `{ slug, texte }[]` | 0..n exemples ; `texte` est éditorial (jamais dérivé de la fiche) |
| `cta_libelle`, `cta_lien` | string | `cta_lien` : `/chemin`, `mailto:`, `tel:` ou URL absolue |
| `ordre` | number | position parmi les trois offres (ordre **intentionnel**) |
| `brouillon` | boolean | même garde-fou que les réalisations |

### Frontmatter d'un bloc de page (`content/offres-blocs/`)

Schéma unique `blocPageSchema`, trois usages (en-tête, mission longue, bandeau de
fin) : `slug`, `titre`, `paragraphes` (string[]), `tarif` (string | null),
`email` (string | null, rendu en `mailto:`), `liens` (`{ libelle, href }[]`),
`brouillon`. Pas d'`ordre` : chaque bloc a une place fixe dans la page, appelé par
son slug (`entete`, `mission-longue-renfort-equipe`, `bandeau-fin`).

### Résolution « Déjà fait »

`resolveDejaFait(items)` (`lib/offres.ts`) : pour chaque item, le `texte` est
**toujours** conservé (contenu éditorial de la page /offres) ; un lien vers
`/realisations/<slug>` n'est ajouté **que si** `getRealisation(slug)` trouve une
fiche publiée — il renvoie déjà `null` pour une fiche absente **ou en brouillon**.
Résultat : texte affiché, lien absent quand la fiche n'est pas publiable. **Aucun
lien mort, aucune erreur de build** — vérifié par un build de contrôle sur les
quatre références réelles (une en brouillon, trois inexistantes). Aucune donnée de
la réalisation n'est recopiée dans le frontmatter de l'offre — anti-duplication.

### Chaîne de lecture et rendu

| Module / composant | Rôle |
|---|---|
| `lib/offre-frontmatter.ts` | schémas zod stricts `offreSchema` / `blocPageSchema` |
| `lib/offres.ts` | lecture `fs`, validation, filtre brouillon, tri, `getBlocPage`, `resolveDejaFait` |
| `components/offre-carte.tsx` | gabarit unique, rendu trois fois par `app/offres/page.tsx` |
| `components/bloc-page.tsx` | composant unique des trois blocs de page (`niveauTitre` h1/h2) |

## 5. Taxonomie

Source **unique** : `lib/taxonomie.ts`. Aucune recopie ailleurs, y compris dans la
génération d'images Open Graph. Deux dimensions — voir `docs/DECISIONS.md` ADR-006.

## 6. Rendu & build

- Toutes les pages sont générées au build. `generateStaticParams` énumère les fiches
  **non brouillon** uniquement.
- Aucune requête réseau au build. Aucune variable d'environnement obligatoire, hormis
  `NEXT_PUBLIC_SITE_URL` (voir §9), qui a un repli explicite et signalé.

## 7. Métadonnées & Open Graph

- Métadonnées sur **toutes** les pages, accueil compris.
- Open Graph + image de partage **par page**. Les libellés de taxonomie affichés dans
  les images sont lus depuis `lib/taxonomie.ts`, jamais recopiés.
- `metadataBase` dérive de `SITE_URL` (`lib/site.ts`).

## 8. Sitemap & robots

- `sitemap.ts` et `robots.ts` générés.
- Les fiches `brouillon: true` sont **exclues** du sitemap.

## 9. Variables d'environnement

| Variable | Obligatoire | Défaut |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | non | `FALLBACK` dans `lib/site.ts`, avec `console.warn` si absente |
| clé du service de formulaire | non (au build) | — ; requise au runtime pour l'envoi |

## 10. Performance (cible : mobile lente)

- Polices auto-hébergées (`next/font/local`, `public/fonts/`).
- Images dimensionnées, `next/image`, refus de tout fichier > 300 Ko dans `public/`.
- Aucune requête tierce bloquante.

## 11. Accessibilité

- Un seul `<h1>` par page, hiérarchie de titres respectée.
- Textes alternatifs sur les images porteuses de sens.
- Navigation clavier complète, y compris `<Approfondir>` et le filtre de l'index.

## 12. Arborescence

```
portfolio-freelance/
├── app/                     # routes (App Router)
├── components/              # composants partagés (+ ui/)
├── content/realisations/    # fiches MDX
├── content/offres/                  # 3 offres
├── content/offres-blocs/            # en-tete, mission longue, bandeau de fin
├── docs/                    # DECISIONS.md, ARCHITECTURE.md
├── lib/                     # site.ts, taxonomie.ts, chaîne de contenu
├── public/                  # fonts/, realisations/ (médias)
├── rules/                   # ABOUT-ME.md, STACK.md, GIT.md
└── .github/workflows/ci.yml
```
