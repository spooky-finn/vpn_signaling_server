import { Selectable } from "kysely"

declare global {
  namespace DB {
    interface Schema {
      user: UserTable
    }

    enum UserStatus {
      new = 0,
      accepted = 1,
      rejected = 2,
    }

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
