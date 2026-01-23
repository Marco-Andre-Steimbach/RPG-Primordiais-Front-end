import { useCallback, useState } from 'react'
import { discoverElementRelations } from '../element.service'
import type { ElementRelation } from '../elements.types'
import { groupRelationsByMultiplier } from './groupRelationsByMultiplier'

export function useDiscoverElementRelations() {
  const [selectedElements, setSelectedElements] = useState<number[]>([])
  const [immune, setImmune] = useState<ElementRelation[]>([])
  const [groups, setGroups] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleElement = useCallback((id: number) => {
    setSelectedElements(prev =>
      prev.includes(id)
        ? prev.filter(e => e !== id)
        : [...prev, id]
    )
  }, [])

  const discover = useCallback(async () => {
    if (selectedElements.length === 0) return

    try {
      setLoading(true)
      setError(null)

      const res = await discoverElementRelations(selectedElements)
      const { immune, groups } = groupRelationsByMultiplier(res.relations)

      setImmune(immune)
      setGroups(groups)
    } catch {
      setError('Erro ao descobrir fraquezas')
    } finally {
      setLoading(false)
    }
  }, [selectedElements])

  const reset = useCallback(() => {
    setSelectedElements([])
    setImmune([])
    setGroups([])
    setError(null)
  }, [])

  return {
    selectedElements,
    toggleElement,
    discover,
    reset,
    immune,
    groups,
    loading,
    error
  }
}
