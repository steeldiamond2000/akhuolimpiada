import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin", "cyrillic"] })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Al-Xorazmiy Olimpiadasi | Online Test Platformasi",
  description:
    "Al-Xorazmiy nomidagi Urganch Davlat Universiteti tomonidan tashkil etilgan olimpiada platformasi. Dasturlash, Fizika, Suniy intellekt va Matematika fanlaridan test topshiring.",
  keywords: ["olimpiada", "al-xorazmiy", "test", "urganch", "universitet", "dasturlash", "fizika", "matematika"],
  authors: [{ name: "UrDU" }],
  openGraph: {
    title: "Al-Xorazmiy Olimpiadasi",
    description: "Online test platformasi - Dasturlash, Fizika, Suniy intellekt, Matematika",
    type: "website",
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
