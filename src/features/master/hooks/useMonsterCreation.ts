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

type CreatedRef = {
  id: number
  label: string
}

export function useMonsterCreation() {
  const [monsterId, setMonsterId] = useState<number | null>(null)

  const [attacks, setAttacks] = useState<CreatedRef[]>([])
  const [abilities, setAbilities] = useState<CreatedRef[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function createBaseMonster(payload: CreateMonsterPayload) {
    try {
      setLoading(true)
      setError(null)

      const res = await createMonster(payload)
      setMonsterId(res.monster.id)

      return res.monster
    } catch {
      setError('Erro ao criar monstro.')
      throw new Error()
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

      setAttacks(prev => [
        ...prev,
        { id: res.attack.id, label: res.attack.name }
      ])

      return res.attack
    } catch {
      setError('Erro ao criar ataque.')
      throw new Error()
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

      setAbilities(prev => [
        ...prev,
        { id: res.ability.id, label: res.ability.title }
      ])

      return res.ability
    } catch {
      setError('Erro ao criar habilidade.')
      throw new Error()
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

      if (attacks.length > 0) {
        await linkMonsterAttacks(monsterId, {
          attack_ids: attacks.map(a => a.id)
        })
      }

      if (abilities.length > 0) {
        await linkMonsterAbilities(monsterId, {
          ability_ids: abilities.map(a => a.id)
        })
      }

      return true
    } catch {
      setError('Erro ao vincular ataques ou habilidades.')
      throw new Error()
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setMonsterId(null)
    setAttacks([])
    setAbilities([])
    setError(null)
    setLoading(false)
  }

  return {
    monsterId,

    attacks,
    abilities,

    loading,
    error,

    createBaseMonster,
    addAttack,
    addAbility,
    finalizeMonster,
    reset
  }
}
