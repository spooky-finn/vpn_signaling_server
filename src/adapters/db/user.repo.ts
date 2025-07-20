import { Kysely } from "kysely"

export class UserRepo {
  constructor(private readonly db: Kysely<DB.Schema>) {}

  async get(id: string) {
    return this.db
      .selectFrom("user")
      .where("id", "=", id)
      .selectAll()
      .executeTakeFirst()
  }

  async createUser(id: string, username: string) {
    return this.db
      .insertInto("user")
      .values({
        id,
        username,
        auth_key: "",
        created_at: new Date().toISOString(),
        status: "new",
      })
      .execute()
  }

  async getUsersByStatus(status: DB.UserStatus) {
    return this.db
      .selectFrom("user")
      .where("status", "=", status)
      .selectAll()
      .execute()
  }

  async updateStatus(id: string, status: DB.UserStatus) {
    return this.db
      .updateTable("user")
      .set({ status })
      .where("id", "=", id)
      .execute()
  }
}
