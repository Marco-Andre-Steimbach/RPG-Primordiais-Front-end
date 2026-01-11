import { useEffect, useMemo, useState } from 'react'
import { fetchAllWeapons } from '../weapons.service'
import WeaponCard from '../components/WeaponCard'
import WeaponsFilter from '../components/WeaponsFilter'
import type { WeaponsResponse } from '../weapons.types'
import '../weapons.css'

function WeaponsAllPage() {
  const [weapons, setWeapons] = useState<WeaponsResponse['weapons']>([])
  const [openId, setOpenId] = useState<number | null>(null)
  const [nameFilter, setNameFilter] = useState('')

  useEffect(() => {
    fetchAllWeapons().then(res => setWeapons(res.weapons))
  }, [])

  const filteredWeapons = useMemo(() => {
    return weapons.filter(w => {
      if (
        nameFilter &&
        !w.item_name.toLowerCase().includes(nameFilter.toLowerCase())
      ) {
        return false
      }

      return true
    })
  }, [weapons, nameFilter])

  return (
    <div className="items-container">
      <WeaponsFilter onNameChange={setNameFilter} />

      <div className="items-all-container">
        {filteredWeapons.map(w => (
          <WeaponCard
            key={w.id}
            weaponId={w.id}
            title={w.item_name}
            isOpen={openId === w.id}
            onToggle={() =>
              setOpenId(openId === w.id ? null : w.id)
            }
          />
        ))}
      </div>
    </div>
  )
}

export default WeaponsAllPage
