import { useEffect, useState } from 'react'
import { fetchElements } from '../element.service'
import type { ElementType } from '../elements.types'

export function useElementMap() {
  const [map, setMap] = useState<Map<number, ElementType>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchElements()
      .then(res => {
        const elementMap = new Map<number, ElementType>()
        res.elements.forEach(el => {
          elementMap.set(el.id, el)
        })
        setMap(elementMap)
      })
      .finally(() => setLoading(false))
  }, [])

  return {
    elementMap: map,
    loading
  }
}
