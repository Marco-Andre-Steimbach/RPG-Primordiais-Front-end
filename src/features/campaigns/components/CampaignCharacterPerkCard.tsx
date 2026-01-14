import { useState } from 'react'
import type { Perk } from '../campaigns.types'
import CampaignCharacterPerkExpanded from './CampaignCharacterPerkExpanded'

type Props = {
  perk: Perk
  canAdd: boolean
  onAdd: (perkId: number) => void
}

function CampaignCharacterPerkCard({
  perk,
  canAdd,
  onAdd
}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        className="campaign-perk-card"
        onClick={() => setOpen(!open)}
      >
        <span className="campaign-perk-name">
          {perk.name}
        </span>

        <span className="campaign-perk-level">
          Nv. {perk.required_level}
        </span>
      </div>

      {open && (
        <CampaignCharacterPerkExpanded
          perk={perk}
          canAdd={canAdd}
          onAdd={onAdd}
        />
      )}
    </>
  )
}

export default CampaignCharacterPerkCard