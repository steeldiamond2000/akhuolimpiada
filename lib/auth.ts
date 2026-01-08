import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { queryOne } from "./db"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "al-xorazmiy-olimpiada-secret-key-2024")

export interface User {
  id: number
  telegram_id: number | null
  fio: string
  viloyat: string
  tuman: string
  maktab: string
  sinf: string
  telefon: string
  subject_id: number | null
  login: string
  is_admin: boolean
  created_at: Date
}

export interface JWTPayload {
  userId: number
  login: string
  isAdmin: boolean
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .setIssuedAt()
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  if (!token) return null
  return verifyToken(token)
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession()
  if (!session) return null

  return queryOne<User>(
    "SELECT id, telegram_id, fio, viloyat, tuman, maktab, sinf, telefon, subject_id, login, is_admin, created_at FROM users WHERE id = $1",
    [session.userId],
  )
}

export function generateCredentials(): { login: string; password: string } {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
  let login = ""
  let password = ""

  for (let i = 0; i < 6; i++) {
    login += chars.charAt(Math.floor(Math.random() * chars.length))
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return { login, password }
}
