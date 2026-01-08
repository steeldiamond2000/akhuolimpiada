import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { queryOne } from "@/lib/db"
import type { Subject } from "@/lib/types"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 })
    }

    let subjectName = null
    if (user.subject_id) {
      const subject = await queryOne<Subject>("SELECT name FROM subjects WHERE id = $1", [user.subject_id])
      subjectName = subject?.name || null
    }

    return NextResponse.json({
      user: {
        id: user.id,
        fio: user.fio,
        viloyat: user.viloyat,
        tuman: user.tuman,
        maktab: user.maktab,
        sinf: user.sinf,
        telefon: user.telefon,
        login: user.login,
        isAdmin: user.is_admin,
        subjectId: user.subject_id,
        subjectName,
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Server xatosi yuz berdi" }, { status: 500 })
  }
}
