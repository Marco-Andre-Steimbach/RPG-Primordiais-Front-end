import { useEffect, useState } from 'react'
import type { Weapon } from '../weapons.types'
import { fetchWeaponById, fetchItemById } from '../weapons.service'
import WeaponExpanded from './WeaponExpanded'

type Props = {
  weaponId: number
  title: string
  isOpen: boolean
  onToggle: () => void
}

function WeaponCard({ weaponId, title, isOpen, onToggle }: Props) {
  const [weapon, setWeapon] = useState<Weapon | null>(null)
  const [itemValue, setItemValue] = useState<number | undefined>(undefined)
  const [strengthRequirement, setStrengthRequirement] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (!isOpen) return
    if (weapon) return

    fetchWeaponById(weaponId).then(res => {
      const w = res.weapon
      setWeapon(w)

      fetchItemById(w.item_id).then(itemRes => {
        setItemValue(itemRes.item.value)
      })

      setStrengthRequirement(Math.ceil(w.base_damage / 2))
    })
  }, [isOpen, weaponId])

  return (
    <>
      <div className="item-card-small" onClick={onToggle}>
        <span>{title}</span>
      </div>

      {isOpen && weapon && (
        <WeaponExpanded
          weapon={weapon}
          itemValue={itemValue}
          strengthRequirement={strengthRequirement}
        />
      )}
    </>
  )
}

export default WeaponCard
