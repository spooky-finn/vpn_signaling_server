import { DataStore, IUserRepo, User, UserStatus } from "#root/ports/user.js"

export class UserRepo implements IUserRepo {
  constructor(private readonly db: DataStore) {}

  async select(id: string): Promise<User | null> {
    const user = await this.db
      .selectFrom("user")
      .where("id", "=", id)
      .selectAll()
      .executeTakeFirst()
    if (!user) {
      return null
    }
    return user
  }

  async insert(user: User): Promise<void> {
    await this.db.insertInto("user").values(user).execute()
  }

  async getUsersByStatus(status: UserStatus): Promise<User[]> {
    return this.db
      .selectFrom("user")
      .where("status", "=", status)
      .selectAll()
      .execute()
  }

  async updateStatus(id: string, status: UserStatus): Promise<void> {
    await this.db
      .updateTable("user")
      .set({ status })
      .where("id", "=", id)
      .execute()
  }
}
