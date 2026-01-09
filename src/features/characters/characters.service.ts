import { apiFetch } from '../../app/http/api'
import type {
  CreateCharacterPayload,
  CharactersMeResponse,
  CharacterByIdResponse,
  RaceResponse,
  OrderResponse,
  CreateAbilityPayload,
  ElementType
} from './characters.types'

export function fetchRaces() {
  return apiFetch('/races')
}

export function fetchOrders() {
  return apiFetch('/orders')
}

export function fetchRaceById(id: number) {
  return apiFetch<RaceResponse>(`/races/${id}`)
}

export function fetchOrderById(id: number) {
  return apiFetch<OrderResponse>(`/orders/${id}`)
}

export function createCharacter(payload: CreateCharacterPayload) {
  return apiFetch('/character', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function fetchCharacterById(id: number) {
  return apiFetch<CharacterByIdResponse>(`/character/${id}`)
}

export function fetchMyCharacters() {
  return apiFetch<CharactersMeResponse>('/character/me')
}

export function createCharacterAbility(
  characterId: number,
  payload: CreateAbilityPayload
) {
  return apiFetch(`/character/${characterId}/abilities`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function fetchElements() {
  return apiFetch<{ elements: ElementType[] }>('/elements')
}

