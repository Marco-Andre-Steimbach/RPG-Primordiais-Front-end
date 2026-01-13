import { useEffect, useMemo, useState } from 'react'
import { fetchAllArmors } from '../armors.service'
import ArmorCard from '../components/ArmorCard'
import ArmorsFilter from '../components/ArmorsFilter'
import type { ArmorsResponse } from '../armors.types'
import '../armors.css'

function ArmorsAllPage() {
  const [armors, setArmors] = useState<ArmorsResponse['armors']>([])
  const [openId, setOpenId] = useState<number | null>(null)

  const [nameFilter, setNameFilter] = useState('')
  const [slotFilter, setSlotFilter] = useState('')

  useEffect(() => {
    fetchAllArmors().then(res => setArmors(res.armors))
  }, [])

  const slots = useMemo(() => {
    return Array.from(
      new Set(armors.map(a => a.slot_name))
    )
  }, [armors])

  const filteredArmors = useMemo(() => {
    return armors.filter(a => {
      if (
        nameFilter &&
        !a.item_name.toLowerCase().includes(nameFilter.toLowerCase())
      ) {
        return false
      }

      if (slotFilter && a.slot_name !== slotFilter) {
        return false
      }

      return true
    })
  }, [armors, nameFilter, slotFilter])

  return (
    <div className="items-container">
      <ArmorsFilter
        onNameChange={setNameFilter}
        onSlotChange={setSlotFilter}
        slots={slots}
      />

      <div className="items-all-container">
        {filteredArmors.map(a => (
          <ArmorCard
            key={a.armor_id}
            armorId={a.armor_id}
            title={a.item_name}
            isOpen={openId === a.armor_id}
            onToggle={() =>
              setOpenId(openId === a.armor_id ? null : a.armor_id)
            }
          />
        ))}
      </div>
    </div>
  )
}

export default ArmorsAllPage
