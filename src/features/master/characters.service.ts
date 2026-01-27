import { apiFetch } from '../../app/http/api'
import type {
  GiveGoldPayload,
  GiveGoldResponse,
  UpdateCharacterXPRequest,
  UpdateCharacterXPResponse
} from './characters.types'

export function giveCharacterGold(
  payload: GiveGoldPayload
): Promise<GiveGoldResponse> {
  return apiFetch<GiveGoldResponse>('/campaign/characters/gold', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function giveCharacterXP(
    payload: UpdateCharacterXPRequest
  ): Promise<UpdateCharacterXPResponse> {
    return apiFetch<UpdateCharacterXPResponse>('/campaign/characters/xp', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }