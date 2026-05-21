import { NextResponse } from "next/server"
import { login } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: "Foydalanuvchi nomi va parol kiritilishi shart" },
        { status: 400 }
      )
    }

    const admin = await login(username, password)

    if (!admin) {
      return NextResponse.json(
        { error: "Noto'g'ri foydalanuvchi nomi yoki parol" },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        username: admin.username,
        full_name: admin.full_name,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Server xatosi" },
      { status: 500 }
    )
  }
}
