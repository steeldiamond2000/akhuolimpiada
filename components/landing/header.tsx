"use client"

import Link from "next/link"
import Image from "next/image"
import { Mail, Phone } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar with social links and contact info */}
      <div className="bg-[#0077C8]">
        <div className="container mx-auto flex items-center justify-between px-4 py-2">
          {/* Social media links - left */}
          <div className="flex items-center gap-4">
            <a
              href="https://t.me/alxorazmiyuni"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-white hover:text-white/80 transition-colors"
            >
              Telegram
            </a>
            <a
              href="https://facebook.com/alkhwarizmi.uni"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-white hover:text-white/80 transition-colors"
            >
              Facebook
            </a>
            <a
              href="https://instagram.com/alkhwarizmi.uni"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-white hover:text-white/80 transition-colors"
            >
              Instagram
            </a>
          </div>
          {/* Contact info - right */}
          <div className="hidden sm:flex items-center gap-4">
            <a
              href="mailto:info@akhu.uz"
              className="flex items-center gap-1.5 text-xs font-bold text-white hover:text-white/80 transition-colors"
            >
              <Mail className="h-3 w-3" />
              info@akhu.uz
            </a>
            <a
              href="tel:+998556020002"
              className="flex items-center gap-1.5 text-xs font-bold text-white hover:text-white/80 transition-colors"
            >
              <Phone className="h-3 w-3" />
              +998 (55) 602-00-02
            </a>
          </div>
        </div>
      </div>

      {/* Main header with logo */}
      <div className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto flex h-14 sm:h-16 items-center px-4">
          <a 
            href="https://akhu.uz" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 sm:gap-3"
          >
            <Image
              src="/logo.png"
              alt="Al-Khwarizmi University"
              width={56}
              height={56}
              className="h-10 w-10 sm:h-14 sm:w-14 object-contain"
            />
            <span className="font-semibold text-[#0077C8] text-base sm:text-lg">
              Al-Khwarizmi University
            </span>
          </a>
        </div>
      </div>
    </header>
  )
}
