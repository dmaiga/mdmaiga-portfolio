import Link from "next/link"

/**
 * Lien qui choisit le bon élément selon la cible :
 *  - `http(s)://…`  → `<a target="_blank" rel="noopener noreferrer">` ;
 *  - `mailto:` / `tel:` → `<a>` simple ;
 *  - chemin interne → `<Link>` de Next.
 */
export function Lien({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: React.ReactNode
}) {
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    )
  }
  if (href.startsWith("mailto:") || href.startsWith("tel:")) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}
