import { useState } from 'react'

import type { AvailablePerk } from '../campaigns.types'

import PerkDetailsCard from './PerkDetailsCard'

interface CampaignCharacterPerkCardProps {
    perk: AvailablePerk
    canAdd: boolean
    onAdd: (perkId: number) => void
}

function CampaignCharacterPerkCard({
    perk,
    canAdd,
    onAdd
}: CampaignCharacterPerkCardProps) {
    const [expanded, setExpanded] = useState(false)

    const typeLabel =
        perk.type === 'active'
            ? 'Ativo'
            : 'Passivo'

    const originLabel =
        perk.origin === 'race'
            ? 'Raça'
            : 'Ordem'

    return (
        <article
            className={`campaign-character-perk-card campaign-character-perk-card--${perk.origin} ${
                expanded
                    ? 'campaign-character-perk-card--expanded'
                    : ''
            }`}
        >
            <button
                type="button"
                className="campaign-character-perk-card__header"
                onClick={() =>
                    setExpanded(current => !current)
                }
                aria-expanded={expanded}
            >
                <div className="campaign-character-perk-card__main">
                    <strong className="campaign-character-perk-card__name">
                        {perk.name}
                    </strong>

                    <span className="campaign-character-perk-card__type">
                        {typeLabel}
                    </span>

                    <span
                        className={`campaign-character-perk-card__origin campaign-character-perk-card__origin--${perk.origin}`}
                    >
                        {originLabel}
                    </span>
                </div>

                <div className="campaign-character-perk-card__meta">
                    <span>Nv. {perk.required_level}</span>

                    <span
                        className={`campaign-character-perk-card__arrow ${
                            expanded
                                ? 'campaign-character-perk-card__arrow--open'
                                : ''
                        }`}
                    >
                        ▼
                    </span>
                </div>
            </button>

            {expanded && (
                <div className="campaign-character-perk-card__content">
                    <PerkDetailsCard perk={perk} />

                    <button
                        type="button"
                        className="campaign-character-perk-card__add"
                        disabled={!canAdd}
                        onClick={() => onAdd(perk.id)}
                    >
                        Adicionar perk
                    </button>
                </div>
            )}
        </article>
    )
}

export default CampaignCharacterPerkCard
