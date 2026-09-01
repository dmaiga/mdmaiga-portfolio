import type { Metadata } from "next"
import { getContact } from "@/lib/contenu-pages"
import { CLE_FORMULAIRE_CONTACT } from "@/lib/site"
import { ContactFormulaire } from "@/components/contact-formulaire"
import { Lien } from "@/components/lien"

export const metadata: Metadata = {
  title: "Contact",
  description: "TODO — description de la page contact.",
}

export default function ContactPage() {
  const c = getContact()

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">{c.titre}</h1>

      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
        {c.intro.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      <div className="mt-8">
        {CLE_FORMULAIRE_CONTACT ? (
          <ContactFormulaire cleAcces={CLE_FORMULAIRE_CONTACT} />
        ) : (
          <p className="rounded-md border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
            Le formulaire n&apos;est pas encore configuré. Écrivez-moi directement à
            l&apos;adresse ci-dessous.
          </p>
        )}
      </div>

      <div className="mt-8 border-t border-border pt-6 text-sm">
        <a
          href={`mailto:${c.email}`}
          className="font-medium underline underline-offset-2 hover:text-brand"
        >
          {c.email}
        </a>

        {c.liens.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            {c.liens.map((l) => (
              <li key={l.href}>
                <Lien
                  href={l.href}
                  className="underline underline-offset-2 hover:text-brand"
                >
                  {l.libelle}
                </Lien>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
