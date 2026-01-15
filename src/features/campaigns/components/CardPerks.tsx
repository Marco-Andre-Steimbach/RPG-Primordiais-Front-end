import { useState } from 'react'
import type { Element } from '../campaigns.types'

type Perk = {
    id: number
    name: string
    description: string
    type: string
    mana_cost: number
    element_types: number[]
}

type Props = {
    perks: Perk[]
    elementsMap: Map<number, Element>
}

function CardPerks({ perks, elementsMap }: Props) {
    const [openId, setOpenId] = useState<number | null>(null)

    return (
        <div className="sheet-card">
            <h3 className="sheet-card-title">
                Perks
            </h3>

            {perks.length === 0 && (
                <span className="empty-text">
                    Nenhum perk adquirido
                </span>
            )}

            {perks.map((perk, index) => {
                const resolvedElements = perk.element_types
                    .map(id => elementsMap.get(id))
                    .filter(Boolean) as Element[]

                return (
                    <div key={perk.id} className="ability-wrapper">
                        <div
                            className="campaign-ability-card"
                            onClick={() =>
                                setOpenId(openId === index ? null : index)
                            }
                        >
                            <span className="campaign-ability-name">
                                {perk.name}
                            </span>

                            <span className="campaign-ability-cost">
                                {perk.type === 'passive'
                                    ? 'Passivo'
                                    : `Mana ${perk.mana_cost}`}
                            </span>
                        </div>

                        {openId === index && (
                            <div className="campaign-ability-expanded">
                                <p className="ability-description">
                                    {perk.description}
                                </p>

                                {resolvedElements.length > 0 && (
                                    <div className="ability-elements">
                                        {resolvedElements.map(el => (
                                            <span
                                                key={el.id}
                                                className="item-element-tag"
                                            >
                                                {el.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default CardPerks
