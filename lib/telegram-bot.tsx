const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`
const CHANNEL_USERNAME = "@alxorazmiyuni"

// Types
export interface TelegramUpdate {
  message?: {
    message_id: number
    from: { id: number; first_name: string; username?: string }
    chat: { id: number; type: string }
    text?: string
    contact?: { phone_number: string; user_id: number }
  }
  callback_query?: {
    id: string
    from: { id: number; first_name: string; username?: string }
    message: { chat: { id: number }; message_id: number }
    data: string
  }
}

export interface UserSession {
  step: "subject" | "phone" | "fio" | "viloyat" | "tuman" | "maktab" | "sinf" | "complete"
  data: {
    subject_name?: string
    telefon?: string
    fio?: string
    viloyat?: string
    tuman?: string
    maktab?: string
    sinf?: string
  }
}

// User sessions storage
export const userSessions = new Map<number, UserSession>()

// Messages
export const MESSAGES = {
  welcome: `🎓 <b>Al-Xorazmiy Olimpiadasiga xush kelibsiz!</b>

🏆 Bu olimpiada Al-Xorazmiy universiteti tomonidan tashkil etilgan.

📚 Olimpiadada quyidagi fanlar bo'yicha ishtirok etishingiz mumkin:
• Dasturlash
• Fizika
• Matematika
• Suniy intellekt

📅 Ro'yxatdan o'tish uchun quyidagi tugmani bosing:`,

  channelRequired: `📢 <b>Diqqat!</b>

Olimpiadada qatnashish uchun avval rasmiy kanalimizga a'zo bo'lishingiz kerak:

👉 @alxorazmiyuni

A'zo bo'lgach, "✅ Tekshirish" tugmasini bosing.`,

  channelNotJoined: `❌ Siz hali kanalga a'zo bo'lmagansiz.

Iltimos, avval @alxorazmiyuni kanaliga a'zo bo'ling, so'ng "✅ Tekshirish" tugmasini bosing.`,

  channelJoined: `✅ Ajoyib! Siz kanalga muvaffaqiyatli a'zo bo'ldingiz.

Endi ro'yxatdan o'tishni davom ettiramiz...`,

  selectSubject: `📚 <b>Fan tanlang</b>

Qaysi fan bo'yicha olimpiadada qatnashmoqchisiz?`,

  sharePhone: `📱 <b>Telefon raqamingizni ulashing</b>

Quyidagi tugmani bosib telefon raqamingizni yuboring:`,

  enterFio: `👤 <b>Ism-familiyangizni kiriting</b>

Namuna: <i>Qazaqov Mansurbek</i>`,

  invalidFio: `❌ Iltimos, to'liq ism-familiyangizni kiriting.

Namuna: <i>Qazaqov Mansurbek</i>`,

  selectViloyat: `🌍 <b>Viloyatni tanlang</b>

Qaysi viloyatdan ekanligingizni tanlang:`,

  enterTuman: `🏘 <b>Tuman yoki shahar nomini yozing</b>

Namuna: <i>Qo'shko'pir tumani</i>`,

  enterMaktab: `🏫 <b>Maktab nomini yozing</b>

Namuna: <i>46-umumta'lim maktabi</i>`,

  selectSinf: `📖 <b>Sinfingizni tanlang</b>`,

  alreadyRegistered: `⚠️ Siz allaqachon ro'yxatdan o'tgansiz.

Agar login yoki parolingizni unutgan bo'lsangiz, admin bilan bog'laning.`,

  error: `❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring: /start`,

  success: (
    fio: string,
    subject: string,
    viloyat: string,
    tuman: string,
    maktab: string,
    sinf: string,
    login: string,
    password: string,
  ) =>
    `✅ <b>Ro'yxatdan o'tish muvaffaqiyatli yakunlandi!</b>

👤 <b>Ism:</b> ${fio}
📚 <b>Fan:</b> ${subject}
🌍 <b>Viloyat:</b> ${viloyat}
🏘 <b>Tuman:</b> ${tuman}
🏫 <b>Maktab:</b> ${maktab}
📖 <b>Sinf:</b> ${sinf}

🔐 <b>Kirish ma'lumotlari:</b>
👤 Login: <code>${login}</code>
🔑 Parol: <code>${password}</code>

🌐 <b>Test platformasi:</b>
https://olimpiada.akhu.uz

⚠️ <b>Muhim:</b> Login va parolni saqlab qo'ying!`,
}

// Keyboards
export const KEYBOARDS = {
  register: {
    inline_keyboard: [[{ text: "📝 Ro'yxatdan o'tish", callback_data: "register" }]],
  },

  channelSubscription: {
    inline_keyboard: [
      [{ text: "📢 Kanalga o'tish", url: "https://t.me/alxorazmiyuni" }],
      [{ text: "✅ Tekshirish", callback_data: "check_subscription" }],
    ],
  },

  subjects: {
    inline_keyboard: [
      [{ text: "💻 Dasturlash", callback_data: "subject_Dasturlash" }],
      [{ text: "⚛️ Fizika", callback_data: "subject_Fizika" }],
      [{ text: "🔢 Matematika", callback_data: "subject_Matematika" }],
      [{ text: "🤖 Suniy intellekt", callback_data: "subject_Suniy intellekt" }],
    ],
  },

  phone: {
    keyboard: [[{ text: "📱 Telefon raqamni yuborish", request_contact: true }]],
    resize_keyboard: true,
    one_time_keyboard: true,
  },

  viloyatlar: {
    inline_keyboard: [
      [
        { text: "Toshkent sh.", callback_data: "viloyat_Toshkent shahri" },
        { text: "Toshkent vil.", callback_data: "viloyat_Toshkent viloyati" },
      ],
      [
        { text: "Andijon", callback_data: "viloyat_Andijon" },
        { text: "Buxoro", callback_data: "viloyat_Buxoro" },
      ],
      [
        { text: "Farg'ona", callback_data: "viloyat_Farg'ona" },
        { text: "Jizzax", callback_data: "viloyat_Jizzax" },
      ],
      [
        { text: "Xorazm", callback_data: "viloyat_Xorazm" },
        { text: "Namangan", callback_data: "viloyat_Namangan" },
      ],
      [
        { text: "Navoiy", callback_data: "viloyat_Navoiy" },
        { text: "Qashqadaryo", callback_data: "viloyat_Qashqadaryo" },
      ],
      [
        { text: "Samarqand", callback_data: "viloyat_Samarqand" },
        { text: "Sirdaryo", callback_data: "viloyat_Sirdaryo" },
      ],
      [
        { text: "Surxondaryo", callback_data: "viloyat_Surxondaryo" },
        { text: "Qoraqalpog'iston", callback_data: "viloyat_Qoraqalpog'iston" },
      ],
    ],
  },

  sinflar: {
    inline_keyboard: [
      [
        { text: "9-sinf", callback_data: "sinf_9-sinf" },
        { text: "10-sinf", callback_data: "sinf_10-sinf" },
        { text: "11-sinf", callback_data: "sinf_11-sinf" },
      ],
    ],
  },

  removeKeyboard: {
    remove_keyboard: true,
  },
}

// Functions
export async function checkChannelMembership(userId: number): Promise<boolean> {
  try {
    console.log("[v0] Channel membership check for user:", userId)

    const response = await fetch(`${TELEGRAM_API}/getChatMember?chat_id=${CHANNEL_USERNAME}&user_id=${userId}`)

    const data = await response.json()
    console.log("[v0] API Response:", JSON.stringify(data, null, 2))

    if (!data.ok) {
      console.log("[v0] API error - returning FALSE (user must join channel)")
      return false
    }

    const status = data.result?.status
    console.log("[v0] User status in channel:", status)

    const memberStatuses = ["creator", "administrator", "member", "restricted"]
    const isMember = memberStatuses.includes(status)

    console.log("[v0] Is member:", isMember)
    return isMember
  } catch (error) {
    console.error("[v0] Channel check error:", error)
    return false
  }
}

export async function sendMessage(chatId: number, text: string, options?: { reply_markup?: object }): Promise<void> {
  try {
    await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        reply_markup: options?.reply_markup,
      }),
    })
  } catch (error) {
    console.error("[v0] Send message error:", error)
  }
}

export async function answerCallbackQuery(callbackQueryId: string, text?: string): Promise<void> {
  try {
    await fetch(`${TELEGRAM_API}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text,
      }),
    })
  } catch (error) {
    console.error("[v0] Answer callback error:", error)
  }
}
