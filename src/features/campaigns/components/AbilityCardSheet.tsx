import { useEffect, useState } from 'react'
import type { Ability, Element } from '../campaigns.types'

type Props = {
    ability: Ability
    elements: Element[]
    isOpen: boolean
    onToggle: () => void
}

function AbilityCardSheet({
    ability,
    elements,
    isOpen,
    onToggle
}: Props) {
    const [showFullDescription, setShowFullDescription] = useState(false)
    const [showArcane, setShowArcane] = useState(false)

    const hasDamage =
        ability.dice_formula &&
        ability.dice_formula !== '0'

    useEffect(() => {
        if (!isOpen) {
            setShowFullDescription(false)
            setShowArcane(false)
        }
    }, [isOpen])

    return (
        <div className="ability-wrapper">
            <button
                type="button"
                className="campaign-ability-card"
                onClick={onToggle}
            >
                <span className="campaign-ability-name">
                    {ability.title}
                </span>

                <span className="campaign-ability-cost">
                    Mana {ability.mana_cost}
                </span>
            </button>

            {isOpen && (
                <div className="campaign-ability-expanded">
                    <div className="ability-stats">
                        <div className="ability-stat">
                            <span>Mana</span>
                            <strong>{ability.mana_cost}</strong>
                        </div>

                        {hasDamage && (
                            <div className="ability-stat">
                                <span>Dano</span>
                                <strong>
                                    {ability.dice_formula}
                                    {ability.base_damage > 0 &&
                                        ` + ${ability.base_damage}`}
                                    {ability.bonus_damage > 0 &&
                                        ` + ${ability.bonus_damage}`}
                                </strong>
                            </div>
                        )}

                        {ability.range > 0 && (
                            <div className="ability-stat">
                                <span>Alcance</span>
                                <strong>
                                    {ability.range} casas
                                </strong>
                            </div>
                        )}

                        {ability.arcane_mana_cost !== null &&
                            ability.arcane_mana_cost > 0 && (
                                <div className="ability-stat">
                                    <span>Mana Arcana</span>
                                    <strong>
                                        {ability.arcane_mana_cost}
                                    </strong>
                                </div>
                            )}

                        {ability.bonus_speed > 0 && (
                            <div className="ability-stat">
                                <span>Velocidade</span>
                                <strong>
                                    +{ability.bonus_speed}
                                </strong>
                            </div>
                        )}
                    </div>

                    {elements.length > 0 && (
                        <div className="ability-elements">
                            {elements.map(el => (
                                <span
                                    key={el.id}
                                    className="item-element-tag"
                                >
                                    {el.name}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="ability-divider" />

                    <div className="ability-description-container">
                        <p
                            className={`ability-description ${showFullDescription
                                    ? 'expanded'
                                    : 'collapsed'
                                }`}
                        >
                            {ability.description}
                        </p>

                        <button
                            type="button"
                            className="ability-description-toggle"
                            onClick={() =>
                                setShowFullDescription(current => !current)
                            }
                        >
                            {showFullDescription
                                ? 'Mostrar menos'
                                : 'Ler descrição completa'}
                        </button>
                    </div>

                    {ability.arcane_title && (
                        <>
                            <div className="ability-divider" />

                            <button
                                type="button"
                                className="ability-arcane-toggle"
                                onClick={() =>
                                    setShowArcane(current => !current)
                                }
                            >
                                <span>
                                    Queima Arcana
                                </span>

                                <strong>
                                    {showArcane ? '−' : '+'}
                                </strong>
                            </button>

                            {showArcane && (
                                <div className="ability-arcane">
                                    <strong>
                                        {ability.arcane_title}
                                    </strong>

                                    <p>
                                        {ability.arcane_description}
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default AbilityCardSheet
