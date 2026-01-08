import { type NextRequest, NextResponse } from "next/server"
import { query, queryOne } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import type { OlympiadSettings } from "@/lib/types"

export async function GET() {
  try {
    const settings = await queryOne<OlympiadSettings>(
      "SELECT * FROM olympiad_settings WHERE is_active = TRUE ORDER BY id DESC LIMIT 1",
    )

    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Get settings error:", error)
    return NextResponse.json({ error: "Server xatosi yuz berdi" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.is_admin) {
      return NextResponse.json({ error: "Admin huquqi talab qilinadi" }, { status: 403 })
    }

    const { start_time, duration_minutes } = await request.json()

    if (!start_time) {
      return NextResponse.json({ error: "Boshlanish vaqti kiritilishi shart" }, { status: 400 })
    }

    // Deactivate previous settings
    await query("UPDATE olympiad_settings SET is_active = FALSE")

    const result = await query<OlympiadSettings>(
      `INSERT INTO olympiad_settings (start_time, duration_minutes, is_active)
       VALUES ($1, $2, TRUE) RETURNING *`,
      [start_time, duration_minutes || 120],
    )

    return NextResponse.json({ settings: result[0] }, { status: 201 })
  } catch (error) {
    console.error("Create settings error:", error)
    return NextResponse.json({ error: "Server xatosi yuz berdi" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.is_admin) {
      return NextResponse.json({ error: "Admin huquqi talab qilinadi" }, { status: 403 })
    }

    const { id, start_time, duration_minutes } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Settings ID kiritilishi shart" }, { status: 400 })
    }

    const result = await query<OlympiadSettings>(
      `UPDATE olympiad_settings SET 
        start_time = COALESCE($2, start_time),
        duration_minutes = COALESCE($3, duration_minutes),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 RETURNING *`,
      [id, start_time, duration_minutes],
    )

    if (result.length === 0) {
      return NextResponse.json({ error: "Settings topilmadi" }, { status: 404 })
    }

    return NextResponse.json({ settings: result[0] })
  } catch (error) {
    console.error("Update settings error:", error)
    return NextResponse.json({ error: "Server xatosi yuz berdi" }, { status: 500 })
  }
}
