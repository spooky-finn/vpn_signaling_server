import { IUserRepo, User } from "#root/ports/user.js"
import TelegramBot,  from "node-telegram-bot-api"
import { randomBytes } from "node:crypto"
import { AdminService } from "./admin"

export class HandleMsgService {
  constructor(
    private readonly bot: TelegramBot,
    private readonly userRepo: IUserRepo,
    private readonly adminService: AdminService,
  ) {}

  async handleMsg(msg: TelegramBot.Message) {
    if (msg.from?.is_bot) {
      return
    }
    const userId = msg.from?.id.toString()
    if (!userId) {
      throw new Error("User ID is required")
    }
    const username = msg.from?.username
    if (!username) {
      throw new Error("Username is required")
    }

    const isAdminCallback = await this.adminService.handleAdminCallback(msg)
    if (isAdminCallback) {
      return
    }

    const user = await this.userRepo.select(userId)
    if (!user) {
      await this.registerUser(msg.from!)
    } else {
      await this.getUserStatus(user)
    }
  }

  async registerUser(user: TelegramBot.User) {
    const auth_key = randomBytes(32).toString("hex")
    const username = user.username || ""
    await this.userRepo.insert({
      id: user.id.toString(),
      username,
      status: "new",
      auth_key,
      created_at: new Date().toISOString(),
    })
    this.sendMessageToAdmin(user.username || user.id.toString(), "Новая заявка")
  }

  async getUserStatus(user: User) {
    if (user.status === "new") {
      this.bot.sendMessage(
        user.id,
        `Администратор скоро рассмотрит вашу заявку`,
      )
      return
    }
    if (user.status === "accepted") {
      const configLink = this.getConfigLink(user)
      this.bot.sendMessage(
        user.id,
        `Вам одобрен доступ к кролечьей норе. Ваш файл конфигурации доступен по ссылке: ${configLink}`,
      )
      return
    }
    if (user.status === "rejected") {
      this.bot.sendMessage(user.id, `Ваша заявка отклонена`)
      return
    }
  }

  private getConfigLink(user: DB.User) {
    return `https://rabbithole.piek.ru/config/${user.id}`
  }

  private sendMessageToAdmin(username: string, message: string) {
    const msg = `Новая заявка от ${username}: ${message}`
    this.bot.sendMessage(this.adminId, msg, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "approve", callback_data: "approve" },
            { text: "reject", callback_data: "reject" },
          ],
        ],
        one_time_keyboard: true,
        resize_keyboard: true,
      },
    })
  }
}
