"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface DashboardCountdownProps {
  startTime: string
  durationMinutes: number
  onCanStart: () => void
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function DashboardCountdown({ startTime, durationMinutes, onCanStart }: DashboardCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [status, setStatus] = useState<"waiting" | "active" | "ended">("waiting")
  const [mounted, setMounted] = useState(false)

  const handleCanStart = useCallback(() => {
    onCanStart()
  }, [onCanStart])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const start = new Date(startTime).getTime()
    const end = start + durationMinutes * 60 * 1000

    const calculateTime = () => {
      const now = Date.now()

      if (now >= end) {
        setStatus("ended")
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      if (now >= start) {
        setStatus("active")
        handleCanStart()
        const remaining = end - now
        setTimeLeft({
          days: 0,
          hours: Math.floor(remaining / (1000 * 60 * 60)),
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

    calculateTime()
    const timer = setInterval(calculateTime, 1000)

    return () => clearInterval(timer)
  }, [mounted, startTime, durationMinutes, handleCanStart])

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Yuklanmoqda...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {["Kun", "Soat", "Daqiqa", "Soniya"].map((label) => (
              <div key={label} className="text-center p-3 rounded-lg bg-muted">
                <div className="text-3xl font-bold font-mono text-primary">00</div>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={status === "active" ? "border-primary" : status === "ended" ? "border-destructive" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock
            className={`h-5 w-5 ${status === "active" ? "text-primary" : status === "ended" ? "text-destructive" : "text-muted-foreground"}`}
          />
          {status === "waiting" && "Olimpiada boshlanishiga"}
          {status === "active" && "Olimpiada tugashiga"}
          {status === "ended" && "Olimpiada tugadi"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {status !== "ended" && (
          <>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {[
                { value: timeLeft.days, label: "Kun" },
                { value: timeLeft.hours, label: "Soat" },
                { value: timeLeft.minutes, label: "Daqiqa" },
                { value: timeLeft.seconds, label: "Soniya" },
              ].map((item) => (
                <div key={item.label} className="text-center p-3 rounded-lg bg-muted">
                  <div className="text-3xl font-bold font-mono text-primary">{String(item.value).padStart(2, "0")}</div>
                  <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Boshlanish vaqti: {new Date(startTime).toLocaleString("uz-UZ")}
            </p>
          </>
        )}

        {status === "ended" && (
          <div className="text-center py-8">
            <p className="text-3xl font-bold text-destructive mb-4">OLIMPIADA TUGADI</p>
            <p className="text-muted-foreground">Natijalarni kutib turing.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
