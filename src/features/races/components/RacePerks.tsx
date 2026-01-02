import { useState } from 'react'
import type { Perk } from '../races.types'
import PerkCard from './PerkCard'
import PerkSearch from './PerkSearch'

function RacePerks({ perks }: { perks: Perk[] }) {
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState<number | null>(null)

  const filtered = perks.filter(perk => {
    const matchName = perk.name.toLowerCase().includes(search.toLowerCase())
    const matchLevel = level === null || perk.required_level === level
    return matchName && matchLevel
  })

  return (
    <div className="race-perks">
      <PerkSearch onSearch={setSearch} onLevel={setLevel} />

      <div className="perk-list">
        {filtered.map(perk => (
          <PerkCard key={perk.id} perk={perk} />
        ))}
      </div>
    </div>
  )
}

export default RacePerks
