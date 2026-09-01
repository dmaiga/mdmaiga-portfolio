/**
 * Source UNIQUE des libellés de taxonomie.
 *
 * Aucune recopie ailleurs — index, filtres, cartes, images Open Graph lisent
 * ces objets. Toute divergence est un bug de documentation.
 *
 * Deux dimensions distinctes (voir docs/DECISIONS.md ADR-006) :
 *  - `type`  : nature perçue par le visiteur, FILTRANTE sur /realisations ;
 *  - `cadre` : cadre d'intervention, AFFICHÉ mais NON filtrant.
 */

export const TYPES = {
  "plateforme-metier": "Plateforme métier",
  decisionnel: "Pilotage et décisionnel",
  institutionnel: "Projet institutionnel",
  laboratoire: "Laboratoire",
} as const

export type TypeRealisation = keyof typeof TYPES

export const CADRES = {
  salarie: "En poste",
  independant: "Mission indépendante",
  academique: "Projet académique",
} as const

export type CadreRealisation = keyof typeof CADRES

/** Ordre d'affichage des `type` dans le filtre de l'index. */
export const TYPES_ORDRE = Object.keys(TYPES) as TypeRealisation[]

export function estType(valeur: string): valeur is TypeRealisation {
  return valeur in TYPES
}

export function estCadre(valeur: string): valeur is CadreRealisation {
  return valeur in CADRES
}
