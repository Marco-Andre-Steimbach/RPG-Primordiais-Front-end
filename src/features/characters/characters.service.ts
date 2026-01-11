import { apiFetch } from '../../app/http/api'
import type {
  CreateCharacterPayload,
  CharactersMeResponse,
  CharacterByIdResponse,
  RaceResponse,
  OrderResponse,
  CreateAbilityPayload,
  ElementType,
  RacesResponse,
  OrdersResponse
} from './characters.types'

export function fetchRaces(): Promise<RacesResponse> {
  return apiFetch<RacesResponse>('/races')
}

export function fetchOrders(): Promise<OrdersResponse> {
  return apiFetch<OrdersResponse>('/orders')
}

export function fetchRaceById(id: number): Promise<RaceResponse> {
  return apiFetch<RaceResponse>(`/races/${id}`)
}

export function fetchOrderById(id: number): Promise<OrderResponse> {
  return apiFetch<OrderResponse>(`/orders/${id}`)
}

export function createCharacter(
  payload: CreateCharacterPayload
) {
  return apiFetch('/character', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function fetchCharacterById(
  id: number
): Promise<CharacterByIdResponse> {
  return apiFetch<CharacterByIdResponse>(`/character/${id}`)
}

export function fetchMyCharacters(): Promise<CharactersMeResponse> {
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

export function fetchElements(): Promise<{ elements: ElementType[] }> {
  return apiFetch<{ elements: ElementType[] }>('/elements')
}
