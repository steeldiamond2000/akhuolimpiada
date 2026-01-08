import { type NextRequest, NextResponse } from "next/server"
import { query, queryOne } from "@/lib/db"
import { hashPassword, generateCredentials } from "@/lib/auth"
import {
  type TelegramUpdate,
  type UserSession,
  userSessions,
  sendMessage,
  answerCallbackQuery,
  checkChannelMembership,
  MESSAGES,
  KEYBOARDS,
} from "@/lib/telegram-bot"
import type { Subject } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const update: TelegramUpdate = await request.json()

    if (update.callback_query) {
      await handleCallbackQuery(update.callback_query)
    } else if (update.message) {
      await handleMessage(update.message)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Telegram webhook error:", error)
    return NextResponse.json({ ok: true })
  }
}

async function handleMessage(message: TelegramUpdate["message"]) {
  if (!message) return

  const chatId = message.chat.id
  const userId = message.from.id
  const text = message.text || ""

  // Handle /start command
  if (text === "/start") {
    userSessions.delete(userId)
    await sendMessage(chatId, MESSAGES.welcome, {
      reply_markup: KEYBOARDS.register,
    })
    return
  }

  // Handle contact sharing
  if (message.contact) {
    const session = userSessions.get(userId)
    if (session && session.step === "phone") {
      let phoneNumber = message.contact.phone_number
      // Normalize phone number
      if (!phoneNumber.startsWith("+")) {
        phoneNumber = "+" + phoneNumber
      }

      session.data.telefon = phoneNumber
      session.step = "fio"
      userSessions.set(userId, session)

      await sendMessage(chatId, MESSAGES.enterFio, {
        reply_markup: KEYBOARDS.removeKeyboard,
      })
    }
    return
  }

  // Handle text input based on current step
  const session = userSessions.get(userId)
  if (!session) {
    await sendMessage(chatId, "Ro'yxatdan o'tish uchun /start buyrug'ini yuboring.", {
      reply_markup: KEYBOARDS.register,
    })
    return
  }

  switch (session.step) {
    case "fio":
      await handleFioInput(chatId, userId, text, session)
      break

    case "tuman":
      await handleTumanInput(chatId, userId, text, session)
      break

    case "maktab":
      await handleMaktabInput(chatId, userId, text, session)
      break

    default:
      await sendMessage(chatId, "Iltimos, ko'rsatmalarga amal qiling yoki /start buyrug'ini yuboring.")
  }
}

async function handleFioInput(chatId: number, userId: number, text: string, session: UserSession) {
  const fio = text.trim()

  // Validate FIO (at least 2 words)
  if (fio.split(/\s+/).length < 2) {
    await sendMessage(chatId, MESSAGES.invalidFio)
    return
  }

  session.data.fio = fio
  session.step = "viloyat"
  userSessions.set(userId, session)

  await sendMessage(chatId, MESSAGES.selectViloyat, {
    reply_markup: KEYBOARDS.viloyatlar,
  })
}

async function handleTumanInput(chatId: number, userId: number, text: string, session: UserSession) {
  const tuman = text.trim()

  if (tuman.length < 2) {
    await sendMessage(chatId, "❌ Iltimos, tuman/shahar nomini to'g'ri kiriting.")
    return
  }

  session.data.tuman = tuman
  session.step = "maktab"
  userSessions.set(userId, session)

  await sendMessage(chatId, MESSAGES.enterMaktab)
}

async function handleMaktabInput(chatId: number, userId: number, text: string, session: UserSession) {
  const maktab = text.trim()

  if (maktab.length < 2) {
    await sendMessage(chatId, "❌ Iltimos, maktab nomini to'g'ri kiriting.")
    return
  }

  session.data.maktab = maktab
  session.step = "sinf"
  userSessions.set(userId, session)

  await sendMessage(chatId, MESSAGES.selectSinf, {
    reply_markup: KEYBOARDS.sinflar,
  })
}

async function completeRegistration(chatId: number, userId: number, session: UserSession) {
  try {
    // Check if already registered
    const existingUser = await queryOne("SELECT id FROM users WHERE telegram_id = $1", [userId])

    if (existingUser) {
      await sendMessage(chatId, MESSAGES.alreadyRegistered)
      userSessions.delete(userId)
      return
    }

    // Get subject ID
    const subject = await queryOne<Subject>("SELECT id FROM subjects WHERE name = $1", [session.data.subject_name])

    if (!subject) {
      await sendMessage(chatId, "❌ Tanlangan fan topilmadi. Qaytadan urinib ko'ring: /start")
      userSessions.delete(userId)
      return
    }

    // Generate credentials
    const { login, password } = generateCredentials()
    const passwordHash = await hashPassword(password)

    // Create user
    await query(
      `INSERT INTO users (telegram_id, fio, viloyat, tuman, maktab, sinf, telefon, subject_id, login, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        userId,
        session.data.fio,
        session.data.viloyat,
        session.data.tuman,
        session.data.maktab,
        session.data.sinf,
        session.data.telefon,
        subject.id,
        login,
        passwordHash,
      ],
    )

    // Send success message
    await sendMessage(
      chatId,
      MESSAGES.success(
        session.data.fio!,
        session.data.subject_name!,
        session.data.viloyat!,
        session.data.tuman!,
        session.data.maktab!,
        session.data.sinf!,
        login,
        password,
      ),
    )
  } catch (error) {
    console.error("Registration error:", error)
    await sendMessage(chatId, MESSAGES.error)
  }

  userSessions.delete(userId)
}

async function handleCallbackQuery(callbackQuery: TelegramUpdate["callback_query"]) {
  if (!callbackQuery) return

  const chatId = callbackQuery.message.chat.id
  const userId = callbackQuery.from.id
  const data = callbackQuery.data

  await answerCallbackQuery(callbackQuery.id)

  if (data === "register") {
    // Check if already registered
    const existingUser = await queryOne("SELECT id FROM users WHERE telegram_id = $1", [userId])

    if (existingUser) {
      await sendMessage(chatId, MESSAGES.alreadyRegistered)
      return
    }

    // Check channel membership
    const isMember = await checkChannelMembership(userId)

    if (!isMember) {
      // User is not subscribed to channel - show subscription required message
      await sendMessage(chatId, MESSAGES.channelRequired, {
        reply_markup: KEYBOARDS.channelSubscription,
      })
      return
    }

    // User is subscribed - proceed with registration
    userSessions.set(userId, { step: "subject", data: {} })

    await sendMessage(chatId, MESSAGES.selectSubject, {
      reply_markup: KEYBOARDS.subjects,
    })
    return
  }

  if (data === "check_subscription") {
    const isMember = await checkChannelMembership(userId)

    if (!isMember) {
      await sendMessage(chatId, MESSAGES.channelNotJoined, {
        reply_markup: KEYBOARDS.channelSubscription,
      })
      return
    }

    // User is now subscribed - proceed with registration
    await sendMessage(chatId, MESSAGES.channelJoined)

    userSessions.set(userId, { step: "subject", data: {} })

    await sendMessage(chatId, MESSAGES.selectSubject, {
      reply_markup: KEYBOARDS.subjects,
    })
    return
  }

  // Handle subject selection
  if (data.startsWith("subject_")) {
    const subjectName = data.replace("subject_", "")

    const session = userSessions.get(userId) || { step: "subject", data: {} }
    session.data.subject_name = subjectName
    session.step = "phone"
    userSessions.set(userId, session)

    await sendMessage(chatId, MESSAGES.sharePhone, {
      reply_markup: KEYBOARDS.phone,
    })
    return
  }

  // Handle viloyat selection
  if (data.startsWith("viloyat_")) {
    const viloyat = data.replace("viloyat_", "")

    const session = userSessions.get(userId)
    if (!session) {
      await sendMessage(chatId, "Sessiya topilmadi. Qaytadan boshlang: /start")
      return
    }

    session.data.viloyat = viloyat
    session.step = "tuman"
    userSessions.set(userId, session)

    await sendMessage(chatId, MESSAGES.enterTuman, {
      reply_markup: KEYBOARDS.removeKeyboard,
    })
    return
  }

  if (data.startsWith("sinf_")) {
    const sinf = data.replace("sinf_", "")

    const session = userSessions.get(userId)
    if (!session) {
      await sendMessage(chatId, "Sessiya topilmadi. Qaytadan boshlang: /start")
      return
    }

    session.data.sinf = sinf
    session.step = "complete"
    userSessions.set(userId, session)

    // Complete registration
    await completeRegistration(chatId, userId, session)
    return
  }
}
