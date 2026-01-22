import { useState } from 'react'
import {
  createMonster,
  createMonsterAttack,
  createMonsterAbility,
  linkMonsterAttacks,
  linkMonsterAbilities
} from '../monsterCreation.service'
import type {
  CreateMonsterPayload,
  CreateMonsterAttackPayload,
  CreateMonsterAbilityPayload
} from '../monsterCreation.types'

export function useMonsterCreation() {
  const [monsterId, setMonsterId] = useState<number | null>(null)

  const [attackIds, setAttackIds] = useState<number[]>([])
  const [abilityIds, setAbilityIds] = useState<number[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function createBaseMonster(payload: CreateMonsterPayload) {
    try {
      setLoading(true)
      setError(null)

      const res = await createMonster(payload)
      setMonsterId(res.monster.id)

      return res.monster
    } catch (err) {
      setError('Erro ao criar monstro.')
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function addAttack(payload: CreateMonsterAttackPayload) {
    if (!monsterId) {
      throw new Error('Monstro ainda não foi criado.')
    }

    try {
      setLoading(true)
      setError(null)

      const res = await createMonsterAttack(payload)
      setAttackIds(prev => [...prev, res.attack.id])

      return res.attack
    } catch (err) {
      setError('Erro ao criar ataque.')
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function addAbility(payload: CreateMonsterAbilityPayload) {
    if (!monsterId) {
      throw new Error('Monstro ainda não foi criado.')
    }

    try {
      setLoading(true)
      setError(null)

      const res = await createMonsterAbility(payload)
      setAbilityIds(prev => [...prev, res.ability.id])

      return res.ability
    } catch (err) {
      setError('Erro ao criar habilidade.')
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function finalizeMonster() {
    if (!monsterId) {
      throw new Error('Monstro ainda não foi criado.')
    }

    try {
      setLoading(true)
      setError(null)

      if (attackIds.length > 0) {
        await linkMonsterAttacks(monsterId, {
          attack_ids: attackIds
        })
      }

      if (abilityIds.length > 0) {
        await linkMonsterAbilities(monsterId, {
          ability_ids: abilityIds
        })
      }

      return true
    } catch (err) {
      setError('Erro ao vincular ataques ou habilidades.')
      throw err
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setMonsterId(null)
    setAttackIds([])
    setAbilityIds([])
    setError(null)
    setLoading(false)
  }

  return {
    monsterId,
    attackIds,
    abilityIds,

    loading,
    error,

    createBaseMonster,
    addAttack,
    addAbility,
    finalizeMonster,
    reset
  }
}
