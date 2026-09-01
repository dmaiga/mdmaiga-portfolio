"use client"

import { useState } from "react"

type Etat = "repos" | "envoi" | "envoye" | "erreur"

/**
 * Formulaire de contact via Web3Forms (POST à la soumission uniquement — aucun
 * appel au build). Rendu seulement si la clé d'accès est fournie ; sinon la page
 * affiche l'e-mail à la place (voir `app/contact/page.tsx`).
 */
export function ContactFormulaire({ cleAcces }: { cleAcces: string }) {
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
      <p
        role="status"
        className="rounded-md border border-border bg-muted/50 p-4 text-sm"
      >
        Message envoyé. Je vous réponds rapidement.
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="contact-nom" className="block text-sm font-medium">
          Nom
        </label>
        <input
          id="contact-nom"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={etat === "envoi"}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {etat === "envoi" ? "Envoi…" : "Envoyer"}
      </button>

      <p aria-live="polite" className="min-h-5 text-sm text-destructive">
        {etat === "erreur" && "L'envoi a échoué. Vous pouvez m'écrire directement à l'adresse ci-dessous."}
      </p>
    </form>
  )
}
