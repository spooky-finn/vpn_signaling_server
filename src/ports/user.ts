import { Kysely } from "kysely"

export type DataStore = Kysely<DB.Schema>

export interface User {
  id: string
  username: string
  status: DB.UserStatus
  auth_key: string
  created_at: string
}

export interface IUserRepo {
  select(id: string): Promise<User | null>
  insert(user: User): Promise<void>
  getUsersByStatus(status: DB.UserStatus): Promise<User[]>
  updateStatus(id: string, status: DB.UserStatus): Promise<void>
}
