import { apiFetch } from '../../app/http/api'

import type {
  ElementsResponse,
  ElementDamagePayload,
  ElementDamageResponse,
  DiscoverAttackRelationsResponse,
  EntityElementsResponse
} from './elements.types'

export function fetchElements(): Promise<ElementsResponse> {
  return apiFetch<ElementsResponse>('/elements')
}

export function calculateElementDamage(
  payload: ElementDamagePayload
): Promise<ElementDamageResponse> {
  return apiFetch<ElementDamageResponse>('/elements/damage', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function discoverElementAttackRelations(
  attackElements: number[]
): Promise<DiscoverAttackRelationsResponse> {
  return apiFetch<DiscoverAttackRelationsResponse>(
    '/elements/relations/attack',
    {
      method: 'POST',
      body: JSON.stringify({
        attack_elements: attackElements
      })
    }
  )
}

export function fetchMonsterElements(
  monsterId: number
): Promise<EntityElementsResponse> {
  return apiFetch<EntityElementsResponse>(
    `/elements/monster/${monsterId}`
  )
}

export function fetchCharacterElements(
  characterId: number
): Promise<EntityElementsResponse> {
  return apiFetch<EntityElementsResponse>(
    `/elements/character/${characterId}`
  )
}
