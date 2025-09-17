import { IUserRepo } from "#root/ports/user.js"
import TelegramBot from "node-telegram-bot-api"

export enum AdminCallbackData {
  Approve = "Approve",
  Reject = "Reject",
}

export class AdminService {
  constructor(
    private readonly userRepo: IUserRepo,
    private readonly bot: TelegramBot,
    readonly adminId: string,
  ) {}

  async handleAdminCallback(msg: TelegramBot.Message): Promise<boolean> {
    if (
      msg.from?.id?.toString() === this.adminId &&
      (msg.text === AdminCallbackData.Approve ||
        msg.text === AdminCallbackData.Reject)
    ) {
      console.log("admin callback", msg)
      return true
    }

    return false
  }
}
