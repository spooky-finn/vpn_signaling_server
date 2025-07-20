import { IUserRepo } from "#root/ports/user.js"
import TelegramBot from "node-telegram-bot-api"

export class AdminService {
  constructor(
    private readonly userRepo: IUserRepo,
    private readonly bot: TelegramBot,
    private readonly adminId: string,
  ) {}

  async handleAdminCallback(msg: TelegramBot.Message): Promise<boolean> {
    if (
      msg.from?.id?.toString() === this.adminId &&
      (msg.text === "approve" || msg.text === "reject")
    ) {
      console.log("admin callback", msg)
      return true
    }

    return false
  }
}
