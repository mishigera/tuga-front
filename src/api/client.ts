const BASE_URL = '/api'

// Mongoose sometimes serializes _id as `id` (virtual). Normalize to _id.
function normalize<T>(data: T): T {
  if (Array.isArray(data)) return data.map(normalize) as T
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>
    if (!obj._id && obj.id) obj._id = obj.id
    return obj as T
  }
  return data
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Error desconocido' }))
    throw new Error(error.message ?? `HTTP ${res.status}`)
  }

  const data = await res.json()
  return normalize(data) as T
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
}
