import { useState } from 'react'
import type { CampaignCharacter, User } from '../campaigns.types'
import CampaignCharacterExpanded from './CampaignCharacterExpanded'

function CampaignCharacterCard({
    campaignId,
    character,
    user,
    isMaster
}: {
    campaignId: number
    character: CampaignCharacter
    user: User
    isMaster: boolean
}) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <div
                className="campaign-character-card"
                onClick={() => setOpen(!open)}
            >
                <span className="campaign-character-name">
                    {character.name}
                </span>
                <span className="campaign-character-name">
                    {character.controlled_by}
                </span>
                <span className="campaign-character-level">
                    Nv. {character.level}
                </span>
            </div>

            {open && (
                <CampaignCharacterExpanded
                    campaignId={campaignId}
                    character={character}
                    user={user}
                    isMaster={isMaster}
                />
            )}
        </>
    )
}


export default CampaignCharacterCard
