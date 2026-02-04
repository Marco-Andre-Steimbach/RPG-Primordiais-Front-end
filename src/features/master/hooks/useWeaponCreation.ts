import { useState } from 'react'
import {
  createWeapon,
  createWeaponAbility
} from '../weapons.service'
import type {
  CreateWeaponPayload,
  CreateWeaponAbilityPayload
} from '../weapons.types'

type CreatedWeaponAbilityRef = {
  id: number
  label: string
}

export function useWeaponCreation() {
  const [weaponId, setWeaponId] = useState<number | null>(null)
  const [abilities, setAbilities] = useState<CreatedWeaponAbilityRef[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function createBaseWeapon(
    itemId: number,
    payload: Omit<CreateWeaponPayload, 'item_id'>
  ) {
    try {
      setLoading(true)
      setError(null)

      const res = await createWeapon({
        item_id: itemId,
        ...payload
      })

      setWeaponId(res.weapon.id)
      return res.weapon
    } catch {
      setError('Erro ao criar arma.')
      throw new Error()
    } finally {
      setLoading(false)
    }
  }

  async function addAbility(payload: CreateWeaponAbilityPayload) {
    if (!weaponId) {
      setError('Arma ainda não criada.')
      throw new Error()
    }

    try {
      setLoading(true)
      setError(null)

      const res = await createWeaponAbility(weaponId, payload)

      setAbilities(prev => [
        ...prev,
        { id: res.ability.id, label: res.ability.title }
      ])

      return res.ability
    } catch {
      setError('Erro ao criar habilidade da arma.')
      throw new Error()
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setWeaponId(null)
    setAbilities([])
    setError(null)
    setLoading(false)
  }

  return {
    weaponId,
    abilities,

    loading,
    error,

    createBaseWeapon,
    addAbility,
    reset
  }
}
