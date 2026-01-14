import { useNavigate } from 'react-router-dom'
import type { CampaignCharacter, User } from '../campaigns.types'

function CampaignCharacterExpanded({
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
    const navigate = useNavigate()

    const isOwner = user.nickname === character.controlled_by
    const canManage = isMaster || isOwner

    return (
        <div className="campaign-character-expanded">
            <button
                className="campaign-character-button"
                onClick={() =>
                    navigate(`/characters/${character.character_id}`)
                }
            >
                Visualizar personagem
            </button>

            {canManage && (
                <>
                    <button
                        className="campaign-character-button"
                        onClick={() =>
                            navigate(
                                `/campaign/${campaignId}/characters/${character.character_id}/level-up`
                            )
                        }
                    >
                        Level-up
                    </button>

                    <button
                        className="campaign-character-button"
                        onClick={() =>
                            navigate(
                                `/campaign/${campaignId}/characters/${character.character_id}/sheet`
                            )
                        }
                    >
                        Visualizar ficha
                    </button>
                </>
            )}
        </div>
    )
}


export default CampaignCharacterExpanded
