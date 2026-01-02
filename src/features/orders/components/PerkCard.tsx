import { useNavigate } from 'react-router-dom'
import type { Perk } from '../orders.types'

function PerkCard({ perk }: { perk: Perk }) {
  const navigate = useNavigate()

  return (
    <div
      className="perk-card"
      onClick={() => navigate(`/perks/${perk.id}`)}
    >
      <strong>{perk.name}</strong>
      <span>Nível {perk.required_level}</span>
      {perk.mana_cost > 0 && <span>Mana {perk.mana_cost}</span>}
    </div>
  )
}

export default PerkCard
