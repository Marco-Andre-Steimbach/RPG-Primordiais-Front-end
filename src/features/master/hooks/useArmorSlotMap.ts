import { useEffect, useState } from 'react'

export type ArmorSlot = {
  id: number
  name: string
  is_exclusive: boolean
}

export function useArmorSlotMap() {
  const [map, setMap] = useState<Map<number, ArmorSlot>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data: ArmorSlot[] = [
      { id: 1, name: 'Capacete', is_exclusive: true },
      { id: 2, name: 'Armadura', is_exclusive: true },
      { id: 3, name: 'Botas', is_exclusive: true },
      { id: 4, name: 'Diversos', is_exclusive: false }
    ]

    const slotMap = new Map<number, ArmorSlot>()
    data.forEach(s => slotMap.set(s.id, s))

    setMap(slotMap)
    setLoading(false)
  }, [])

  return {
    armorSlotMap: map,
    loading
  }
}