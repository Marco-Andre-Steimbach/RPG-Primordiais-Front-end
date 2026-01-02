import type { Perk } from '../races.types'

function PerkCard({ perk }: { perk: Perk }) {
  return (
    <div className="perk-card">
      <strong>{perk.name}</strong>
      <span>Nível {perk.required_level}</span>
      {perk.mana_cost > 0 && <span>Mana {perk.mana_cost}</span>}
    </div>
  )
}

export default PerkCard
