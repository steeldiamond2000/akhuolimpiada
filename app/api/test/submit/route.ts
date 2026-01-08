import { type NextRequest, NextResponse } from "next/server"
import { query, queryOne, execute } from "@/lib/db"
import { getSession, getCurrentUser } from "@/lib/auth"
import type { Question, Result } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 })
    }

    const user = await getCurrentUser()
    if (!user || !user.subject_id) {
      return NextResponse.json({ error: "Foydalanuvchi yoki fan topilmadi" }, { status: 400 })
    }

    // Check if already submitted
    const existingResult = await queryOne<Result>("SELECT * FROM results WHERE user_id = $1 AND subject_id = $2", [
      user.id,
      user.subject_id,
    ])

    if (existingResult) {
      return NextResponse.json({ error: "Siz allaqachon test topshirgansiz", result: existingResult }, { status: 400 })
    }

    const { answers } = await request.json()

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Javoblar kiritilishi shart" }, { status: 400 })
    }

    // Get all questions for the subject
    const questions = await query<Question>("SELECT * FROM questions WHERE subject_id = $1", [user.subject_id])

    let totalScore = 0

    // Save answers and calculate score
    for (const answer of answers) {
      const { questionId, selectedOption } = answer

      // Save answer
      await execute(
        `INSERT INTO answers (user_id, question_id, selected_option)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, question_id) DO UPDATE SET selected_option = $3`,
        [user.id, questionId, selectedOption],
      )

      // Calculate score
      const question = questions.find((q) => q.id === questionId)
      if (question && question.correct_option === selectedOption) {
        totalScore += question.score
      }
    }

    // Save result
    const result = await query<Result>(
      `INSERT INTO results (user_id, subject_id, total_score)
       VALUES ($1, $2, $3) RETURNING *`,
      [user.id, user.subject_id, totalScore],
    )

    return NextResponse.json({
      success: true,
      result: {
        totalScore,
        submittedAt: result[0].submitted_at,
      },
    })
  } catch (error) {
    console.error("Submit test error:", error)
    return NextResponse.json({ error: "Server xatosi yuz berdi" }, { status: 500 })
  }
}
