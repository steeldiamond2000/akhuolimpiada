import { NextResponse } from "next/server"
import { queryOne } from "@/lib/db"
import { getSession, getCurrentUser } from "@/lib/auth"
import type { Result } from "@/lib/types"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 })
    }

    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Foydalanuvchi topilmadi" }, { status: 400 })
    }

    const result = await queryOne<Result>("SELECT * FROM results WHERE user_id = $1", [user.id])

    if (!result) {
      return NextResponse.json({ result: null })
    }

    return NextResponse.json({
      result: {
        totalScore: result.total_score,
        submittedAt: result.submitted_at,
      },
    })
  } catch (error) {
    console.error("Get result error:", error)
    return NextResponse.json({ error: "Server xatosi yuz berdi" }, { status: 500 })
  }
}
