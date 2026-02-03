import { useState } from 'react'
import {
  createItem,
  createItemAbility
} from '../items.service'
import type {
  CreateItemPayload,
  CreateItemAbilityPayload,
  ItemAbility
} from '../items.types'

type CreatedAbilityRef = {
  id: number
  label: string
}

export function useItemCreation() {
  const [itemId, setItemId] = useState<number | null>(null)

  const [abilities, setAbilities] = useState<CreatedAbilityRef[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function addAbility(payload: CreateItemAbilityPayload) {
    try {
      setLoading(true)
      setError(null)

      const res = await createItemAbility(payload)

      setAbilities(prev => [
        ...prev,
        { id: res.ability.id, label: res.ability.title }
      ])

      return res.ability
    } catch {
      setError('Erro ao criar habilidade do item.')
      throw new Error()
    } finally {
      setLoading(false)
    }
  }

  async function createBaseItem(payload: CreateItemPayload) {
    try {
      setLoading(true)
      setError(null)

      const res = await createItem(payload)
      setItemId(res.item.id)

      return res.item
    } catch {
      setError('Erro ao criar item.')
      throw new Error()
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setItemId(null)
    setAbilities([])
    setError(null)
    setLoading(false)
  }

  return {
    itemId,
    abilities,

    loading,
    error,

    addAbility,
    createBaseItem,
    reset
  }
}
