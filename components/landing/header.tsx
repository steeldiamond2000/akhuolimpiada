"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, ChevronDown, FileText, X, Mail, Phone, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Subject {
  id: number
  name: string
  sample_file_url: string | null
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true)

  useEffect(() => {
    setMounted(true)
    fetchSubjects()
  }, [])

  const fetchSubjects = async () => {
    try {
      const res = await fetch("/api/subjects")
      const data = await res.json()
      setSubjects(data.subjects || [])
    } catch (error) {
      console.error("Fanlarni yuklashda xatolik:", error)
    } finally {
      setIsLoadingSubjects(false)
    }
  }

  // Google Drive URLni yuklab olish linkiga o'girish
  const getDownloadUrl = (url: string | null) => {
    if (!url) return null
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
    if (match) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`
    }
    return url
  }

  // Faqat namunaviy fayli bor fanlar
  const subjectsWithFiles = subjects.filter((s) => s.sample_file_url)

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="hidden md:block bg-primary">
        <div className="container mx-auto flex items-center justify-between px-4 py-2">
          {/* Ijtimoiy tarmoqlar - chap */}
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
          {/* Email va telefon - o'ng */}
          <div className="flex items-center gap-4">
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

      <div className="bg-white border-b border-border">
        <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 ml-[3px]">
            <Image
              src="/logo.png"
              alt="Al-Xorazmiy Olimpiadasi"
              width={56}
              height={56}
              className="h-10 w-10 sm:h-14 sm:w-14 object-contain"
            />
            <div className="hidden xs:block">
              <p className="font-semibold text-foreground leading-tight text-sm sm:text-base">Al-Xorazmiy</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Olimpiadasi</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Biz haqimizda
            </Link>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                disabled={isLoadingSubjects}
              >
                Namunaviy savollar
                <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border bg-popover p-1 shadow-lg z-50">
                    {isLoadingSubjects ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      </div>
                    ) : subjectsWithFiles.length === 0 ? (
                      <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                        Hozircha namunaviy fayllar mavjud emas
                      </div>
                    ) : (
                      subjectsWithFiles.map((subject) => (
                        <a
                          key={subject.id}
                          href={getDownloadUrl(subject.sample_file_url) || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                        >
                          <FileText className="h-4 w-4" />
                          {subject.name}
                        </a>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>

            <Button asChild size="sm">
              <Link href="/login">Kirish</Link>
            </Button>
          </nav>

          {/* Mobile menu button */}
          {mounted && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex items-center justify-center h-9 w-9 rounded-lg hover:bg-muted transition-colors"
              aria-label="Menyu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>

      {mounted && isMenuOpen && (
        <div className="fixed inset-0 top-14 sm:top-16 z-40 bg-white border-t border-border md:hidden">
          <nav className="flex flex-col p-4 space-y-1 bg-white">
            {/* Kontakt ma'lumotlari */}
            <div className="flex flex-col gap-2 px-4 py-3 mb-2 bg-primary rounded-lg">
              <a href="mailto:info@akhu.uz" className="flex items-center gap-2 text-sm font-bold text-white">
                <Mail className="h-4 w-4" />
                info@akhu.uz
              </a>
              <a href="tel:+998556020002" className="flex items-center gap-2 text-sm font-bold text-white">
                <Phone className="h-4 w-4" />
                +998 (55) 602-00-02
              </a>
            </div>

            {/* Ijtimoiy tarmoqlar */}
            <div className="flex items-center gap-4 px-4 py-3 mb-2">
              <a
                href="https://t.me/alxorazmiyuni"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-primary hover:text-primary/80 transition-colors"
              >
                Telegram
              </a>
              <a
                href="https://facebook.com/alkhwarizmi.uni"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-primary hover:text-primary/80 transition-colors"
              >
                Facebook
              </a>
              <a
                href="https://instagram.com/alkhwarizmi.uni"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-primary hover:text-primary/80 transition-colors"
              >
                Instagram
              </a>
            </div>

            <Link
              href="/about"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center px-4 py-3 text-base font-medium rounded-lg hover:bg-muted transition-colors"
            >
              Biz haqimizda
            </Link>

            <div className="px-4 py-3">
              <p className="text-sm font-medium text-muted-foreground mb-2">Namunaviy savollar</p>
              <div className="space-y-1 pl-2">
                {isLoadingSubjects ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : subjectsWithFiles.length === 0 ? (
                  <p className="px-3 py-2 text-sm text-muted-foreground">Hozircha namunaviy fayllar mavjud emas</p>
                ) : (
                  subjectsWithFiles.map((subject) => (
                    <a
                      key={subject.id}
                      href={getDownloadUrl(subject.sample_file_url) || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-muted transition-colors"
                    >
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {subject.name}
                    </a>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 px-4">
              <Button asChild className="w-full" size="lg" onClick={() => setIsMenuOpen(false)}>
                <Link href="/login">Kirish</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
