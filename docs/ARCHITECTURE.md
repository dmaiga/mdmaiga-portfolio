# ARCHITECTURE

Autorité sur : structure technique du site, modèle de contenu, contrat des routes,
règles de rendu, métadonnées, performance et accessibilité.
Les *décisions* et leurs compromis vivent dans `docs/DECISIONS.md` (non dupliqués ici).

---

## 1. Vue d'ensemble

- **Next.js (App Router, TypeScript)**, rendu **statique par défaut**, déployé sur **Vercel**.
- **Aucun backend, aucune base de données, aucun appel API** au build ou au runtime.
- Le contenu vit dans des fichiers **MDX versionnés** sous `content/realisations/`.
- Le build ne dépend d'aucun réseau (données locales, polices auto-hébergées).

## 2. Routes

| Route | Contenu | Génération |
|---|---|---|
| `/` | Accueil | statique |
| `/offres` | Trois offres, gabarit identique répété | statique |
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
| `technologies` | string[] | |
| `mis_en_avant` | boolean | apparaît sur l'accueil |
| `brouillon` | boolean | `true` = exclu du build, de l'index, de l'accueil, du sitemap |
| `ordre` | number | tri manuel dans l'index |
| `lien_demo` | string \| null | optionnel |
| `image_couverture` | string \| null | chemin relatif, `public/realisations/<slug>.<ext>`, ≤ 300 Ko |

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

## 4. Taxonomie

Source **unique** : `lib/taxonomie.ts`. Aucune recopie ailleurs, y compris dans la
génération d'images Open Graph. Deux dimensions — voir `docs/DECISIONS.md` ADR-006.

## 5. Rendu & build

- Toutes les pages sont générées au build. `generateStaticParams` énumère les fiches
  **non brouillon** uniquement.
- Aucune requête réseau au build. Aucune variable d'environnement obligatoire, hormis
  `NEXT_PUBLIC_SITE_URL` (voir §8), qui a un repli explicite et signalé.

## 6. Métadonnées & Open Graph

- Métadonnées sur **toutes** les pages, accueil compris.
- Open Graph + image de partage **par page**. Les libellés de taxonomie affichés dans
  les images sont lus depuis `lib/taxonomie.ts`, jamais recopiés.
- `metadataBase` dérive de `SITE_URL` (`lib/site.ts`).

## 7. Sitemap & robots

- `sitemap.ts` et `robots.ts` générés.
- Les fiches `brouillon: true` sont **exclues** du sitemap.

## 8. Variables d'environnement

| Variable | Obligatoire | Défaut |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | non | `FALLBACK` dans `lib/site.ts`, avec `console.warn` si absente |
| clé du service de formulaire | non (au build) | — ; requise au runtime pour l'envoi |

## 9. Performance (cible : mobile lente)

- Polices auto-hébergées (`next/font/local`, `public/fonts/`).
- Images dimensionnées, `next/image`, refus de tout fichier > 300 Ko dans `public/`.
- Aucune requête tierce bloquante.

## 10. Accessibilité

- Un seul `<h1>` par page, hiérarchie de titres respectée.
- Textes alternatifs sur les images porteuses de sens.
- Navigation clavier complète, y compris `<Approfondir>` et le filtre de l'index.

## 11. Arborescence

```
portfolio-freelance/
├── app/                     # routes (App Router)
├── components/              # composants partagés (+ ui/)
├── content/realisations/    # fiches MDX
├── docs/                    # DECISIONS.md, ARCHITECTURE.md
├── lib/                     # site.ts, taxonomie.ts, chaîne de contenu
├── public/                  # fonts/, realisations/ (médias)
├── rules/                   # ABOUT-ME.md, STACK.md, GIT.md
└── .github/workflows/ci.yml
```
