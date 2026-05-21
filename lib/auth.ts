import { cookies } from "next/headers"
import { query, queryOne } from "./db"
import type { Admin } from "./types"
import bcrypt from "bcryptjs"

const SESSION_COOKIE = "ecofaol_session"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function login(username: string, password: string): Promise<Admin | null> {
  const admin = await queryOne<Admin>(
    "SELECT * FROM admins WHERE username = $1",
    [username]
  )

  if (!admin) return null

  const valid = await verifyPassword(password, admin.password_hash)
  if (!valid) return null

  // Set session cookie
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, String(admin.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })

  return admin
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function getCurrentAdmin(): Promise<Admin | null> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value

  if (!sessionId) return null

  const admin = await queryOne<Admin>(
    "SELECT * FROM admins WHERE id = $1",
    [parseInt(sessionId)]
  )

  return admin
}

export async function requireAdmin(): Promise<Admin> {
  const admin = await getCurrentAdmin()
  if (!admin) {
    throw new Error("Unauthorized")
  }
  return admin
}
