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
    const hasDamage =
        ability.dice_formula &&
        ability.dice_formula !== '0'

    return (
        <div className="ability-wrapper">
            <div
                className="campaign-ability-card"
                onClick={onToggle}
            >
                <span className="campaign-ability-name">
                    {ability.title}
                </span>

                <span className="campaign-ability-cost">
                    Mana {ability.mana_cost}
                </span>
            </div>

            {isOpen && (
                <div className="campaign-ability-expanded">
                    <p className="ability-description">
                        {ability.description}
                    </p>

                    {ability.arcane_title && (
                        <div className="ability-arcane">
                            <strong>{ability.arcane_title}</strong>
                            <p>{ability.arcane_description}</p>
                        </div>
                    )}

                    <div className="ability-stats">
                        {hasDamage && (
                            <div>
                                <span>Dano: </span>
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
                            <div>
                                <span>Alcance: </span>
                                <strong>
                                    {ability.range} casas
                                </strong>
                            </div>
                        )}

                        {ability.arcane_mana_cost !== null && ability.arcane_mana_cost > 0 && (
                            <div>
                                <span>Mana Arcana </span>
                                <strong>
                                    {ability.arcane_mana_cost}
                                </strong>
                            </div>
                        )}

                        {ability.bonus_speed > 0 && (
                            <div>
                                <span>Bônus Velocidade</span>
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
                </div>
            )}
        </div>
    )
}

export default AbilityCardSheet
