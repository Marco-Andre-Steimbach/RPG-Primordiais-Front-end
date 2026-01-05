import { apiFetch } from '../../app/http/api'
import type {
  ItemsResponse,
  ItemAbilitiesResponse,
  ElementResponse
} from './items.types'

export function fetchAllItems() {
  return apiFetch<ItemsResponse>('/items')
}

export function fetchItemAbilities(id: string | number) {
  return apiFetch<ItemAbilitiesResponse>(`/items/${id}/abilities`)
}

export function fetchElementById(id: string | number) {
  return apiFetch<ElementResponse>(`/elements/${id}`)
}
