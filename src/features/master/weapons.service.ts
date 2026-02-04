import { apiFetch } from '../../app/http/api'
import type {
  FetchWeaponsResponse,
  FetchWeaponByIdResponse,
  CreateWeaponPayload,
  CreateWeaponResponse,
  CreateWeaponAbilityPayload,
  CreateWeaponAbilityResponse
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

export function createWeapon(payload: CreateWeaponPayload) {

  return apiFetch<CreateWeaponResponse>(
    '/weapons',
    {
      method: 'POST',
      body: JSON.stringify(payload)
    }
  )
}


export function createWeaponAbility(
  weaponId: number,
  payload: CreateWeaponAbilityPayload
): Promise<CreateWeaponAbilityResponse> {
  return apiFetch<CreateWeaponAbilityResponse>(
    `/weapons/${weaponId}/ability`,
    {
      method: 'POST',
      body: JSON.stringify(payload)
    }
  )
}