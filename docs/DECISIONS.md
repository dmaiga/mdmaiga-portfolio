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

## ADR-014 — Contenu des offres : frontmatter seul, sans corps MDX
*2026-09-01 · Acté*
- **Décision.** Chaque offre (`content/offres/<slug>.mdx`) et chaque bloc de page
  (`content/offres-blocs/<slug>.mdx` : en-tête, mission longue, bandeau de fin)
  porte tout son contenu en frontmatter (listes, paragraphes courts). Le corps du
  fichier n'est pas lu ni compilé.
- **Révision (contenu réel reçu).** Le bloc « contrôle de paie » prévu à l'étape 4
  ne figure pas dans le contenu définitif — scaffold supprimé. Trois blocs de page
  partagent un schéma unique `blocPageSchema` (`paragraphes[]`, `tarif`, `email`,
  `liens[]`), chacun appelé par un slug fixe. `content/offres-complementaires/`
  renommé `content/offres-blocs/`.
- **Pourquoi.** Contrairement à une réalisation, une offre n'a pas de récit en
  prose libre : c'est une fiche technique (accroche, critères, livrables, étapes,
  délai, budget). La représenter en listes de frontmatter la rend éditable puce
  par puce, sans ambiguïté de structure, et évite une compilation MDX pour un
  contenu qui n'en a pas l'usage. Réutilise `gray-matter` + `zod`, déjà en place —
  aucune dépendance supplémentaire.
- **Alternatives écartées.** Corps MDX avec sections `## Vous êtes concerné·e si…`
  etc., comme les réalisations : oblige à faire correspondre des titres de
  section par leur texte (fragile) pour en extraire une liste, pour un gain nul
  ici (pas de mise en forme riche, pas de composant à insérer).
- **Prix.** Toujours en texte libre dans le frontmatter (`delai`, `budget`),
  jamais en dur dans un composant — ils changeront.

## ADR-015 — Bloc « Déjà fait » : texte éditorial + lien conditionnel
*2026-09-01 · Acté (révisé sur contenu réel)*
- **Décision.** Une offre porte `deja_fait: { slug, texte }[]` (0..n). Le `texte`
  est du contenu éditorial rédigé pour la page /offres — **toujours affiché**.
  `resolveDejaFait()` (`lib/offres.ts`) ajoute un lien vers `/realisations/<slug>`
  **seulement si** `getRealisation(slug)` trouve une fiche publiée (il renvoie déjà
  `null` pour une fiche absente **ou** en brouillon). Sinon : texte seul.
- **Écart avec la première version.** Prévu au départ : `deja_fait_slug` unique,
  bloc entièrement masqué si non résolu, titre tiré de la fiche. Le contenu réel
  impose : plusieurs exemples par offre (l'offre 3 en a trois), chacun avec sa
  propre description indépendante de la fiche, et le **texte reste visible** même
  sans lien. Le schéma et la résolution ont été refaits en conséquence.
- **Pourquoi.** Toutes les réalisations sont en brouillon aujourd'hui (ADR-005),
  et trois des quatre slugs référencés (`dams-decisionnel`, `antares-rh`, `amee`)
  n'existent pas encore comme fiches : c'est le cas normal, pas une exception.
- **Vérifié.** Build de contrôle sur le contenu réel : `grep` du HTML généré →
  0 occurrence de « Voir la réalisation », 0 `href="/realisations/…"`, build vert.
- **Alternatives écartées.** Recopier titre/lien de la réalisation dans le
  frontmatter de l'offre : viole l'anti-duplication ; casse au renommage.

## ADR-016 — Pages fixes : contenu en frontmatter, aperçus lus en direct
*2026-09-01 · Acté*
- **Décision.** Accueil, à propos et contact ont chacun un fichier
  `content/pages/<page>.mdx` (frontmatter seul, schéma zod dédié dans
  `lib/pages-frontmatter.ts`). Briques communes factorisées dans
  `lib/schema-commun.ts` (`SLUG`, `lien()`, `lienNommeSchema`, `sectionTexteSchema`),
  désormais partagées avec `frontmatter.ts` et `offre-frontmatter.ts`.
- **Anti-duplication (accueil).** L'accueil ne stocke que son texte propre et les
  **intitulés** des blocs d'aperçu. Les trois offres et les réalisations mises en
  avant sont lues via `getOffresPubliees()` / `getRealisationsMisesEnAvant()` —
  les mêmes fonctions que `/offres` et `/realisations`. Titres et résumés ne sont
  jamais recopiés dans `content/pages/accueil.mdx`.
- **Dégradation.** Le bloc « réalisations mises en avant » n'est rendu que si la
  liste est non vide. Sans fiche publiée (état actuel, durable), il disparaît :
  ni grille vide, ni message d'erreur. Vérifié sur le HTML généré.
- **Alternatives écartées.** Un corps MDX par page : ces pages ont une structure
  fixe (hero, preuve chiffrée, etc.), le frontmatter structuré est plus sûr à
  éditer et permet de valider chaque bloc.

## ADR-017 — Formulaire de contact : Web3Forms, dégradation sur clé absente
*2026-09-01 · Acté*
- **Décision.** Formulaire de contact via **Web3Forms** (POST client à la
  soumission, aucun appel au build). Clé publique dans `NEXT_PUBLIC_WEB3FORMS_KEY`,
  exposée par `lib/site.ts` (`CLE_FORMULAIRE_CONTACT`, `null` si absente).
- **Dégradation.** Clé absente au build → `app/contact/page.tsx` ne rend pas
  `<ContactFormulaire>` mais un court message ; l'e-mail (`mailto:`) et les liens
  LinkedIn / GitHub restent affichés et utilisables. Vérifié par deux builds de
  contrôle (avec et sans `NEXT_PUBLIC_WEB3FORMS_KEY`).
- **Pourquoi Web3Forms plutôt que Formspree.** Modèle « clé d'accès publique en
  paramètre » qui colle à la contrainte « clé en variable d'environnement » ;
  Formspree encode l'identifiant dans l'URL du endpoint. Choix réversible (une
  seule fonction de soumission).
- **Alternatives écartées.** `mailto:` seul (déjà écarté ADR-008) ; backend dédié
  (réintroduit un serveur — ADR-002).

## ADR-018 — Règles de langue du contenu du site
*2026-09-01 · Acté*
- **Décision.** Sept règles imposées par l'auteur pour tout texte visible du site
  (`rules/LANGUE.md`) : pas d'emoji, pas de tiret long, langue parlée, une idée
  par phrase (25 mots max côté client), verbes d'action, un chiffre plutôt qu'un
  adjectif, aucun sigle pour un lecteur non technique.
- **Conséquences.**
  - `formatPeriode` écrit « Janvier 2026 à juin 2026 » (plus de tiret `–`).
  - Tout texte produit par l'agent (libellés, messages, placeholders) suit ces
    règles. Le contenu livré par l'auteur n'est pas réécrit.
  - `lib/content-guards.test.ts` : une réalisation, une offre ou un bloc de page
    `brouillon: false` ne doit contenir ni `TODO —` ni `[VÉRIFIER`.
- **Portée.** S'applique rétroactivement en esprit ; le contenu déjà livré
  (offres, NETSUP) n'est pas modifié sans accord explicite de l'auteur.

## ADR-019 — Formulaire de contact piloté par le contenu
*2026-09-01 · Acté*
- **Décision.** Les champs du formulaire de contact (libellés, types, listes
  d'options, obligatoire ou non) sont décrits dans `content/pages/contact.mdx`
  (`formulaire.champs`), pas codés dans le composant. `ContactFormulaire` les rend
  dynamiquement ; Web3Forms reçoit tous les champs nommés.
- **Pourquoi.** Le contenu réel définit sept champs dont trois listes déroulantes
  à options rédigées (« Cadrage et architecture », « Une idée à explorer », …).
  Ces options sont éditoriales : l'auteur doit pouvoir les ajuster sans toucher au
  code. Le nom technique de chaque champ (`nom`, kebab-case) reste fixé par
  l'agent dans le fichier.
- **Alternatives écartées.** Champs fixes dans le composant : oblige à modifier le
  code pour changer une option de liste.
