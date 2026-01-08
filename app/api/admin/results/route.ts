import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

interface ResultWithUser {
  id: number
  user_id: number
  fio: string
  viloyat: string
  tuman: string
  maktab: string
  sinf: string
  subject_name: string
  total_score: number
  submitted_at: Date
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.is_admin) {
      return NextResponse.json({ error: "Admin huquqi talab qilinadi" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const subjectId = searchParams.get("subjectId")

    let queryText = `
      SELECT 
        r.id, r.user_id, r.total_score, r.submitted_at,
        u.fio, u.viloyat, u.tuman, u.maktab, u.sinf,
        s.name as subject_name
      FROM results r
      JOIN users u ON r.user_id = u.id
      JOIN subjects s ON r.subject_id = s.id
    `
    const params: any[] = []

    if (subjectId) {
      queryText += " WHERE r.subject_id = $1"
      params.push(subjectId)
    }

    queryText += " ORDER BY r.total_score DESC, r.submitted_at"

    const results = await query<ResultWithUser>(queryText, params)

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Get results error:", error)
    return NextResponse.json({ error: "Server xatosi yuz berdi" }, { status: 500 })
  }
}
