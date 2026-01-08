import { type NextRequest, NextResponse } from "next/server"
import { query, execute } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import type { Question } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subjectId = searchParams.get("subjectId")

    let questions: Question[]
    if (subjectId) {
      questions = await query<Question>("SELECT * FROM questions WHERE subject_id = $1 ORDER BY id", [subjectId])
    } else {
      questions = await query<Question>("SELECT * FROM questions ORDER BY subject_id, id")
    }

    return NextResponse.json({ questions })
  } catch (error) {
    console.error("Get questions error:", error)
    return NextResponse.json({ error: "Server xatosi yuz berdi" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.is_admin) {
      return NextResponse.json({ error: "Admin huquqi talab qilinadi" }, { status: 403 })
    }

    const body = await request.json()
    const { subject_id, question_text, option_a, option_b, option_c, option_d, correct_option, score } = body

    if (!subject_id || !question_text || !option_a || !option_b || !option_c || !option_d || !correct_option) {
      return NextResponse.json({ error: "Barcha maydonlar to'ldirilishi shart" }, { status: 400 })
    }

    if (!["A", "B", "C", "D"].includes(correct_option)) {
      return NextResponse.json({ error: "To'g'ri javob A, B, C yoki D bo'lishi kerak" }, { status: 400 })
    }

    const result = await query<Question>(
      `INSERT INTO questions (subject_id, question_text, option_a, option_b, option_c, option_d, correct_option, score)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [subject_id, question_text, option_a, option_b, option_c, option_d, correct_option, score || 1],
    )

    return NextResponse.json({ question: result[0] }, { status: 201 })
  } catch (error) {
    console.error("Create question error:", error)
    return NextResponse.json({ error: "Server xatosi yuz berdi" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.is_admin) {
      return NextResponse.json({ error: "Admin huquqi talab qilinadi" }, { status: 403 })
    }

    const body = await request.json()
    const { id, subject_id, question_text, option_a, option_b, option_c, option_d, correct_option, score } = body

    if (!id) {
      return NextResponse.json({ error: "Savol ID kiritilishi shart" }, { status: 400 })
    }

    const result = await query<Question>(
      `UPDATE questions SET
        subject_id = COALESCE($2, subject_id),
        question_text = COALESCE($3, question_text),
        option_a = COALESCE($4, option_a),
        option_b = COALESCE($5, option_b),
        option_c = COALESCE($6, option_c),
        option_d = COALESCE($7, option_d),
        correct_option = COALESCE($8, correct_option),
        score = COALESCE($9, score)
       WHERE id = $1 RETURNING *`,
      [id, subject_id, question_text, option_a, option_b, option_c, option_d, correct_option, score],
    )

    if (result.length === 0) {
      return NextResponse.json({ error: "Savol topilmadi" }, { status: 404 })
    }

    return NextResponse.json({ question: result[0] })
  } catch (error) {
    console.error("Update question error:", error)
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
      return NextResponse.json({ error: "Savol ID kiritilishi shart" }, { status: 400 })
    }

    await execute("DELETE FROM questions WHERE id = $1", [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete question error:", error)
    return NextResponse.json({ error: "Server xatosi yuz berdi" }, { status: 500 })
  }
}
