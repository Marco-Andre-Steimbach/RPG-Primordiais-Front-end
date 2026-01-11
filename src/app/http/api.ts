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
  console.log(token);
  if (response.status === 401) {
    console.error('[AUTH] 401 Unauthorized – redirecionando para /login')
    // localStorage.removeItem('token')
    // window.location.href = '/login'
    throw new Error('Unauthorized')
  }

  let data: any
  try {
    data = await response.json()
  } catch {
    console.error('[API] Resposta não é JSON', response)
    throw new Error('Resposta inválida da API')
  }
  console.log(response)
  if (!response.ok) {
    console.error('[API ERROR]', {
      url: `${API_URL}${path}`,
      status: response.status,
      data,
    })
    throw data
  }

  return data
}
