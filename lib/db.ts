import { Pool } from "pg"

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://localhost:5432/olimpiada",
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result.rows as T[]
  } finally {
    client.release()
  }
}

export async function queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(text, params)
  return rows[0] || null
}

export async function execute(text: string, params?: any[]): Promise<number> {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result.rowCount || 0
  } finally {
    client.release()
  }
}

export default pool
