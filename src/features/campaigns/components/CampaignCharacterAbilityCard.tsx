import { useState } from 'react'
import type { Ability } from '../campaigns.types'
import CampaignCharacterAbilityExpanded from './CampaignCharacterAbilityExpanded'

type Props = {
  ability: Ability
  canAdd: boolean
  onAdd: (abilityId: number) => void
}

function CampaignCharacterAbilityCard({
  ability,
  canAdd,
  onAdd
}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        className="campaign-ability-card"
        onClick={() => setOpen(!open)}
      >
        <span className="campaign-ability-name">
          {ability.title}
        </span>

        <span className="campaign-ability-cost">
          {ability.mana_cost} Mana
        </span>
      </div>

      {open && (
        <CampaignCharacterAbilityExpanded
          ability={ability}
          canAdd={canAdd}
          onAdd={onAdd}
        />
      )}
    </>
  )
}

export default CampaignCharacterAbilityCard
