import { apiFetch } from '../../app/http/api'
import type {
  FetchArmorsResponse,
  FetchArmorByIdResponse,
  FetchArmorAbilitiesResponse,
  FetchArmorAbilityByIdResponse,
  CreateArmorPayload,
  CreateArmorResponse,
  CreateArmorAbilityPayload,
  CreateArmorAbilityResponse
} from './armors.types'

// ========================
// ARMORS
// ========================

export function fetchArmors(): Promise<FetchArmorsResponse> {
  return apiFetch<FetchArmorsResponse>('/armors')
}

export function fetchArmorById(
  armorId: number
): Promise<FetchArmorByIdResponse> {
  return apiFetch<FetchArmorByIdResponse>(`/armors/${armorId}`)
}

export function createArmor(
  payload: CreateArmorPayload
): Promise<CreateArmorResponse> {
  return apiFetch<CreateArmorResponse>('/armors', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

// ========================
// ARMOR ABILITIES
// ========================

export function fetchArmorAbilities(): Promise<FetchArmorAbilitiesResponse> {
  return apiFetch<FetchArmorAbilitiesResponse>('/armors/ability')
}

export function fetchArmorAbilityById(
  abilityId: number
): Promise<FetchArmorAbilityByIdResponse> {
  return apiFetch<FetchArmorAbilityByIdResponse>(
    `/armors/ability/${abilityId}`
  )
}

export function createArmorAbility(
  payload: CreateArmorAbilityPayload
): Promise<CreateArmorAbilityResponse> {
  return apiFetch<CreateArmorAbilityResponse>('/armors/ability', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}