/**
 * Helpers d'affichage purs — testés unitairement (affichage.test.ts).
 *
 * Le JSX des fiches et des cartes reste mince : toute la logique « quoi montrer
 * quand un champ optionnel est absent » vit ici, pour être vérifiable sans rendu.
 */

/** "2026-04" → "avril 2026". */
export function formatMoisAnnee(aaaaMM: string): string {
  const [annee, mois] = aaaaMM.split("-").map(Number)
  return new Date(annee, mois - 1, 1).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  })
}

/** "2026-04" → "2026". */
export function annee(aaaaMM: string): string {
  return aaaaMM.slice(0, 4)
}

export function capitaliser(texte: string): string {
  return texte.length === 0 ? texte : texte[0].toUpperCase() + texte.slice(1)
}

/**
 * Période d'une mission.
 *  - `fin === null` (mission en cours) → "Depuis avril 2026"
 *  - sinon                            → "Avril 2026 à juin 2026"
 * Jamais de tiret orphelin ni de borne vide. Pas de tiret long
 * (règle de langue du site) : on écrit « à ».
 */
export function formatPeriode(debut: string, fin: string | null): string {
  const d = formatMoisAnnee(debut)
  if (fin === null) return `Depuis ${d}`
  return `${capitaliser(d)} à ${formatMoisAnnee(fin)}`
}

/**
 * Technologies à afficher sur une carte : `max` visibles + un compteur du reste.
 * `technologies` peut être vide — l'appelant n'affiche alors aucun bloc.
 */
export function technologiesAffichees(
  technologies: string[],
  max = 4,
): { visibles: string[]; reste: number } {
  return {
    visibles: technologies.slice(0, max),
    reste: Math.max(0, technologies.length - max),
  }
}
