import { apiFetch } from '../../app/http/api'
import type { FetchItemsResponse, Item } from './items.types'

export function fetchItems(): Promise<FetchItemsResponse> {
  return apiFetch<FetchItemsResponse>('/items')
}

export function fetchItemById(
  itemId: number
): Promise<{ item: Item }> {
  return apiFetch<{ item: Item }>(`/items/${itemId}`)
}
