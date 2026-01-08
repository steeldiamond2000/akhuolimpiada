export interface Subject {
  id: number
  name: string
  created_at: Date
}

export interface Question {
  id: number
  subject_id: number
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_option: "A" | "B" | "C" | "D"
  score: number
  created_at: Date
}

export interface OlympiadSettings {
  id: number
  start_time: Date
  duration_minutes: number
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface Answer {
  id: number
  user_id: number
  question_id: number
  selected_option: "A" | "B" | "C" | "D" | null
  created_at: Date
}

export interface Result {
  id: number
  user_id: number
  subject_id: number
  total_score: number
  submitted_at: Date
}

export interface UserWithSubject {
  id: number
  telegram_id: number | null
  fio: string
  viloyat: string
  tuman: string
  maktab: string
  sinf: string
  telefon: string
  subject_id: number | null
  subject_name: string | null
  login: string
  is_admin: boolean
  created_at: Date
}

export const VILOYATLAR = [
  "Toshkent shahri",
  "Toshkent viloyati",
  "Andijon",
  "Buxoro",
  "Farg'ona",
  "Jizzax",
  "Xorazm",
  "Namangan",
  "Navoiy",
  "Qashqadaryo",
  "Samarqand",
  "Sirdaryo",
  "Surxondaryo",
  "Qoraqalpog'iston",
] as const

export type Viloyat = (typeof VILOYATLAR)[number]
