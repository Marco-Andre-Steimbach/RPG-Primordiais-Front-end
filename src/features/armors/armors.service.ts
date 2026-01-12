import { apiFetch } from '../../app/http/api'
import type {
  ArmorsResponse,
  ArmorResponse,
  ItemResponse,
  ElementResponse,
  ElementsResponse
} from './armors.types'

export function fetchAllArmors() {
  return apiFetch<ArmorsResponse>('/armors')
}

export function fetchArmorById(id: number) {
  return apiFetch<ArmorResponse>(`/armors/${id}`)
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
