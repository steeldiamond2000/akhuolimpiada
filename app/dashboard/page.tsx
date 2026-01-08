import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { queryOne, query } from "@/lib/db"
import type { Subject, OlympiadSettings, Result } from "@/lib/types"
import { DashboardClient } from "@/components/dashboard/dashboard-client"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.is_admin) {
    redirect("/admin")
  }

  // Get subject
  let subject: Subject | null = null
  if (user.subject_id) {
    subject = await queryOne<Subject>("SELECT * FROM subjects WHERE id = $1", [user.subject_id])
  }

  // Get olympiad settings
  const settings = await queryOne<OlympiadSettings>(
    "SELECT * FROM olympiad_settings WHERE is_active = TRUE ORDER BY id DESC LIMIT 1",
  )

  // Check if user already submitted
  const result = await queryOne<Result>("SELECT * FROM results WHERE user_id = $1", [user.id])

  // Get questions count for the subject
  let questionsCount = 0
  if (user.subject_id) {
    const countResult = await query<{ count: string }>(
      "SELECT COUNT(*) as count FROM questions WHERE subject_id = $1",
      [user.subject_id],
    )
    questionsCount = Number.parseInt(countResult[0]?.count || "0")
  }

  return (
    <DashboardClient
      user={{
        id: user.id,
        fio: user.fio,
        viloyat: user.viloyat,
        tuman: user.tuman,
        maktab: user.maktab,
        sinf: user.sinf,
        telefon: user.telefon,
        subjectName: subject?.name || null,
      }}
      settings={
        settings
          ? {
              startTime: settings.start_time.toISOString(),
              durationMinutes: settings.duration_minutes,
            }
          : null
      }
      hasSubmitted={!!result}
      totalScore={result?.total_score || null}
      questionsCount={questionsCount}
    />
  )
}
