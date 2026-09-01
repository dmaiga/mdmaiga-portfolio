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

### Gabarit d'une fiche (à copier)

```mdx
---
slug: mon-slug
titre: "…"
resume: "…"
type: plateforme-metier          # plateforme-metier | decisionnel | institutionnel | laboratoire
cadre: independant               # salarie | independant | academique
secteur: "…"
client: "…"
client_anonymise: true
role: "…"
debut: 2026-01
production_depuis: null          # AAAA-MM ou null
fin: null                        # AAAA-MM ou null (null = en cours)
utilisateurs: "…"
technologies: []                 # peut être vide
mis_en_avant: false
brouillon: true                  # true tant que la fiche n'est pas prête
ordre: 999
lien_demo: null
image_couverture: null
alt_couverture: null             # à renseigner si la couverture est une capture d'interface
---

## Avant
…

## Ce qui a été mis en place
…

## Aujourd'hui
…

<Approfondir>

### Choix de conception
…

### Retour d'expérience
…

</Approfondir>
```

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

## 5. Modèle de contenu — Pages fixes (accueil, à propos, contact)

Un fichier par page dans `content/pages/` (`accueil.mdx`, `a-propos.mdx`,
`contact.mdx`), frontmatter seul, validé par zod (`lib/pages-frontmatter.ts`,
lecture `lib/contenu-pages.ts`). Briques de schéma communes dans
`lib/schema-commun.ts` (`SLUG`, `lien()`, `lienNommeSchema`, `sectionTexteSchema`,
`blocSchema`). Chaque page a un schéma dédié, structure figée (pas de corps MDX).

- **Accueil** : `hero` (titre, sous-titre, disponibilité, deux boutons),
  `probleme` (`blocs[]` intitulé + phrase), `apercu_offres` (intitulé + texte +
  libellé de lien), `preuve` (`entrees[]` `{ chiffre, libelle, detail }`),
  `apercu_realisations`, `demarche` (paragraphes + libellé de lien), `cta`.
  Il ne stocke **que son propre texte** + les intitulés des blocs d'aperçu. Les
  offres viennent de `getOffresPubliees()`, les réalisations de
  `getRealisationsMisesEnAvant()` — titres et résumés lus en direct, **jamais
  recopiés**. Le bloc réalisations n'est rendu que si la liste n'est pas vide :
  sans fiche publiée (état actuel), il **disparaît** — ni grille vide, ni message.
- **À propos** : `titre` (le nom, `<h1>`), `sous_titre`, `photo` (nullable),
  `ce_que_je_fais` / `ce_que_je_ne_fais_pas` (prose), `comment_je_travaille` /
  `competences` (`blocs[]`), `parcours` (`items[]` en liste), `cta` (texte + liens).
- **Contact** : `titre`, `intro[]`, `email`, `liens[]` (LinkedIn, GitHub),
  `formulaire` : `champs[]` (`{ nom, libelle, type, requis, options }` —
  types `texte` / `email` / `liste` / `zone_texte`), `bouton`, `message_repli`.
  Le formulaire est **piloté par le contenu** : `ContactFormulaire` rend les champs
  décrits dans `contact.mdx` (ADR-019). Envoi via **Web3Forms**, clé
  `NEXT_PUBLIC_WEB3FORMS_KEY`. Absente au build → formulaire non rendu,
  `message_repli` + e-mail (`mailto:`) + liens affichés. Requête à la soumission.

### Navigation

`components/site-nav.tsx` (client, `usePathname` pour `aria-current`) dans le
layout : cinq entrées, ordre fixe **Accueil · Offres · Réalisations · À propos ·
Contact**. `components/site-footer.tsx` : nom + lien contact.

## 6. Taxonomie

Source **unique** : `lib/taxonomie.ts`. Aucune recopie ailleurs, y compris dans la
génération d'images Open Graph. Deux dimensions — voir `docs/DECISIONS.md` ADR-006.

## 7. Rendu & build

- Toutes les pages sont générées au build. `generateStaticParams` énumère les fiches
  **non brouillon** uniquement.
- Aucune requête réseau au build. Aucune variable d'environnement obligatoire, hormis
  `NEXT_PUBLIC_SITE_URL` (voir §10), qui a un repli explicite et signalé.

## 8. Métadonnées & Open Graph

- **Toutes** les pages ont un titre et une description, tirés du contenu
  (`content/pages/meta.mdx` pour les pages fixes ; frontmatter `titre` / `resume`
  pour les fiches). Rien n'est écrit dans les composants de page — voir
  `lib/metadonnees.ts` (`metadonneesSite`, `metadonneesPage`, `metadonneesFiche`).
  Le layout porte `title.template` + `title.default` + Open Graph du site.
- **Image Open Graph par page**, générée au build via `next/og` (`lib/og.tsx`) :
  fichiers `app/**/opengraph-image.tsx`. 1200×630 PNG, aucun appel réseau.
  `app/realisations/[slug]/opengraph-image.tsx` a `generateStaticParams` =
  slugs publiés + `dynamicParams = false` → **une fiche en brouillon n'en génère
  aucune** (elle répond 404).
- `metadataBase` dérive de `SITE_URL` (`lib/site.ts`). `alternates.canonical` par page.
- Le garde-fou `content-guards` couvre `content/pages/meta.mdx` : pas de marqueur
  d'inachèvement dans un titre ou une description publiés.

## 9. Sitemap & robots

- `app/sitemap.ts` = `construireSitemap(SITE_URL, getSlugsPublies())` — logique de
  construction pure dans `lib/sitemap.ts` (5 pages fixes + une entrée par fiche
  publiée), testée sur fixtures **et** sur le sitemap réel (`lib/sitemap.test.ts`) :
  un brouillon exclu par `getSlugsPublies()` n'apparaît pas.
- `app/robots.ts` : `allow: /` + lien vers `sitemap.xml`. Les fiches brouillon
  n'ont pas de route (404) : rien à interdire.

## 10. Variables d'environnement

| Variable | Obligatoire | Défaut |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | non | `FALLBACK` dans `lib/site.ts`, avec `console.warn` si absente |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | non | `null` → formulaire de contact non rendu, e-mail affiché à la place |

## 11. Performance (cible : connexion mobile lente à Bamako)

- Aucune police web : `--font-inter` non fourni → repli système, zéro téléchargement.
- Aucune image chargée par les pages aujourd'hui (photo à propos `null`, aucune
  couverture publiée). `next/image` pour les futures ; refus de tout fichier
  > 300 Ko dans `public/`.
- Aucune requête tierce bloquante. Web3Forms seulement à la soumission du formulaire.
- Poids mesuré (`next start`, gzip, HTML + JS + CSS) : **~205 à 210 Ko par page**,
  dont ~200 Ko de JavaScript qui est le socle Next 16 + React 19 (aucune lib
  serveur — mdx, zod, gray-matter, satori — ne fuit côté client). Le HTML utile
  fait 3 à 8 Ko gzip et s'affiche avant le JavaScript. Point de vigilance : ce
  socle JS est lourd pour la cible ; il est incompressible sans retirer de
  l'interactivité.

## 12. Accessibilité

- Un seul `<h1>` par page, hiérarchie `h1 > h2 > h3` sans saut (vérifié sur le HTML).
- `SiteNav` : `<nav aria-label>`, `aria-current="page"` sur l'entrée active, liens
  natifs (ordre de tabulation = ordre visuel, aucun `tabindex`).
- Formulaire de contact : `<label htmlFor>` sur chaque champ, éléments natifs
  (`input` / `select` / `textarea` / `button`), statut d'envoi en `aria-live`.
- `<Approfondir>` : `<details>`/`<summary>` natif, focusable et actionnable au clavier.
- Textes alternatifs sur les images porteuses de sens (`alt_couverture`).
- Non vérifié automatiquement : ratios de contraste (palette annoncée AA dans
  `globals.css`, contrôle visuel/outil à faire), parcours clavier réel dans un
  navigateur.

## 13. Arborescence

```
portfolio-freelance/
├── app/                     # routes (App Router)
├── components/              # composants partagés (+ ui/)
├── content/realisations/    # fiches MDX
├── content/offres/                  # 3 offres
├── content/offres-blocs/            # en-tete, mission longue, bandeau de fin
├── content/pages/                   # accueil, a-propos, contact, meta
├── docs/                    # DECISIONS.md, ARCHITECTURE.md
├── lib/                     # site.ts, taxonomie.ts, metadonnees.ts, sitemap.ts, og.tsx, chaîne de contenu
├── public/                  # fonts/, realisations/ (médias)
├── rules/                   # ABOUT-ME.md, STACK.md, GIT.md, LANGUE.md
└── .github/workflows/ci.yml
```

`app/` contient aussi : `opengraph-image.tsx` (racine + une par page + `[slug]`),
`sitemap.ts`, `robots.ts`. Redirections `/projects` → `/realisations` dans
`next.config.ts`, **vérifiées sur le build** (`next start` : 308 vers la bonne
cible, y compris `/projects/:slug`).
