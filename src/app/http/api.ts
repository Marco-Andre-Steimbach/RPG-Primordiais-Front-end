const API_URL = import.meta.env.VITE_API_URL

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token')

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `${token}` } : {}),
      ...options.headers,
    },
  })

  const refreshToken = response.headers.get('X-Refresh-Token')
  if (refreshToken) {
    localStorage.setItem('token', refreshToken)
  }

  if (response.status === 401) {
    console.error('[AUTH] 401 Unauthorized – redirecionando para /login')
    localStorage.removeItem('token')
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }

  let data: any = null
  const contentType = response.headers.get('content-type')

  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json()
    } catch {
      console.error('[API] JSON inválido', response)
      throw new Error('Resposta inválida da API')
    }
  }

  if (!response.ok) {
    console.error('[API ERROR]', {
      url: `${API_URL}${path}`,
      status: response.status,
      data,
    })
    throw data ?? { message: 'Erro inesperado' }
  }

  return data as T
}
