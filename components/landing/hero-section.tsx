"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Trophy, Clock } from "lucide-react"

interface Stats {
  subjectsCount: number
  durationHours: number
}

export function HeroSection() {
  const [stats, setStats] = useState<Stats>({ subjectsCount: 4, durationHours: 2 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [subjectsRes, settingsRes] = await Promise.all([fetch("/api/subjects"), fetch("/api/olympiad/settings")])

      const subjectsData = await subjectsRes.json()
      const settingsData = await settingsRes.json()

      setStats({
        subjectsCount: subjectsData.subjects?.length || 4,
        durationHours: settingsData.settings?.duration_minutes
          ? Math.round((settingsData.settings.duration_minutes / 60) * 10) / 10
          : 2,
      })
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  return (
    <section className="relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/10 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 py-10 sm:py-16 lg:py-24">
        <div className="flex flex-col-reverse lg:flex-row lg:items-center gap-8 lg:gap-12">
          {/* Content */}
          <div className="flex-1 space-y-6 lg:space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Ro'yxatdan o'tish ochiq
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-balance">
              Al-Xorazmiy
              <span className="text-primary block">Olimpiadasi</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
              Al-Xorazmiy universiteti tomonidan tashkil etilgan respublika miqyosidagi
              olimpiada. Dasturlash, Fizika, Suniy intellekt va Matematika fanlaridan o'z bilimlaringizni sinang.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button asChild size="lg" className="gap-2 w-full sm:w-auto">
                <Link href="/login">
                  Olimpiadaga kirish
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                <Link href="/about">Batafsil ma'lumot</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-border">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 sm:gap-2 text-primary">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-xl sm:text-2xl font-bold">{mounted ? stats.subjectsCount : 4}</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">Fanlar</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 sm:gap-2 text-primary">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-xl sm:text-2xl font-bold">{mounted ? stats.durationHours : 2}</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">Soat</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 sm:gap-2 text-primary">
                  <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-xl sm:text-2xl font-bold">1</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">Bosqich</p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative flex-1 w-full max-w-md mx-auto lg:max-w-none lg:mx-0">
            <div className="absolute -inset-4 sm:-inset-5 bg-primary/5 rounded-2xl sm:rounded-3xl -rotate-3" />
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl aspect-[4/3] lg:aspect-auto">
              <Image
                src="/universitet.jpg"
                alt="Al Xorazmiy universiteti"
                width={600}
                height={400}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
