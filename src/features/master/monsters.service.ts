import { apiFetch } from '../../app/http/api'
import type {
  MonstersResponse,
  MonsterByIdResponse,
  CreateMonsterPayload
} from './monsters.types'

export function fetchMonsters(): Promise<MonstersResponse> {
  return apiFetch<MonstersResponse>('/monsters')
}

export function fetchMonsterById(
  id: number
): Promise<MonsterByIdResponse> {
  return apiFetch<MonsterByIdResponse>(`/monsters/${id}`)
}

export function createMonster(
  payload: CreateMonsterPayload
) {
  return apiFetch('/monsters', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}
