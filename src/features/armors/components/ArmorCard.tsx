import { useEffect, useState } from 'react'
import type { Armor } from '../armors.types'
import { fetchArmorById } from '../armors.service'
import ArmorExpanded from './ArmorExpanded'

type Props = {
  armorId: number
  title: string
  isOpen: boolean
  onToggle: () => void
}

function ArmorCard({ armorId, title, isOpen, onToggle }: Props) {
  const [armor, setArmor] = useState<Armor | null>(null)

  useEffect(() => {
    if (!isOpen) return
    if (armor) return

    fetchArmorById(armorId).then(res => {
      setArmor(res.armor)
    })
  }, [isOpen, armorId])

  return (
    <>
      <div className="item-card-small" onClick={onToggle}>
        <span>{title}</span>
      </div>

      {isOpen && armor && (
        <ArmorExpanded armor={armor} />
      )}
    </>
  )
}

export default ArmorCard
