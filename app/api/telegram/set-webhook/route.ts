import { type NextRequest, NextResponse } from "next/server"

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN

export async function POST(request: NextRequest) {
  if (!BOT_TOKEN) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN is not set" }, { status: 500 })
  }

  try {
    const { webhookUrl } = await request.json()

    if (!webhookUrl) {
      return NextResponse.json({ error: "webhookUrl is required" }, { status: 400 })
    }

    // Set webhook
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ["message", "callback_query"],
      }),
    })

    const result = await response.json()

    if (result.ok) {
      return NextResponse.json({
        success: true,
        message: "Webhook successfully set",
        url: webhookUrl,
      })
    } else {
      return NextResponse.json({ error: result.description }, { status: 400 })
    }
  } catch (error) {
    console.error("Set webhook error:", error)
    return NextResponse.json({ error: "Failed to set webhook" }, { status: 500 })
  }
}

export async function GET() {
  if (!BOT_TOKEN) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN is not set" }, { status: 500 })
  }

  try {
    // Get webhook info
    const infoResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`)
    const infoResult = await infoResponse.json()

    // Get bot info
    const botResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`)
    const botResult = await botResponse.json()

    return NextResponse.json({
      webhook: infoResult.result,
      bot: botResult.ok ? botResult.result : null,
    })
  } catch (error) {
    console.error("Get webhook info error:", error)
    return NextResponse.json({ error: "Failed to get webhook info" }, { status: 500 })
  }
}

export async function DELETE() {
  if (!BOT_TOKEN) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN is not set" }, { status: 500 })
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`)
    const result = await response.json()

    if (result.ok) {
      return NextResponse.json({
        success: true,
        message: "Webhook deleted",
      })
    } else {
      return NextResponse.json({ error: result.description }, { status: 400 })
    }
  } catch (error) {
    console.error("Delete webhook error:", error)
    return NextResponse.json({ error: "Failed to delete webhook" }, { status: 500 })
  }
}
