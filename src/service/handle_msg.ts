import { UserRepo } from "#root/adapters/db/user.repo.js"
import TelegramBot from "node-telegram-bot-api"
export class HandleMsgService {
  constructor(
    private readonly bot: TelegramBot,
    private readonly userRepo: UserRepo,
    private readonly adminId: string,
  ) {}

  async handleMsg(msg: TelegramBot.Message) {
    const userId = msg.from?.id.toString()
    if (!userId) {
      throw new Error("User ID is required")
    }
    const username = msg.from?.username
    if (!username) {
      throw new Error("Username is required")
    }
    if (
      userId === this.adminId &&
      (msg.text === "approve" || msg.text === "reject")
    ) {
      return await this.handleKeyboardResponse(msg)
    }
    const user = await this.userRepo.get(userId)
    if (!user) {
      await this.userRepo.createUser(userId, username)
      this.sendMessageToAdmin(username, "Новая заявка")
      return
    }
    return await this.handleExistingUser(user)
  }

  async handleExistingUser(user: DB.User) {
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
        keyboard: [[{ text: "approve" }, { text: "reject" }]],
        one_time_keyboard: true,
        resize_keyboard: true,
      },
    })
  }

  async handleKeyboardResponse(msg: TelegramBot.Message) {
    if (msg.from?.id.toString() !== this.adminId) {
      return
    }
    const text = msg.text
    if (text !== "approve" && text !== "reject") {
      return
    }
    const status: DB.UserStatus = text === "approve" ? "accepted" : "rejected"
    const users = await this.userRepo.getUsersByStatus("new")
    if (users.length === 0) {
      this.bot.sendMessage(this.adminId, "Нет новых заявок для обработки")
      return
    }
    const user = users[0]
    await this.userRepo.updateStatus(user.id, status)
    const statusText = status === "accepted" ? "одобрена" : "отклонена"
    this.bot.sendMessage(
      this.adminId,
      `Заявка от ${user.username} ${statusText}`,
    )
    await this.handleExistingUser({ ...user, status })
  }
}
