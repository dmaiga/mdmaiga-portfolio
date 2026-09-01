import type { Metadata } from "next"
import { SITE_URL } from "@/lib/site"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | Mahamane Daouda Maiga",
    default: "Mahamane Daouda Maiga — Portfolio freelance",
  },
  description: "TODO — description générale du portfolio freelance.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
