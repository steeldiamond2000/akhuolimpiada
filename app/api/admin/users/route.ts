import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

interface UserWithResult {
  id: number
  fio: string
  viloyat: string
  tuman: string
  maktab: string
  sinf: string
  telefon: string
  subject_name: string | null
  login: string
  total_score: number | null
  submitted_at: Date | null
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
        u.id, u.fio, u.viloyat, u.tuman, u.maktab, u.sinf, u.telefon, u.login,
        s.name as subject_name,
        r.total_score, r.submitted_at
      FROM users u
      LEFT JOIN subjects s ON u.subject_id = s.id
      LEFT JOIN results r ON u.id = r.user_id
      WHERE u.is_admin = FALSE
    `
    const params: any[] = []

    if (subjectId) {
      queryText += " AND u.subject_id = $1"
      params.push(subjectId)
    }

    queryText += " ORDER BY r.total_score DESC NULLS LAST, u.fio"

    const users = await query<UserWithResult>(queryText, params)

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: "Server xatosi yuz berdi" }, { status: 500 })
  }
}
