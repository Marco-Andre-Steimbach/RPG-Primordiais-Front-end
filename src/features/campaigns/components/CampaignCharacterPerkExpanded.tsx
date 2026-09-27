import { useNavigate } from 'react-router-dom'

import type { Perk } from '../campaigns.types'

type Props = {
    perk: Perk
    canAdd: boolean
    disabledReason?: string | null
    onAdd: (perkId: number) => void
}

function CampaignCharacterPerkExpanded({
    perk,
    canAdd,
    disabledReason,
    onAdd
}: Props) {
    const navigate = useNavigate()

    return (
        <div className="campaign-perk-expanded">
            <button
                type="button"
                className="campaign-perk-button"
                onClick={() =>
                    navigate(`/perks/${perk.id}`)
                }
            >
                Visualizar perk
            </button>

            {canAdd && (
                <button
                    type="button"
                    className="campaign-perk-button primary"
                    onClick={() =>
                        onAdd(perk.id)
                    }
                >
                    Adicionar perk
                </button>
            )}

            {!canAdd && disabledReason && (
                <span className="campaign-perk-locked">
                    {disabledReason}
                </span>
            )}
        </div>
    )
}

export default CampaignCharacterPerkExpanded
