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
      ...(token ? { Authorization: token } : {}),
      ...options.headers,
    },
  })

  const refreshToken = response.headers.get('X-Refresh-Token')
  if (refreshToken) {
    localStorage.setItem('token', refreshToken)
  }

  if (response.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }

  const data = await response.json()

  if (!response.ok) {
    throw data
  }

  return data
}
