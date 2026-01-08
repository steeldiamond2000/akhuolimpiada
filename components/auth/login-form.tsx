"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, User, Lock, AlertCircle } from "lucide-react"
import { toast } from "sonner"

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Xatolik yuz berdi")
        return
      }

      toast.success("Muvaffaqiyatli kirdingiz!")

      if (data.user.isAdmin) {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      setError("Server bilan bog'lanishda xatolik")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-4 sm:mx-auto">
      <CardHeader className="text-center space-y-2 p-4 sm:p-6">
        <div className="mx-auto flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground font-mono font-bold text-lg sm:text-xl">
          AX
        </div>
        <CardTitle className="text-xl sm:text-2xl">Tizimga kirish</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Olimpiadada qatnashish uchun login va parolingizni kiriting
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-start gap-2 text-xs sm:text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="login" className="text-sm">
              Login
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="login"
                placeholder="Loginni kiriting"
                value={formData.login}
                onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                className="pl-10 h-11 sm:h-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm">
              Parol
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Parolni kiriting"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-10 h-11 sm:h-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-11 sm:h-10 text-sm sm:text-base" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Kirish...
              </>
            ) : (
              "Kirish"
            )}
          </Button>
        </form>

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Ro'yxatdan o'tish uchun Telegram botimizdan foydalaning
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
