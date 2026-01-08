"use client"

import { useState, useEffect } from "react"
import { Calendar, Trophy, Medal, Award, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface Settings {
  start_time: string
  duration_minutes: number
}

interface Result {
  id: number
  fio: string
  viloyat: string
  tuman: string
  maktab: string
  sinf: string
  subject_name: string
  total_score: number
}

type OlympiadStatus = "waiting" | "active" | "ended"

export function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [settings, setSettings] = useState<Settings | null>(null)
  const [status, setStatus] = useState<OlympiadStatus>("waiting")
  const [results, setResults] = useState<Result[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  const ITEMS_PER_PAGE = 20

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/olympiad/settings")
        const data = await res.json()
        if (data.settings) {
          setSettings(data.settings)
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSettings()
  }, [])

  useEffect(() => {
    if (status === "ended") {
      fetchResults()
    }
  }, [status])

  const fetchResults = async () => {
    try {
      const res = await fetch("/api/public/results")
      const data = await res.json()
      if (data.results) {
        setResults(data.results)
      }
    } catch (error) {
      console.error("Failed to fetch results:", error)
    }
  }

  useEffect(() => {
    if (!mounted || !settings) return

    const start = new Date(settings.start_time).getTime()
    const end = start + settings.duration_minutes * 60 * 1000

    const calculateTimeLeft = () => {
      const now = Date.now()

      if (now >= end) {
        setStatus("ended")
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      if (now >= start) {
        setStatus("active")
        const remaining = end - now
        setTimeLeft({
          days: Math.floor(remaining / (1000 * 60 * 60 * 24)),
          hours: Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((remaining % (1000 * 60)) / 1000),
        })
        return
      }

      setStatus("waiting")
      const diff = start - now
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [mounted, settings])

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE)
  const paginatedResults = results.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const getRankIcon = (index: number) => {
    const rank = (currentPage - 1) * ITEMS_PER_PAGE + index + 1
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />
    return <span className="w-5 text-center font-semibold text-muted-foreground">{rank}</span>
  }

  if (isLoading || !mounted) {
    return (
      <section className="py-10 sm:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-6 sm:h-8 w-48 sm:w-64 bg-muted rounded" />
            <div className="h-20 sm:h-24 w-full max-w-2xl bg-muted rounded" />
          </div>
        </div>
      </section>
    )
  }

  if (status === "ended") {
    return (
      <section className="py-10 sm:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-destructive">OLIMPIADA TUGADI</h2>
            <p className="text-muted-foreground text-base sm:text-lg">Quyida natijalar e'lon qilindi</p>
          </div>

          {results.length > 0 ? (
            <div className="max-w-4xl mx-auto">
              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {paginatedResults.map((result, index) => {
                  const rank = (currentPage - 1) * ITEMS_PER_PAGE + index + 1
                  return (
                    <Card key={result.id} className={rank <= 3 ? "border-primary/50" : ""}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                            {getRankIcon(index)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-semibold text-sm truncate">{result.fio}</p>
                              <span className="flex-shrink-0 font-bold text-primary text-lg">{result.total_score}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{result.subject_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {result.viloyat}, {result.maktab}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Desktop Table */}
              <Card className="hidden md:block">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">F.I.O</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Fan</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Viloyat</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Maktab</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold">Ball</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {paginatedResults.map((result, index) => (
                          <tr key={result.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3">{getRankIcon(index)}</td>
                            <td className="px-4 py-3 font-medium">{result.fio}</td>
                            <td className="px-4 py-3 text-muted-foreground">{result.subject_name}</td>
                            <td className="px-4 py-3 text-muted-foreground">{result.viloyat}</td>
                            <td className="px-4 py-3 text-muted-foreground text-sm">{result.maktab}</td>
                            <td className="px-4 py-3 text-right">
                              <span className="font-bold text-primary">{result.total_score}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 px-1">
                  <p className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1">
                    Jami {results.length} natija, {currentPage}/{totalPages} sahifa
                  </p>
                  <div className="flex gap-2 order-1 sm:order-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="hidden sm:inline">Oldingi</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="gap-1"
                    >
                      <span className="hidden sm:inline">Keyingi</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Natijalar hali e'lon qilinmagan</p>
            </div>
          )}
        </div>
      </section>
    )
  }

  return (
    <section className="py-10 sm:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold">
            {status === "waiting" && "Olimpiada boshlanishiga"}
            {status === "active" && "Olimpiada tugashiga"}
          </h2>
          {settings && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm sm:text-base">
              <Calendar className="h-4 w-4" />
              <span>
                {status === "waiting" ? "Boshlanish: " : "Tugash: "}
                {new Date(
                  status === "waiting"
                    ? settings.start_time
                    : new Date(settings.start_time).getTime() + settings.duration_minutes * 60 * 1000,
                ).toLocaleString("uz-UZ")}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg sm:max-w-2xl mx-auto">
          {[
            { value: timeLeft.days, label: "Kun" },
            { value: timeLeft.hours, label: "Soat" },
            { value: timeLeft.minutes, label: "Daqiqa" },
            { value: timeLeft.seconds, label: "Soniya" },
          ].map((item) => (
            <Card key={item.label} className={`text-center ${status === "active" ? "border-primary" : ""}`}>
              <CardContent className="px-2 py-3 sm:pt-6 sm:pb-4 sm:px-4">
                <div
                  className={`text-2xl sm:text-4xl md:text-5xl font-bold font-mono ${status === "active" ? "text-primary" : "text-foreground"}`}
                >
                  {String(item.value).padStart(2, "0")}
                </div>
                <p className="text-[10px] sm:text-sm text-muted-foreground mt-1 sm:mt-2">{item.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {!settings && (
          <p className="text-center text-muted-foreground mt-6 sm:mt-8 text-sm sm:text-base">
            Olimpiada vaqti hali belgilanmagan
          </p>
        )}
      </div>
    </section>
  )
}
