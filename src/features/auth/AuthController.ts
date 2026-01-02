import { loginUser, registerUser } from './auth.service'

export function useAuthController() {
  async function login(login: string, password: string) {
    const response = await loginUser({ login, password })

    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))

    return response
  }

  async function register(data: {
    first_name: string
    last_name: string
    email: string
    password: string
    nickname: string
  }) {
    return registerUser(data)
  }

  return { login, register }
}
