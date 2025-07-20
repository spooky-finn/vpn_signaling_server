export type UserStatus = "new" | "accepted" | "rejected"

export interface User {
  id: string
  username: string
  status: UserStatus
  auth_key: string
  created_at: string
}

export interface IUserRepo {
  select(id: string): Promise<User | null>
  insert(user: User): Promise<void>
  getUsersByStatus(status: UserStatus): Promise<User[]>
  updateStatus(id: string, status: UserStatus): Promise<void>
}
