# LANGUE.md

Règles de langue pour **tout le contenu visible du site** : réalisations, offres,
pages, libellés d'interface, messages, valeurs par défaut. Fournies par l'auteur
avec le contenu des pages (2026-09-01).

1. **Aucun emoji**, nulle part. Ni titres, ni listes, ni boutons.
2. **Pas de tiret long (—) ni de tiret double (--).** Utiliser la virgule, le
   deux-points, la parenthèse ou une phrase séparée. Le tiret simple (-) reste
   autorisé dans les mots composés et les fourchettes de dates.
3. **Langue naturelle, parlée à voix haute.** Écrire comme on expliquerait à
   quelqu'un en face de soi. Si une phrase ne se dit pas à l'oral, la réécrire.
4. **Une idée par phrase.** 25 mots maximum dans les textes destinés aux clients.
5. **Verbes d'action plutôt que noms en -tion.** Écrire ce qui se passe, pas ce
   qui est mis en œuvre.
6. **Un chiffre plutôt qu'un adjectif.** Pas de robuste, évolutif, performant,
   innovant, optimisé.
7. **Aucun sigle** dans les textes visibles par un lecteur non technique.

## Portée

- Le contenu éditorial est rédigé par l'auteur. L'agent ne le réécrit pas.
- Ces règles s'appliquent à tout texte **produit par l'agent** : libellés de
  gabarit, messages d'erreur, placeholders, helpers d'affichage
  (ex. `formatPeriode` écrit « Janvier 2026 à juin 2026 », pas de tiret).
- Marqueurs de suivi tolérés hors contenu publié : `TODO —` (placeholder à
  remplir) et `[VÉRIFIER : …]` (valeur à confirmer avant publication). Le test
  `lib/content-guards.test.ts` interdit ces marqueurs dans une réalisation, une
  offre ou un bloc de page **non brouillon**.
