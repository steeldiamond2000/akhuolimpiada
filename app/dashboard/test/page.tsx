import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { query, queryOne } from "@/lib/db"
import type { Question, OlympiadSettings, Result } from "@/lib/types"
import { TestClient } from "@/components/test/test-client"

export default async function TestPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.is_admin) {
    redirect("/admin")
  }

  if (!user.subject_id) {
    redirect("/dashboard")
  }

  // Check if already submitted
  const existingResult = await queryOne<Result>("SELECT * FROM results WHERE user_id = $1", [user.id])

  if (existingResult) {
    redirect("/dashboard")
  }

  // Check if olympiad is active
  const settings = await queryOne<OlympiadSettings>(
    "SELECT * FROM olympiad_settings WHERE is_active = TRUE ORDER BY id DESC LIMIT 1",
  )

  if (!settings) {
    redirect("/dashboard")
  }

  const now = new Date()
  const startTime = new Date(settings.start_time)
  const endTime = new Date(startTime.getTime() + settings.duration_minutes * 60 * 1000)

  if (now < startTime || now > endTime) {
    redirect("/dashboard")
  }

  // Get questions
  const questions = await query<Question>("SELECT * FROM questions WHERE subject_id = $1 ORDER BY id", [
    user.subject_id,
  ])

  return (
    <TestClient
      questions={questions.map((q) => ({
        id: q.id,
        questionText: q.question_text,
        optionA: q.option_a,
        optionB: q.option_b,
        optionC: q.option_c,
        optionD: q.option_d,
      }))}
      endTime={endTime.toISOString()}
    />
  )
}
