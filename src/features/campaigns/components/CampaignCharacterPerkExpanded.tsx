import { useNavigate } from 'react-router-dom'
import type { Perk } from '../campaigns.types'

type Props = {
    perk: Perk
    canAdd: boolean
    onAdd: (perkId: number) => void
}

function CampaignCharacterPerkExpanded({
    perk,
    canAdd,
    onAdd
}: Props) {
    const navigate = useNavigate()

    return (
        <div className="campaign-perk-expanded">
            <button
                className="campaign-perk-button"
                onClick={() => navigate(`/perks/${perk.id}`)}
            >
                Visualizar perk
            </button>

            {canAdd && (
                <button
                    className="campaign-perk-button primary"
                    onClick={() => onAdd(perk.id)}
                >
                    Adicionar perk
                </button>
            )}
            {!canAdd && (
                <span className="campaign-perk-locked">
                    Requer nível {perk.required_level}
                </span>
            )}
        </div>
    )
}


export default CampaignCharacterPerkExpanded
