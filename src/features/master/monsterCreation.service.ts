import { apiFetch } from '../../app/http/api'
import type {
  CreateMonsterPayload,
  CreateMonsterResponse,
  CreateMonsterAttackPayload,
  CreateMonsterAttackResponse,
  CreateMonsterAbilityPayload,
  CreateMonsterAbilityResponse,
  LinkMonsterAttacksPayload,
  LinkMonsterAbilitiesPayload
} from './monsterCreation.types'

export function createMonster(
  payload: CreateMonsterPayload
): Promise<CreateMonsterResponse> {
  return apiFetch('/monsters', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function createMonsterAttack(
  payload: CreateMonsterAttackPayload
): Promise<CreateMonsterAttackResponse> {
  return apiFetch('/monsters/attacks', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function createMonsterAbility(
  payload: CreateMonsterAbilityPayload
): Promise<CreateMonsterAbilityResponse> {
  return apiFetch('/monsters/ability', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function linkMonsterAttacks(
  monsterId: number,
  payload: LinkMonsterAttacksPayload
) {
  return apiFetch(`/monsters/${monsterId}/attacks`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function linkMonsterAbilities(
  monsterId: number,
  payload: LinkMonsterAbilitiesPayload
) {
  return apiFetch(`/monsters/${monsterId}/ability`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}
