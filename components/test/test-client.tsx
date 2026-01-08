"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Progress } from "@/components/ui/progress"
import { Clock, Send, AlertCircle, ChevronUp } from "lucide-react"
import { toast } from "sonner"

interface Question {
  id: number
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
}

interface TestClientProps {
  questions: Question[]
  endTime: string
}

export function TestClient({ questions, endTime }: TestClientProps) {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showWarningDialog, setShowWarningDialog] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  const answeredCount = Object.keys(answers).length
  const unansweredCount = questions.length - answeredCount
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const submitTest = useCallback(async () => {
    setIsSubmitting(true)

    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId: Number.parseInt(questionId),
        selectedOption,
      }))

      const res = await fetch("/api/test/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: formattedAnswers }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Xatolik yuz berdi")
        return
      }

      toast.success("Test muvaffaqiyatli yuborildi!")
      router.push("/dashboard")
    } catch (error) {
      toast.error("Server bilan bog'lanishda xatolik")
    } finally {
      setIsSubmitting(false)
    }
  }, [answers, router])

  useEffect(() => {
    const end = new Date(endTime).getTime()

    const calculateTime = () => {
      const now = new Date().getTime()
      const diff = end - now

      if (diff <= 0) {
        submitTest()
        return
      }

      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }

    calculateTime()
    const timer = setInterval(calculateTime, 1000)

    return () => clearInterval(timer)
  }, [endTime, submitTest])

  const handleSelectOption = (questionId: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }))
  }

  const handleSubmit = () => {
    if (unansweredCount > 0) {
      setShowWarningDialog(true)
    } else {
      setShowConfirmDialog(true)
    }
  }

  const formatTime = () => {
    return `${String(timeLeft.hours).padStart(2, "0")}:${String(timeLeft.minutes).padStart(2, "0")}:${String(timeLeft.seconds).padStart(2, "0")}`
  }

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ""
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [])

  const isTimeWarning = timeLeft.hours === 0 && timeLeft.minutes < 5

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-6">
          {/* Left side - logo and progress */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-mono font-bold text-sm sm:text-base">
              AX
            </div>
            <div className="hidden xs:block">
              <p className="font-medium text-xs sm:text-sm leading-tight">Test</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {answeredCount}/{questions.length}
              </p>
            </div>
          </div>

          {/* Center - Timer */}
          <div
            className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg ${isTimeWarning ? "bg-destructive/10 text-destructive" : "bg-muted"}`}
          >
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="font-mono font-bold text-sm sm:text-lg">{formatTime()}</span>
          </div>

          {/* Right side - Submit button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            size="sm"
            className="h-8 sm:h-9 px-2 sm:px-4 text-xs sm:text-sm gap-1 sm:gap-2"
          >
            <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Yuborish</span>
          </Button>
        </div>
        <Progress value={progress} className="h-1 rounded-none" />
      </header>

      <div className="sm:hidden sticky top-[57px] z-40 bg-muted/80 backdrop-blur px-3 py-2 border-b">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            Javob berildi: <strong className="text-foreground">{answeredCount}</strong>
          </span>
          <span className="text-muted-foreground">
            Qoldi: <strong className="text-foreground">{unansweredCount}</strong>
          </span>
        </div>
      </div>

      <main className="px-3 sm:px-6 py-4 sm:py-8">
        <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
          {questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              number={index + 1}
              question={question}
              selectedOption={answers[question.id]}
              onSelect={(option) => handleSelectOption(question.id, option)}
            />
          ))}

          <div className="pt-4 sm:pt-8 pb-20 sm:pb-16">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              size="lg"
              className="w-full gap-2 h-12 sm:h-11 text-base"
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              {isSubmitting ? "Yuborilmoqda..." : "Testni yuborish"}
            </Button>
          </div>
        </div>
      </main>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg sm:hidden"
          aria-label="Yuqoriga"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}

      {/* Warning Dialog */}
      <AlertDialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
        <AlertDialogContent className="mx-4 sm:mx-auto max-w-[calc(100%-2rem)] sm:max-w-lg rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Diqqat!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Siz hali {unansweredCount} ta savolga javob bermadingiz. Shunga qaramay yubormoqchimisiz?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Ortga qaytish</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowWarningDialog(false)
                submitTest()
              }}
              className="w-full sm:w-auto"
            >
              Ha, yuborish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="mx-4 sm:mx-auto max-w-[calc(100%-2rem)] sm:max-w-lg rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base sm:text-lg">Testni yuborish</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Barcha savollarga javob berildi. Testni yuborishni tasdiqlaysizmi?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Bekor qilish</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowConfirmDialog(false)
                submitTest()
              }}
              className="w-full sm:w-auto"
            >
              Yuborish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

interface QuestionCardProps {
  number: number
  question: Question
  selectedOption: string | undefined
  onSelect: (option: string) => void
}

function QuestionCard({ number, question, selectedOption, onSelect }: QuestionCardProps) {
  const options = [
    { key: "A", value: question.optionA },
    { key: "B", value: question.optionB },
    { key: "C", value: question.optionC },
    { key: "D", value: question.optionD },
  ]

  return (
    <Card className={`overflow-hidden ${selectedOption ? "ring-2 ring-primary/30" : ""}`}>
      <div className="flex gap-3 p-3 sm:p-4 border-b bg-muted/30">
        <span className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs sm:text-sm font-medium shrink-0">
          {number}
        </span>
        <p className="text-sm sm:text-base leading-relaxed flex-1">{question.questionText}</p>
      </div>

      <CardContent className="p-2 sm:p-4">
        <div className="grid gap-2 sm:gap-3">
          {options.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => onSelect(option.key)}
              className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border text-left transition-all active:scale-[0.98] ${
                selectedOption === option.key
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              <span
                className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs sm:text-sm font-medium shrink-0 ${
                  selectedOption === option.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {option.key}
              </span>
              <span className="text-sm sm:text-base">{option.value}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
