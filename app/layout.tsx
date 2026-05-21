import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "EcoFaol Talabalar | Al-Khwarizmi University",
  description:
    "Al-Khwarizmi University talabalari tomonidan amalga oshirilayotgan ekologik tadbirlar, hasharlar, daraxt ekish aksiyalari va ekologik seminarlar platformasi.",
  keywords: ["ekologiya", "al-khwarizmi", "universitet", "talabalar", "yashil kampus", "ekologik tadbirlar"],
  authors: [{ name: "Al-Khwarizmi University IT Department" }],
  openGraph: {
    title: "EcoFaol Talabalar",
    description: "Ekologik faoliyat platformasi - Al-Khwarizmi University",
    type: "website",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0077C8",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz" className="bg-white">
      <body className={`${inter.className} antialiased bg-white`}>
        {children}
      </body>
    </html>
  )
}
