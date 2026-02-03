import { apiFetch } from '../../app/http/api'
import type {
  FetchItemsResponse,
  Item,
  CreateItemPayload,
  CreateItemResponse,
  CreateItemAbilityPayload,
  CreateItemAbilityResponse
} from './items.types'

export function fetchItems(): Promise<FetchItemsResponse> {
  return apiFetch<FetchItemsResponse>('/items')
}

export function fetchItemById(
  itemId: number
): Promise<{ item: Item }> {
  return apiFetch<{ item: Item }>(`/items/${itemId}`)
}

export function createItem(
  payload: CreateItemPayload
): Promise<CreateItemResponse> {
  return apiFetch<CreateItemResponse>(
    '/items',
    {
      method: 'POST',
      body: JSON.stringify(payload)
    }
  )
}

export function createItemAbility(
  payload: CreateItemAbilityPayload
): Promise<CreateItemAbilityResponse> {
  return apiFetch<CreateItemAbilityResponse>(
    '/items/ability',
    {
      method: 'POST',
      body: JSON.stringify(payload)
    }
  )
}