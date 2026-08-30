import { useCallback, useState } from 'react'
import { discoverElementAttackRelations } from '../element.service'
import type {
  DiscoverAttackRelationsResult
} from '../elements.types'

export function useDiscoverElementAttackRelations() {
  const [selectedElements, setSelectedElements] = useState<number[]>([])
  const [result, setResult] = useState<DiscoverAttackRelationsResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleElement = useCallback((id: number) => {
    setSelectedElements(prev =>
      prev.includes(id)
        ? prev.filter(elementId => elementId !== id)
        : [...prev, id]
    )
  }, [])

  const discover = useCallback(async () => {
    if (selectedElements.length === 0) {
      setResult(null)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await discoverElementAttackRelations(selectedElements)

      console.log('RESPONSE RELATIONS:', response)

      setResult(response.relations)
    } catch {
      setError('Erro ao descobrir relações dos elementos')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }, [selectedElements])

  const reset = useCallback(() => {
    setSelectedElements([])
    setResult(null)
    setError(null)
  }, [])

  return {
    selectedElements,
    toggleElement,
    discover,
    reset,
    result,
    relations: result?.relations ?? null,
    attack: result?.attack ?? null,
    defense: result?.defense ?? null,
    loading,
    error
  }
}
