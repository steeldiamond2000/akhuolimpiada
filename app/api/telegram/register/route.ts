import { type NextRequest, NextResponse } from "next/server"
import { query, queryOne } from "@/lib/db"
import { hashPassword, generateCredentials } from "@/lib/auth"
import type { Subject } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { telegram_id, fio, viloyat, tuman, maktab, sinf, telefon, subject_name } = body

    // Validate required fields
    if (!telegram_id || !fio || !viloyat || !tuman || !maktab || !sinf || !telefon || !subject_name) {
      return NextResponse.json({ error: "Barcha maydonlar to'ldirilishi shart" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await queryOne("SELECT * FROM users WHERE telegram_id = $1", [telegram_id])

    if (existingUser) {
      return NextResponse.json({ error: "Bu Telegram ID allaqachon ro'yxatdan o'tgan" }, { status: 400 })
    }

    // Get subject ID
    const subject = await queryOne<Subject>("SELECT * FROM subjects WHERE name = $1", [subject_name])

    if (!subject) {
      return NextResponse.json({ error: "Fan topilmadi" }, { status: 400 })
    }

    // Generate credentials
    const { login, password } = generateCredentials()
    const passwordHash = await hashPassword(password)

    // Create user
    const result = await query(
      `INSERT INTO users (telegram_id, fio, viloyat, tuman, maktab, sinf, telefon, subject_id, login, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id, login`,
      [telegram_id, fio, viloyat, tuman, maktab, sinf, telefon, subject.id, login, passwordHash],
    )

    return NextResponse.json(
      {
        success: true,
        credentials: {
          login,
          password,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Server xatosi yuz berdi" }, { status: 500 })
  }
}
