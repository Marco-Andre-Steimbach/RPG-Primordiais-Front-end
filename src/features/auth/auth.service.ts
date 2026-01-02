import { apiFetch } from '../../app/http/api'
import type { LoginResponse } from './auth.types'

export function registerUser(data: {
  first_name: string
  last_name: string
  email: string
  password: string
  nickname: string
}) {
  return apiFetch('/users/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function loginUser(data: {
  login: string
  password: string
}) {
  return apiFetch<LoginResponse>('/users/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
