import { apiFetch } from '../../app/http/api'
import type {
  FetchArmorsResponse,
  FetchArmorByIdResponse
} from './armors.types'

export function fetchArmors(): Promise<FetchArmorsResponse> {
  return apiFetch<FetchArmorsResponse>('/armors')
}

export function fetchArmorById(
  armorId: number
): Promise<FetchArmorByIdResponse> {
  return apiFetch<FetchArmorByIdResponse>(`/armors/${armorId}`)
}
