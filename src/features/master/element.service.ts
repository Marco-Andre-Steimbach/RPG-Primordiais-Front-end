import { apiFetch } from '../../app/http/api'
import type {
  ElementsResponse,
  ElementDamagePayload,
  ElementDamageResponse,
  DiscoverRelationsResponse
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

export function discoverElementRelations(
  defenseElements: number[]
): Promise<DiscoverRelationsResponse> {
  return apiFetch<DiscoverRelationsResponse>('/elements/relations', {
    method: 'POST',
    body: JSON.stringify({
      defense_elements: defenseElements
    })
  })
}

export function discoverElementAttackRelations(
  attackElements: number[]
): Promise<DiscoverRelationsResponse> {
  return apiFetch<DiscoverRelationsResponse>('/elements/relations/attack', {
    method: 'POST',
    body: JSON.stringify({
      attack_elements: attackElements
    })
  })
}
