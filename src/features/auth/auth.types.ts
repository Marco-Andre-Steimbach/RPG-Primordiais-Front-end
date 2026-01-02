export type User = {
  id: number
  first_name: string
  last_name: string
  nickname: string
  email: string
}

export type LoginResponse = {
  message: string
  token: string
  user: User
}
