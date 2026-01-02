import { apiFetch } from '../../app/http/api'
import type { Perk } from './perks.types'

export function fetchPerkById(id: string | number) {
  return apiFetch<{ perk: Perk }>(`/perks/${id}`)
}

export function fetchElementById(id: number) {
  return apiFetch<{ element: { id: number; name: string; description: string } }>(
    `/elements/${id}`
  )
}
