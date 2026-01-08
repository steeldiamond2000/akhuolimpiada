"use client"

import { BookOpen, FileQuestion, Settings, Trophy, Users, X } from "lucide-react"
import { cn } from "@/lib/utils"

type TabType = "subjects" | "questions" | "settings" | "results" | "users"

interface AdminSidebarProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { id: "subjects" as const, label: "Fanlar", icon: BookOpen },
  { id: "questions" as const, label: "Savollar", icon: FileQuestion },
  { id: "settings" as const, label: "Sozlamalar", icon: Settings },
  { id: "results" as const, label: "Natijalar", icon: Trophy },
  { id: "users" as const, label: "Foydalanuvchilar", icon: Users },
]

export function AdminSidebar({ activeTab, onTabChange, isOpen, onClose }: AdminSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-14 sm:top-16 z-40 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] w-64 border-r border-border bg-background transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b lg:hidden">
        <span className="font-semibold text-sm">Menu</span>
        <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted">
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="space-y-1 p-3 sm:p-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange(item.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium transition-colors",
              activeTab === item.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
