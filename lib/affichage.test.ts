import { describe, it, expect } from "vitest"
import {
  formatMoisAnnee,
  annee,
  capitaliser,
  formatPeriode,
  technologiesAffichees,
} from "@/lib/affichage"

describe("formatMoisAnnee", () => {
  it("rend le mois en toutes lettres et l'année", () => {
    expect(formatMoisAnnee("2026-04")).toBe("avril 2026")
    expect(formatMoisAnnee("2025-01")).toBe("janvier 2025")
  })
})

describe("annee", () => {
  it("extrait l'année", () => {
    expect(annee("2026-04")).toBe("2026")
  })
})

describe("capitaliser", () => {
  it("met la première lettre en majuscule", () => {
    expect(capitaliser("avril 2026")).toBe("Avril 2026")
  })
  it("tolère la chaîne vide", () => {
    expect(capitaliser("")).toBe("")
  })
})

describe("formatPeriode — pas de borne vide ni de tiret orphelin", () => {
  it("mission en cours (fin: null) → 'Depuis <mois année>'", () => {
    expect(formatPeriode("2026-04", null)).toBe("Depuis avril 2026")
  })
  it("mission terminée → '<Mois année> à <mois année>'", () => {
    expect(formatPeriode("2026-01", "2026-06")).toBe("Janvier 2026 à juin 2026")
  })
  it("n'utilise pas de tiret long (règle de langue du site)", () => {
    expect(formatPeriode("2026-01", "2026-06")).not.toMatch(/[–—]/)
  })
  it("ne contient jamais une borne suivie de rien", () => {
    expect(formatPeriode("2026-04", null)).not.toMatch(/(à|depuis)\s*$/i)
  })
})

describe("technologiesAffichees", () => {
  it("liste vide → aucun élément, aucun reste (l'appelant n'affiche rien)", () => {
    expect(technologiesAffichees([], 4)).toEqual({ visibles: [], reste: 0 })
  })
  it("en dessous du plafond → tout visible", () => {
    expect(technologiesAffichees(["a", "b"], 4)).toEqual({ visibles: ["a", "b"], reste: 0 })
  })
  it("au dessus du plafond → tronque et compte le reste", () => {
    expect(technologiesAffichees(["a", "b", "c", "d", "e", "f"], 4)).toEqual({
      visibles: ["a", "b", "c", "d"],
      reste: 2,
    })
  })
})
