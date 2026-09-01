# GIT.md

## Objectif

Git est utilisé comme outil de traçabilité technique et fonctionnelle.

L'historique doit permettre de comprendre :

* les évolutions du système ;
* les décisions prises ;
* les fonctionnalités développées ;
* les problèmes résolus ;
* les impacts métier des changements.

Les commits servent également de base pour les rapports d'activité.

---

## Langue

Les messages de commit sont rédigés en français.

---

## Convention

Format recommandé :

```text
type(module): résumé du changement

- évolution réalisée
- évolution réalisée

But : impact métier ou objectif recherché
```

---

## Types de commits

* **feat** — nouvelle fonctionnalité
* **fix** — correction ou ajustement
* **refactor** — réorganisation technique sans changement fonctionnel majeur
* **docs** — documentation
* **chore** — outillage, configuration, dépendances

Exemples :

```text
feat(realisations): index filtrable par type de projet
fix(contact): repli mailto quand le service de formulaire est injoignable
docs(architecture): modèle de contenu MDX et règles de rendu
```

---

## Philosophie

Ne pas commiter chaque modification.

Un commit doit représenter :

* une évolution cohérente ;
* une fonctionnalité terminée ;
* une correction significative ;
* une décision structurante.

Privilégier des commits orientés métier plutôt qu'orientés fichiers.

Préférer :

```text
feat(offres): gabarit d'offre répété et page /offres
```

à :

```text
update(page,components,styles)
```

---

## Ce qu'un LLM doit retenir

* Proposer des commits regroupés par fonctionnalité.
* Utiliser des messages orientés métier.
* Éviter les commits vagues ou génériques.
* Conserver assez de détails pour alimenter des rapports d'activité depuis l'historique.
* Considérer Git comme une source documentaire du projet, pas seulement un versionneur.
