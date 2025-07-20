import { Selectable } from "kysely"

declare global {
  namespace DB {
    interface Schema {
      user: UserTable
    }

    type UserStatus = "new" | "accepted" | "rejected"
    export interface UserTable {
      id: string
      username: string
      auth_key: string
      created_at: string
      status: UserStatus
    }

    export type User = Selectable<UserTable>
  }
}

export {}
