import { useState } from 'react'
import type {
    CampaignCharacterAbility,
    Element
} from '../campaigns.types'
import AbilityCardSheet from './AbilityCardSheet'

type Props = {
    abilities: CampaignCharacterAbility[]
    elementsMap: Map<number, Element>
}

function CardAbilidades({ abilities, elementsMap }: Props) {
    const [openAbilityId, setOpenAbilityId] = useState<number | null>(null)

    return (
        <div className="sheet-card">
            <h3 className="sheet-card-title">Habilidades</h3>

            {abilities.length === 0 && (
                <span className="empty-text">
                    Nenhuma habilidade disponível
                </span>
            )}

            <div className="sheet-abilities-list">
                {abilities.map(({ ability, elements }) => {
                    const resolvedElements = elements
                        .map(id => elementsMap.get(id))
                        .filter(Boolean) as Element[]

                    return (
                        <AbilityCardSheet
                            key={ability.id}
                            ability={ability}
                            elements={resolvedElements}
                            isOpen={openAbilityId === ability.id}
                            onToggle={() =>
                                setOpenAbilityId(
                                    openAbilityId === ability.id
                                        ? null
                                        : ability.id
                                )
                            }
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default CardAbilidades
