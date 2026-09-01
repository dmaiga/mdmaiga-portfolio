"use client"

import { useState } from "react"
import type { ChampContact } from "@/lib/pages-frontmatter"

type Etat = "repos" | "envoi" | "envoye" | "erreur"

/**
 * Formulaire de contact via Web3Forms (POST à la soumission uniquement — aucun
 * appel au build). Les champs sont décrits dans `content/pages/contact.mdx`.
 * Rendu seulement si la clé d'accès est fournie ; sinon la page affiche le
 * message de repli et l'e-mail (voir `app/contact/page.tsx`).
 */
export function ContactFormulaire({
  cleAcces,
  champs,
  bouton,
}: {
  cleAcces: string
  champs: ChampContact[]
  bouton: string
}) {
  const [etat, setEtat] = useState<Etat>("repos")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const donnees = new FormData(form)
    donnees.set("access_key", cleAcces)
    setEtat("envoi")
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: donnees,
      })
      if (!res.ok) throw new Error(String(res.status))
      form.reset()
      setEtat("envoye")
    } catch {
      setEtat("erreur")
    }
  }

  if (etat === "envoye") {
    return (
      <p role="status" className="rounded-md border border-border bg-muted/50 p-4 text-sm">
        Message envoyé. Je vous réponds rapidement.
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {champs.map((c) => {
        const id = `contact-${c.nom}`
        const commun = "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        return (
          <div key={c.nom}>
            <label htmlFor={id} className="block text-sm font-medium">
              {c.libelle}
              {!c.requis && <span className="text-muted-foreground"> (facultatif)</span>}
            </label>

            {c.type === "zone_texte" ? (
              <textarea id={id} name={c.nom} required={c.requis} rows={5} className={commun} />
            ) : c.type === "liste" ? (
              <select id={id} name={c.nom} required={c.requis} defaultValue="" className={commun}>
                <option value="" disabled={c.requis}>
                  {c.requis ? "Choisir…" : "Sans préférence"}
                </option>
                {c.options?.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={id}
                name={c.nom}
                type={c.type === "email" ? "email" : "text"}
                required={c.requis}
                autoComplete={c.type === "email" ? "email" : c.nom === "nom" ? "name" : "off"}
                className={commun}
              />
            )}
          </div>
        )
      })}

      <button
        type="submit"
        disabled={etat === "envoi"}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {etat === "envoi" ? "Envoi…" : bouton}
      </button>

      <p aria-live="polite" className="min-h-5 text-sm text-destructive">
        {etat === "erreur" &&
          "L'envoi a échoué. Vous pouvez m'écrire directement à l'adresse ci-dessous."}
      </p>
    </form>
  )
}
