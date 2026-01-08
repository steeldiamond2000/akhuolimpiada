// Telegram Bot Setup Script
// Run this to set up the webhook for your Telegram bot
import 'dotenv/config'




const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const WEBHOOK_URL = process.env.NEXT_PUBLIC_APP_URL

async function setupWebhook() {
  if (!BOT_TOKEN) {
    console.error("Error: TELEGRAM_BOT_TOKEN environment variable is not set")
    console.log("\nTo set up your Telegram bot:")
    console.log("1. Create a bot with @BotFather on Telegram")
    console.log("2. Copy the bot token")
    console.log("3. Add TELEGRAM_BOT_TOKEN to your environment variables")
    process.exit(1)
  }

  if (!WEBHOOK_URL) {
    console.error("Error: NEXT_PUBLIC_APP_URL environment variable is not set")
    process.exit(1)
  }

  const webhookEndpoint = `${WEBHOOK_URL}/api/telegram/webhook`

  console.log("Setting up Telegram webhook...")
  console.log(`Webhook URL: ${webhookEndpoint}`)

  try {
    // Set webhook
    const setResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: webhookEndpoint,
        allowed_updates: ["message", "callback_query"],
      }),
    })

    const setResult = await setResponse.json()

    if (setResult.ok) {
      console.log("✅ Webhook successfully set!")
    } else {
      console.error("❌ Failed to set webhook:", setResult.description)
      process.exit(1)
    }

    // Get webhook info
    const infoResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`)
    const infoResult = await infoResponse.json()

    console.log("\nWebhook Info:")
    console.log(`  URL: ${infoResult.result.url}`)
    console.log(`  Pending updates: ${infoResult.result.pending_update_count}`)
    console.log(`  Has custom certificate: ${infoResult.result.has_custom_certificate}`)

    // Get bot info
    const botResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`)
    const botResult = await botResponse.json()

    if (botResult.ok) {
      console.log("\nBot Info:")
      console.log(`  Username: @${botResult.result.username}`)
      console.log(`  Name: ${botResult.result.first_name}`)
      console.log(`  Bot ID: ${botResult.result.id}`)
    }

    console.log("\n✅ Setup complete! Your bot is ready to receive messages.")
    console.log(`\nTest your bot: https://t.me/${botResult.result.username}`)
  } catch (error) {
    console.error("Error setting up webhook:", error)
    process.exit(1)
  }
}

// Delete webhook (for local development)
async function deleteWebhook() {
  if (!BOT_TOKEN) {
    console.error("Error: TELEGRAM_BOT_TOKEN is not set")
    process.exit(1)
  }

  console.log("Deleting webhook...")

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`)
    const result = await response.json()

    if (result.ok) {
      console.log("✅ Webhook deleted successfully")
    } else {
      console.error("❌ Failed to delete webhook:", result.description)
    }
  } catch (error) {
    console.error("Error:", error)
  }
}

// Check command line arguments
const args = process.argv.slice(2)

if (args.includes("--delete")) {
  deleteWebhook()
} else {
  setupWebhook()
}
