import { NextResponse } from "next/server"
import { query } from "@/lib/db"

interface ResultWithUser {
  id: number
  fio: string
  viloyat: string
  tuman: string
  maktab: string
  sinf: string
  subject_name: string
  total_score: number
}

export async function GET() {
  try {
    // Olimpiada tugaganligini tekshirish
    const settingsResult = await query<{ start_time: Date; duration_minutes: number }>(
      "SELECT start_time, duration_minutes FROM olympiad_settings WHERE is_active = true LIMIT 1",
    )

    if (settingsResult.length === 0) {
      return NextResponse.json({ results: [], message: "Olimpiada sozlamalari topilmadi" })
    }

    const settings = settingsResult[0]
    const startTime = new Date(settings.start_time).getTime()
    const endTime = startTime + settings.duration_minutes * 60 * 1000
    const now = Date.now()

    // Faqat olimpiada tugagandan keyin natijalarni ko'rsatish
    if (now < endTime) {
      return NextResponse.json({ results: [], message: "Olimpiada hali tugamagan" })
    }

    const results = await query<ResultWithUser>(`
      SELECT
        r.id,
        u.fio, u.viloyat, u.tuman, u.maktab, u.sinf,
        s.name as subject_name,
        r.total_score
      FROM results r
      JOIN users u ON r.user_id = u.id
      JOIN subjects s ON r.subject_id = s.id
      ORDER BY r.total_score DESC, r.submitted_at ASC
    `)

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Get public results error:", error)
    return NextResponse.json({ error: "Server xatosi yuz berdi" }, { status: 500 })
  }
}
