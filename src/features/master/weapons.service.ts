import { apiFetch } from '../../app/http/api'
import type {
  FetchWeaponsResponse,
  FetchWeaponByIdResponse
} from './weapons.types'

export function fetchWeapons(): Promise<FetchWeaponsResponse> {
  return apiFetch<FetchWeaponsResponse>('/weapons', {
    method: 'GET'
  })
}

export function fetchWeaponById(
  weaponId: number
): Promise<FetchWeaponByIdResponse> {
  return apiFetch<FetchWeaponByIdResponse>(`/weapons/${weaponId}`, {
    method: 'GET'
  })
}
