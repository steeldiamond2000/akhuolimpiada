import { type NextRequest, NextResponse } from "next/server"
import { query, execute } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import type { Subject } from "@/lib/types"

export async function GET() {
  try {
    const subjects = await query<Subject>("SELECT * FROM subjects ORDER BY name")
    return NextResponse.json({ subjects })
  } catch (error) {
    console.error("Get subjects error:", error)
    return NextResponse.json({ error: "Server xatosi yuz berdi" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.is_admin) {
      return NextResponse.json({ error: "Admin huquqi talab qilinadi" }, { status: 403 })
    }

    const { name, sample_file_url } = await request.json()
    if (!name) {
      return NextResponse.json({ error: "Fan nomi kiritilishi shart" }, { status: 400 })
    }

    const existing = await query<Subject>("SELECT * FROM subjects WHERE name = $1", [name])
    if (existing.length > 0) {
      return NextResponse.json({ error: "Bu nomdagi fan mavjud" }, { status: 400 })
    }

    const result = await query<Subject>("INSERT INTO subjects (name, sample_file_url) VALUES ($1, $2) RETURNING *", [
      name,
      sample_file_url || null,
    ])

    return NextResponse.json({ subject: result[0] }, { status: 201 })
  } catch (error) {
    console.error("Create subject error:", error)
    return NextResponse.json({ error: "Server xatosi yuz berdi" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.is_admin) {
      return NextResponse.json({ error: "Admin huquqi talab qilinadi" }, { status: 403 })
    }

    const { id, sample_file_url } = await request.json()
    if (!id) {
      return NextResponse.json({ error: "Fan ID kiritilishi shart" }, { status: 400 })
    }

    const result = await query<Subject>("UPDATE subjects SET sample_file_url = $1 WHERE id = $2 RETURNING *", [
      sample_file_url || null,
      id,
    ])

    if (result.length === 0) {
      return NextResponse.json({ error: "Fan topilmadi" }, { status: 404 })
    }

    return NextResponse.json({ subject: result[0] })
  } catch (error) {
    console.error("Update subject error:", error)
    return NextResponse.json({ error: "Server xatosi yuz berdi" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.is_admin) {
      return NextResponse.json({ error: "Admin huquqi talab qilinadi" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Fan ID kiritilishi shart" }, { status: 400 })
    }

    await execute("DELETE FROM subjects WHERE id = $1", [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete subject error:", error)
    return NextResponse.json({ error: "Server xatosi yuz berdi" }, { status: 500 })
  }
}
