import { apiFetch } from '../../app/http/api'
import type { FetchItemsResponse } from './items.types'

export function fetchItems(): Promise<FetchItemsResponse> {
  return apiFetch<FetchItemsResponse>('/items')
}
