import { api, USE_MOCK } from './client'
import { mockMenu } from './mockMenu'
import type { Category } from './types'

// GET /api/menu -> menú completo (categorías -> productos -> variantes activas)
export async function fetchMenu(): Promise<Category[]> {
  if (USE_MOCK) {
    // Simula una pequeña latencia de red
    await new Promise((r) => setTimeout(r, 250))
    return mockMenu
  }
  const { data } = await api.get<Category[]>('/menu')
  return data
}
