import type { ReactNode } from "react"

/**
 * Couche « pour aller plus loin » d'une fiche.
 *
 * Contraintes (étape 3) :
 *  - repliée par défaut, SANS JavaScript → élément natif <details> (aucun `open`) ;
 *  - clavier : géré nativement par <summary> (Entrée / Espace) ;
 *  - lecteur d'écran : <details>/<summary> est annoncé comme groupe dépliable ;
 *  - indexation : le contenu reste dans le HTML (le navigateur le masque
 *    visuellement, il n'est pas retiré du DOM) → indexable et trouvable par
 *    recherche sur un terme propre à cette couche.
 *
 * Composant serveur pur : pas de "use client", pas d'état.
 */
export function Approfondir({ children }: { children: ReactNode }) {
  return (
    <details className="group mt-10 rounded-lg border border-border bg-card">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
        <span>Approfondir</span>
        <span
          aria-hidden="true"
          className="text-muted-foreground transition-transform duration-200 group-open:rotate-180"
        >
          ▾
        </span>
      </summary>
      <div className="border-t border-border px-4 py-4 text-sm leading-relaxed [&>*+*]:mt-4">
        {children}
      </div>
    </details>
  )
}
