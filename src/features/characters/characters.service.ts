import { apiFetch } from '../../app/http/api'
import type { CreateCharacterPayload } from './characters.types'
import type { CharactersMeResponse } from './characters.types'

export function fetchRaces() {
  return apiFetch('/races')
}

export function fetchOrders() {
  return apiFetch('/orders')
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
