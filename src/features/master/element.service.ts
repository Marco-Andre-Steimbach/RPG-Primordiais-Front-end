import { apiFetch } from '../../app/http/api'
import type { ElementsResponse } from './elements.types'

export function fetchElements(): Promise<ElementsResponse> {
  return apiFetch<ElementsResponse>('/elements')
}
