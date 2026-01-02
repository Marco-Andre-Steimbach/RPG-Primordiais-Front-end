import { apiFetch } from '../../app/http/api'
import type {
  OrdersResponse,
  OrderResponse,
  OrderPerksResponse
} from './orders.types'

export function fetchOrders() {
  return apiFetch<OrdersResponse>('/orders')
}

export function fetchOrderById(id: string | number) {
  return apiFetch<OrderResponse>(`/orders/${id}`)
}

export function fetchOrderPerks(id: string | number) {
  return apiFetch<OrderPerksResponse>(`/orders/${id}/perks`)
}
