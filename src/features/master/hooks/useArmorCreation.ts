import { useState } from 'react'
import {
  createArmor,
  createArmorAbility
} from '../armors.service'
import type {
  CreateArmorPayload,
  CreateArmorAbilityPayload
} from '../armors.types'

type CreatedArmorAbilityRef = {
  id: number
  label: string
}

export function useArmorCreation() {
  const [armorId, setArmorId] = useState<number | null>(null)

  const [selectedAbilityIds, setSelectedAbilityIds] = useState<number[]>([])
  const [createdAbilities, setCreatedAbilities] = useState<CreatedArmorAbilityRef[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function createNewAbility(payload: CreateArmorAbilityPayload) {
    try {
      setLoading(true)
      setError(null)

      const res = await createArmorAbility(payload)

      const ability = res.ability

      setCreatedAbilities(prev => [
        ...prev,
        { id: ability.id, label: ability.title }
      ])

      setSelectedAbilityIds(prev => [...prev, ability.id])

      return ability
    } catch {
      setError('Erro ao criar habilidade da armadura.')
      throw new Error()
    } finally {
      setLoading(false)
    }
  }

  function toggleAbility(id: number) {
    setSelectedAbilityIds(prev =>
      prev.includes(id)
        ? prev.filter(a => a !== id)
        : [...prev, id]
    )
  }

  async function createBaseArmor(
    itemId: number,
    payload: Omit<CreateArmorPayload, 'item_id'>
  ) {
    try {
      setLoading(true)
      setError(null)

      const res = await createArmor({
        item_id: itemId,
        ...payload,
        armor_abilities: selectedAbilityIds
      })

      setArmorId(res.armor.id)
      return res.armor
    } catch {
      setError('Erro ao criar armadura.')
      throw new Error()
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setArmorId(null)
    setSelectedAbilityIds([])
    setCreatedAbilities([])
    setError(null)
    setLoading(false)
  }

  return {
    armorId,
    selectedAbilityIds,
    createdAbilities,

    loading,
    error,

    createNewAbility,
    createBaseArmor,
    toggleAbility,

    reset
  }
}