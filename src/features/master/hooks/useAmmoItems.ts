import { useEffect, useMemo, useState } from 'react'
import { fetchItems } from '../items.service'
import type { Item } from '../items.types'

export function useAmmoItems(search: string) {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItems().then(res => {
      setItems(res.items)
      setLoading(false)
    })
  }, [])

  const filteredItems = useMemo(() => {
    const s = search.toLowerCase()

    return items.filter(i =>
      i.name.toLowerCase().includes(s)
    )
  }, [items, search])

  return {
    items: filteredItems,
    loading
  }
}
