import { apiFetch } from '../../app/http/api'

export type User = {
  id: number
  first_name: string
  last_name: string
  nickname: string
  email: string
}

export type MeResponse = {
  user: User
  roles: string[]
}

export function fetchMe() {
  return apiFetch<MeResponse>('/users/me')
}
