import { apiFetch } from '../../app/http/api'
import type {
  RacesResponse,
  RaceResponse,
  RacePerksResponse
} from './races.types'

export function fetchRaces() {
  return apiFetch<RacesResponse>('/races')
}

export function fetchRaceById(id: string | number) {
  return apiFetch<RaceResponse>(`/races/${id}`)
}

export function fetchRacePerks(id: string | number) {
  return apiFetch<RacePerksResponse>(`/races/${id}/perks`)
}
