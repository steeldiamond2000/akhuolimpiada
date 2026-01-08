"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { User, LogOut, Home, Menu, X } from "lucide-react"
import { toast } from "sonner"

interface DashboardHeaderProps {
  userName: string
  onProfileClick: () => void
}

export function DashboardHeader({ userName, onProfileClick }: DashboardHeaderProps) {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      toast.success("Tizimdan chiqdingiz")
      router.push("/")
    } catch (error) {
      toast.error("Xatolik yuz berdi")
    }
  }

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-mono font-bold text-sm sm:text-lg">
              AX
            </div>
            <p className="font-semibold text-sm sm:text-base">Shaxsiy kabinet</p>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-mono font-bold text-sm sm:text-lg">
            AX
          </div>
          <p className="font-semibold text-sm sm:text-base">Shaxsiy kabinet</p>
        </Link>

        <div className="hidden sm:flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Bosh sahifa
            </Link>
          </Button>

          <Button variant="ghost" size="sm" onClick={onProfileClick}>
            <User className="h-4 w-4 mr-2" />
            {userName.split(" ")[0]}
          </Button>

          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-destructive hover:text-destructive">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="sm:hidden flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted"
          aria-label="Menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden border-t bg-background p-2 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-sm"
            onClick={() => setIsMenuOpen(false)}
          >
            <Home className="h-4 w-4" />
            Bosh sahifa
          </Link>
          <button
            onClick={() => {
              onProfileClick()
              setIsMenuOpen(false)
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-sm w-full text-left"
          >
            <User className="h-4 w-4" />
            Profil ({userName.split(" ")[0]})
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-destructive/10 text-sm w-full text-left text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Chiqish
          </button>
        </div>
      )}
    </header>
  )
}
