import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground">
        <span>Mahamane Daouda Maiga</span>
        <Link href="/contact" className="underline underline-offset-2 hover:text-foreground">
          Contact
        </Link>
      </div>
    </footer>
  )
}
