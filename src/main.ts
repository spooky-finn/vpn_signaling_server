import dotenv from "dotenv"
import TelegramBot from "node-telegram-bot-api"
import { UserRepo } from "./adapters/db/user.repo"
import { AdminService } from "./service/admin"
import { HandleMsgService } from "./service/handle_msg"
import { initDB } from "./utils/db"
import { initLogger, log } from "./utils/log"

async function main() {
  dotenv.config()
  initLogger(process.env.LOG_LEVEL)
  log.info("Starting server")
  const db = initDB()

  const token = process.env.TG_BOT_TOKEN
  if (!token) {
    log.error("TG_BOT_TOKEN is not set, exiting")
    process.exit(1)
  }

  const adminId = process.env.TG_ADMIN_ID
  if (!adminId) {
    log.error("TG_ADMIN_ID is not set, exiting")
    process.exit(1)
  }

  const bot = new TelegramBot(token, { polling: true })
  const userRepo = new UserRepo(db)
  const adminService = new AdminService(userRepo, bot, adminId)
  const handleMsgService = new HandleMsgService(bot, userRepo, adminService)

  bot.on("message", (msg) => {
    handleMsgService.handleMsg(msg)
  })
}

main()
