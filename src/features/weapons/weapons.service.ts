import { apiFetch } from '../../app/http/api'
import type {
  WeaponsResponse,
  WeaponResponse,
  ItemResponse,
  ElementResponse,
  ElementsResponse
} from './weapons.types'

export function fetchAllWeapons() {
  return apiFetch<WeaponsResponse>('/weapons')
}

export function fetchWeaponById(id: number) {
  return apiFetch<WeaponResponse>(`/weapons/${id}`)
}

export function fetchItemById(id: number) {
  return apiFetch<ItemResponse>(`/items/${id}`)
}

export function fetchElementById(id: number) {
  return apiFetch<ElementResponse>(`/elements/${id}`)
}

export function fetchAllElements() {
  return apiFetch<ElementsResponse>('/elements')
}
