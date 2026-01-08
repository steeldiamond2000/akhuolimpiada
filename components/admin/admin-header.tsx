"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Home, Menu } from "lucide-react"
import { toast } from "sonner"

interface AdminHeaderProps {
  userName: string
  onMenuClick: () => void
}

export function AdminHeader({ userName, onMenuClick }: AdminHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      toast.success("Tizimdan chiqdingiz")
      router.push("/")
    } catch (error) {
      toast.error("Xatolik yuz berdi")
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-mono font-bold text-lg">
              AX
            </div>
            <div className="hidden sm:block">
              <p className="font-semibold text-foreground leading-tight">Admin Panel</p>
              <p className="text-xs text-muted-foreground">Olimpiada boshqaruvi</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Bosh sahifa</span>
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{userName.split(" ")[0]}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem disabled>
                <User className="h-4 w-4 mr-2" />
                Admin
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Chiqish
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
