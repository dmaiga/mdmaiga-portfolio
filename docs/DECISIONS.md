# DECISIONS — Journal des décisions (ADR léger)

Format par décision : **Décision · Pourquoi · Alternatives écartées**.
Honnête avant d'être flatteur : un choix conservé sans être idéal est documenté comme tel.

Ce dépôt (`portfolio-freelance`) est neuf. Les ADR de l'ancien portfolio
(architecture headless Django + Next) sont caducs et ne sont pas repris.

---

## ADR-001 — Dépôt neuf, pas de migration
*2026-09-01 · Acté*
- **Décision.** Repartir d'un dépôt vide. Ne migrer ni le contenu, ni la taxonomie,
  ni le backend, ni la CI de l'ancien portfolio. Seuls quelques fichiers d'interface
  et de conventions sont copiés manuellement.
- **Pourquoi.** Le contenu éditorial est obsolète, la taxonomie ne correspond plus
  au positionnement freelance. Migrer coûterait plus que réécrire, et transporterait
  des choix structurants (API REST, base de données) désormais sans objet.
- **Alternatives écartées.** Refactor en place de l'ancien dépôt : l'ancien reste la
  vitrine en production pendant les travaux ; on n'y touche pas.

## ADR-002 — Aucun backend : contenu en MDX versionné
*2026-09-01 · Acté*
- **Décision.** Pas de serveur applicatif, pas de base de données, aucun appel API
  au build ni au runtime. Chaque réalisation est un fichier
  `content/realisations/<slug>.mdx` versionné dans Git.
- **Pourquoi.** Site quasi lecture seule, ~9 fiches à terme, un seul auteur.
  Un backend serait une surface de maintenance sans contrepartie. Git tient lieu
  de CMS, de versionnement et d'historique éditorial.
- **Alternatives écartées.** CMS headless (Sanity, Contentful) : dépendance externe
  et coût pour un besoin que des fichiers couvrent. Backend Django réutilisé de
  l'ancien dépôt : réintroduit toute la complexité qu'on cherche à supprimer.

## ADR-003 — Rendu statique Next par défaut (pas de `output: 'export'`)
*2026-09-01 · Acté*
- **Décision.** S'appuyer sur le rendu statique par défaut de Next (App Router,
  `generateStaticParams`), déployé sur Vercel. Ne pas activer `output: 'export'`.
- **Pourquoi.** Toutes les pages sont connues au build : le rendu est intégralement
  statique et sans appel réseau, ce qui satisfait la contrainte « build hors ligne ».
  `output: 'export'` désactiverait l'optimisation `next/image`, or la performance sur
  connexion mobile lente est une contrainte réelle du projet. La règle « aucune
  dépendance réseau au build » vise les données et les polices, pas le mode de rendu.
- **Alternatives écartées.** `output: 'export'` : perte de `next/image` sans gain
  ici (Vercel sert déjà le statique). SSR / ISR : aucun contenu dynamique à servir.

## ADR-004 — Chaîne MDX : trio explicite
*2026-09-01 · Acté*
- **Décision.** Lire et rendre le MDX avec `next-mdx-remote` (variante RSC, au build),
  `gray-matter` (frontmatter) et `zod` (validation stricte du frontmatter, échec de
  build si invalide). `remark-gfm` pour les tableaux/listes.
- **Pourquoi.** Trois petites briques au rôle lisible, sans couche de génération
  implicite. La validation zod qui casse le build est le garde-fou principal du
  projet (voir ADR-005).
- **Alternatives écartées.** `@next/mdx` : attend les fichiers sous `app/`, or le
  contenu vit dans `content/`. `contentlayer` : non maintenu. `velite` : regroupe
  zod + glob + mdx mais ajoute de la magie de build ; le trio explicite est préféré.

## ADR-005 — `brouillon: true` exclut réellement la fiche
*2026-09-01 · Acté*
- **Décision.** Une fiche `brouillon: true` n'apparaît ni dans l'index `/realisations`,
  ni sur l'accueil, ni dans le sitemap, ni comme route générée
  (`generateStaticParams` ne l'émet pas → 404 en production).
- **Pourquoi.** Les ~9 fiches seront saisies progressivement sur plusieurs semaines.
  C'est le seul garde-fou contre la publication accidentelle d'un contenu inachevé.
- **Recette.** Test automatisé dédié (Vitest) : c'est le test le plus important du
  projet. Voir `rules/STACK.md` (section Tests).

## ADR-006 — Taxonomie : `type` (visiteur) vs `cadre` (informatif)
*2026-09-01 · Acté*
- **Décision.** Deux dimensions distinctes, libellés dans une **source unique**
  `lib/taxonomie.ts`, jamais recopiés ailleurs (index, filtres, cartes, images OG).
  - `type` — nature perçue par le visiteur, **filtrante** sur `/realisations` :
    `plateforme-metier` · `decisionnel` · `institutionnel` · `laboratoire`.
  - `cadre` — cadre d'intervention, **affiché mais non filtrant** :
    `salarie` · `independant` · `academique`.
- **Pourquoi.** Le visiteur raisonne en nature de projet, pas en statut contractuel
  de l'auteur. Mélanger les deux dans un seul filtre brouillerait la lecture.
- **Alternatives écartées.** Une seule taxonomie mêlant les deux : rejetée, elle
  imposerait au visiteur un vocabulaire (salarié / indépendant) hors de son intérêt.

## ADR-007 — Polices auto-hébergées via `next/font/local`
*2026-09-01 · Acté*
- **Décision.** Charger les polices avec `next/font/local` depuis des fichiers
  `.woff2` versionnés dans `public/fonts/`. Inter convient.
- **Pourquoi.** `next/font/google` télécharge la police au build → dépendance réseau,
  interdite ici. `next/font/local` élimine toute requête tierce (build et runtime).
- **Alternatives écartées.** `next/font/google` : viole « build hors ligne ».
  Lien `<link>` vers Google Fonts : requête tierce bloquante au runtime.
- **En attente.** Les fichiers `.woff2` ne sont pas encore présents dans le dépôt ;
  l'emplacement (`public/fonts/`) et la configuration seront préparés, la fourniture
  des fichiers est à la charge de l'auteur.

## ADR-008 — Formulaire de contact : service tiers
*2026-09-01 · Acté*
- **Décision.** Soumission via un service tiers (Web3Forms ou Formspree, au choix),
  clé publique en variable d'environnement. La requête n'a lieu qu'à la soumission.
  L'adresse `mdmaiga01@gmail.com` est affichée en clair et cliquable à côté du
  formulaire.
- **Pourquoi.** Le rendu statique interdit toute route serveur / server action.
  Une partie des visiteurs écrira directement plutôt que de remplir un formulaire.
- **Alternatives écartées.** `mailto:` seul : friction et perte de messages sur
  postes sans client mail configuré. Backend dédié : réintroduit un serveur (ADR-002).

## ADR-009 — Paquet `shadcn` retiré des dépendances
*2026-09-01 · Acté*
- **Décision.** Ne pas dépendre du paquet `shadcn` en production. L'ancien
  `globals.css` faisait `@import "shadcn/tailwind.css"` ; ce fragment sera inliné
  si nécessaire lors du portage des composants UI.
- **Pourquoi.** `shadcn` est une CLI de scaffolding, pas une librairie runtime.
  Les composants copiés (`button`, `badge`) sont du code possédé, pas une dépendance.
- **Alternatives écartées.** Garder le paquet « pour l'import CSS » : dette de
  dépendance pour un fragment de quelques lignes.

## ADR-010 — CI mono-projet
*2026-09-01 · Acté*
- **Décision.** Un seul workflow GitHub Actions : `lint`, `typecheck`, `build`.
  Le déploiement est délégué à l'intégration Vercel, hors workflow.
- **Pourquoi.** Plus de backend ni de double pipeline (l'ancien dépôt avait une CI
  Python + une CI front). Vercel construit et déploie sur push/PR nativement ;
  dupliquer le déploiement dans Actions n'apporterait rien.
- **Alternatives écartées.** Déploiement piloté par Actions (`vercel deploy`) :
  redondant avec l'intégration Git de Vercel, une source de vérité en plus à tenir.

## ADR-011 — Rendu MDX : `next-mdx-remote/rsc`
*2026-09-01 · Acté*
- **Décision.** Compiler le corps MDX des fiches avec `next-mdx-remote/rsc` +
  `remark-gfm`, dans un composant serveur. La page `[slug]` étant générée via
  `generateStaticParams`, la compilation a lieu au build — aucun runtime serveur.
- **Pourquoi.** Le contenu vit dans `content/`, hors `app/` : `@next/mdx` (qui mappe
  des fichiers sous `app/`) ne convient pas. `next-mdx-remote/rsc` prend une source
  brute et un mapping de composants (`<Approfondir>`), ce qu'il nous faut.
- **Alternatives écartées.** `@next/mdx` (mauvais emplacement) ; `@mdx-js/mdx` à la
  main (recompose ce que la lib fait déjà). Coloration syntaxique : hors sujet, les
  fiches ne contiennent aucun bloc de code.

## ADR-012 — Filtre de l'index côté client, dégradation par l'état initial
*2026-09-01 · Acté*
- **Décision.** Le filtre par `type` de `/realisations` est un composant client dont
  l'état initial est « tout ». La page (serveur) rend d'abord la liste complète des
  fiches publiées ; le composant est rendu au build avec cet état, donc le HTML
  statique contient déjà toutes les cartes.
- **Pourquoi.** Sans JavaScript ou avant hydratation, le visiteur voit la liste
  complète — jamais une liste vide. Le JavaScript n'ajoute qu'un tri visuel.
  Garde la page 100 % statique (pas de `searchParams`, qui la rendrait dynamique).
- **Alternatives écartées.** Filtre serveur via `searchParams` : bascule la page en
  rendu dynamique, contradiction avec ADR-003. Liens `?type=` pré-rendus : multiplie
  les routes pour un bénéfice nul ici.
- **Conséquence.** Les libellés de pastilles sont lus depuis `lib/taxonomie.ts` ;
  seuls les `type` réellement présents dans les fiches produisent une pastille.

## ADR-013 — Champs optionnels du frontmatter : `null` / `[]`, jamais absents
*2026-09-01 · Acté*
- **Décision.** `production_depuis`, `fin`, `lien_demo`, `image_couverture` valent
  explicitement `null` quand ils ne s'appliquent pas ; `technologies` vaut `[]`.
  Les clés restent présentes dans chaque fiche. `technologies` peut être vide
  (plusieurs fiches à venir n'exposent aucune techno).
- **Pourquoi.** Un frontmatter à clés stables se relit et se valide plus simplement
  qu'un frontmatter à clés variables. Le rendu (fiche, carte) teste `null` / longueur
  et n'affiche ni section vide ni libellé orphelin — vérifié par `affichage.test.ts`
  et un rendu de contrôle au build.
- **Alternatives écartées.** Clés omises + `z.optional()` : rend le gabarit de fiche
  truffé de `?.` et le modèle de contenu moins lisible pour l'auteur.
- **Exception — `alt_couverture`.** Seule clé réellement facultative (peut être
  absente). Elle n'a de sens qu'avec `image_couverture` ; l'imposer partout
  n'apporterait rien. Absente ou `null` → `alt=""` (couverture décorative) ;
  renseignée → texte alternatif porteur d'information (captures d'interface).
