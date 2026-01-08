"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Calendar, Clock, Save } from "lucide-react"
import { toast } from "sonner"

interface Settings {
  id: number
  start_time: string
  duration_minutes: number
  is_active: boolean
}

function addFiveHours(dateStr: string): { day: string; month: string; year: string; hours: string; minutes: string } {
  const cleanStr = dateStr.replace("Z", "").replace(".000", "")
  const [datePart, timePart] = cleanStr.split("T")

  if (!datePart || !timePart) {
    return { day: "01", month: "01", year: "2026", hours: "00", minutes: "00" }
  }

  let [year, month, day] = datePart.split("-").map(Number)
  let [hours, minutes] = timePart.split(":").map(Number)

  // +5 soat qo'shamiz
  hours = hours + 5

  // Agar 24 dan oshsa, keyingi kunga o'tadi
  if (hours >= 24) {
    hours = hours - 24
    day = day + 1

    // Oyning kunlari soni
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    // Kabisa yilni tekshirish
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      daysInMonth[1] = 29
    }

    if (day > daysInMonth[month - 1]) {
      day = 1
      month = month + 1
      if (month > 12) {
        month = 1
        year = year + 1
      }
    }
  }

  return {
    day: String(day).padStart(2, "0"),
    month: String(month).padStart(2, "0"),
    year: String(year),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
  }
}

function formatDisplayDate(dateStr: string): string {
  const { day, month, year, hours, minutes } = addFiveHours(dateStr)
  return `${day}.${month}.${year} ${hours}:${minutes}`
}

function getInputValues(dateStr: string): { date: string; time: string } {
  const { day, month, year, hours, minutes } = addFiveHours(dateStr)
  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`,
  }
}

function createLocalISOString(dateStr: string, timeStr: string): string {
  return `${dateStr}T${timeStr}:00`
}

export function SettingsTab() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [startDate, setStartDate] = useState("")
  const [startTimeValue, setStartTimeValue] = useState("")
  const [durationMinutes, setDurationMinutes] = useState("120")

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/olympiad/settings")
      const data = await res.json()

      if (data.settings) {
        setSettings(data.settings)
        const { date, time } = getInputValues(data.settings.start_time)
        setStartDate(date)
        setStartTimeValue(time)
        setDurationMinutes(String(data.settings.duration_minutes))
      }
    } catch (error) {
      toast.error("Sozlamalarni yuklashda xatolik")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!startDate || !startTimeValue) {
      toast.error("Boshlanish vaqtini kiriting")
      return
    }

    setIsSaving(true)
    try {
      const isoString = createLocalISOString(startDate, startTimeValue)

      const body = {
        ...(settings && { id: settings.id }),
        start_time: isoString,
        duration_minutes: Number.parseInt(durationMinutes) || 120,
      }

      const res = await fetch("/api/olympiad/settings", {
        method: settings ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Xatolik yuz berdi")
        return
      }

      setSettings(data.settings)
      toast.success("Sozlamalar saqlandi")
    } catch (error) {
      toast.error("Xatolik yuz berdi")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Olimpiada sozlamalari</h1>
        <p className="text-muted-foreground">Olimpiada vaqti va davomiyligini belgilang (Toshkent vaqti)</p>
      </div>

      {settings && (
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Joriy sozlamalar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Boshlanish vaqti (Toshkent)</p>
                <p className="font-semibold">{formatDisplayDate(settings.start_time)}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Davomiyligi</p>
                <p className="font-semibold">{settings.duration_minutes} daqiqa</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{settings ? "Sozlamalarni yangilash" : "Yangi sozlamalar"}</CardTitle>
          <CardDescription>Olimpiada boshlanish vaqti va davomiyligini belgilang (Toshkent vaqti)</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Boshlanish sanasi
                </Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Boshlanish vaqti (Toshkent)
                </Label>
                <Input type="time" value={startTimeValue} onChange={(e) => setStartTimeValue(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Davomiyligi (daqiqa)</Label>
              <Input
                type="number"
                min="1"
                max="480"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="max-w-32"
              />
            </div>

            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Saqlash
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
