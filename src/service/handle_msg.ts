import { IUserRepo, User } from "#root/ports/user.js"
import TelegramBot from "node-telegram-bot-api"
import { randomBytes } from "node:crypto"
import { AdminCallbackData, AdminService } from "./admin"

export class HandleMsgService {
  constructor(
    private readonly bot: TelegramBot,
    private readonly userRepo: IUserRepo,
    private readonly adminService: AdminService,
  ) {}

  async handleMsg(msg: TelegramBot.Message) {
    if (msg.from?.is_bot) return
    const userId = msg.from?.id.toString()
    if (!userId) {
      throw new Error("User ID is required")
    }

    const isAdminCallback = await this.adminService.handleAdminCallback(msg)
    if (isAdminCallback) return

    const user = await this.userRepo.select(userId)
    if (!user) {
      await this.register(msg.from!)
    } else {
      await this.sendStatus(user)
    }
  }

  async register(user: TelegramBot.User) {
    const auth_key = randomBytes(32).toString("hex")
    const username = user.username || ""
    await this.userRepo.insert({
      id: user.id.toString(),
      username,
      status: DB.UserStatus.new,
      auth_key,
      created_at: new Date().toISOString(),
    })
    this.sendMessageToAdmin(user.username || user.id.toString(), "Новая заявка")
  }

  async sendStatus(user: User) {
    if (user.status === DB.UserStatus.new) {
      this.bot.sendMessage(
        user.id,
        `Администратор скоро рассмотрит вашу заявку`,
      )
      return
    }
    if (user.status === DB.UserStatus.accepted) {
      const configLink = this.getConfigLink(user)
      this.bot.sendMessage(
        user.id,
        `Вам одобрен доступ к кролечьей норе. Ваш файл конфигурации доступен по ссылке: ${configLink}`,
      )
      return
    }
    if (user.status === DB.UserStatus.rejected) {
      this.bot.sendMessage(user.id, `Ваша заявка отклонена`)
      return
    }
  }

  private getConfigLink(user: DB.User) {
    return `https://rabbithole.piek.ru/config/${user.id}`
  }

  private sendMessageToAdmin(username: string, message: string) {
    const msg = `Новая заявка от ${username}: ${message}`
    this.bot.sendMessage(this.adminService.adminId, msg, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: AdminCallbackData.Approve,
              callback_data: AdminCallbackData.Approve,
            },
            {
              text: AdminCallbackData.Reject,
              callback_data: AdminCallbackData.Reject,
            },
          ],
        ],
        one_time_keyboard: true,
        resize_keyboard: true,
      },
    })
  }
}
