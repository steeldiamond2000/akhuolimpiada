import { type NextRequest, NextResponse } from "next/server"
import { queryOne } from "@/lib/db"
import { verifyPassword, createToken, type User } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { login, password } = await request.json()

    if (!login || !password) {
      return NextResponse.json({ error: "Login va parol kiritilishi shart" }, { status: 400 })
    }

    const user = await queryOne<User & { password_hash: string }>("SELECT * FROM users WHERE login = $1", [login])

    if (!user) {
      return NextResponse.json({ error: "Login yoki parol noto'g'ri" }, { status: 401 })
    }

    const isValid = await verifyPassword(password, user.password_hash)
    if (!isValid) {
      return NextResponse.json({ error: "Login yoki parol noto'g'ri" }, { status: 401 })
    }

    const token = await createToken({
      userId: user.id,
      login: user.login,
      isAdmin: user.is_admin,
    })

    const cookieStore = await cookies()
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        fio: user.fio,
        login: user.login,
        isAdmin: user.is_admin,
        subjectId: user.subject_id,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Server xatosi yuz berdi" }, { status: 500 })
  }
}
