"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "./dashboard-header"
import { DashboardCountdown } from "./dashboard-countdown"
import { ProfileModal } from "./profile-modal"
import { ResultCard } from "./result-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Clock, FileText, ChevronRight } from "lucide-react"

interface DashboardClientProps {
  user: {
    id: number
    fio: string
    viloyat: string
    tuman: string
    maktab: string
    sinf: string
    telefon: string
    subjectName: string | null
  }
  settings: {
    startTime: string
    durationMinutes: number
  } | null
  hasSubmitted: boolean
  totalScore: number | null
  questionsCount: number
}

export function DashboardClient({ user, settings, hasSubmitted, totalScore, questionsCount }: DashboardClientProps) {
  const router = useRouter()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [canStartTest, setCanStartTest] = useState(false)

  const handleStartTest = () => {
    router.push("/dashboard/test")
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader userName={user.fio} onProfileClick={() => setIsProfileOpen(true)} />

      <main className="px-3 sm:px-4 py-4 sm:py-8">
        <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">Tanlangan fan</p>
                  <p className="text-lg sm:text-xl font-semibold truncate">{user.subjectName || "Tanlanmagan"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Show result if submitted */}
          {hasSubmitted && totalScore !== null ? (
            <ResultCard totalScore={totalScore} />
          ) : (
            <>
              {/* Countdown */}
              {settings ? (
                <DashboardCountdown
                  startTime={settings.startTime}
                  durationMinutes={settings.durationMinutes}
                  onCanStart={() => setCanStartTest(true)}
                />
              ) : (
                <Card>
                  <CardContent className="p-6 sm:p-8">
                    <div className="text-center py-4 sm:py-8">
                      <Clock className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                      <p className="text-sm sm:text-lg text-muted-foreground">Olimpiada vaqti hali belgilanmagan</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {canStartTest && (
                <Card className="border-primary overflow-hidden">
                  <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
                    <CardTitle className="flex items-center gap-2 text-primary text-base sm:text-lg">
                      <FileText className="h-5 w-5" />
                      Olimpiada boshlandi!
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Davomiyligi: {settings?.durationMinutes || 120} daqiqa
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground mb-4 py-3 px-4 bg-muted/50 rounded-lg">
                      <span>
                        Savollar: <strong className="text-foreground">{questionsCount}</strong>
                      </span>
                      <span className="text-destructive">Faqat 1 urinish</span>
                    </div>

                    <Button onClick={handleStartTest} size="lg" className="w-full h-12 text-base gap-2">
                      Olimpiadani boshlash
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </main>

      <ProfileModal user={user} isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  )
}
