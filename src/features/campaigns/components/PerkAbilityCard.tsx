import type { PerkAbility } from '../campaigns.types'

interface PerkAbilityCardProps {
    ability: PerkAbility
    manaCost: number
}

type AbilityDetail = {
    label: string
    value: string | number
}

function isAbilityDetail(
    detail: AbilityDetail | null
): detail is AbilityDetail {
    return detail !== null
}

function PerkAbilityCard({
    ability,
    manaCost
}: PerkAbilityCardProps) {
    const rawDetails: (AbilityDetail | null)[] = [
        ability.dice_formula
            ? {
                label: 'Dado',
                value: ability.dice_formula
            }
            : null,
        ability.base_damage > 0
            ? {
                label: 'Dano base',
                value: ability.base_damage
            }
            : null,
        ability.bonus_accuracy !== 0
            ? {
                label: 'Bônus de acerto',
                value: ability.bonus_accuracy
            }
            : null,
        ability.bonus_damage !== 0
            ? {
                label: 'Bônus de dano',
                value: ability.bonus_damage
            }
            : null,
        ability.bonus_speed !== 0
            ? {
                label: 'Bônus de velocidade',
                value: ability.bonus_speed
            }
            : null,
        ability.range > 0
            ? {
                label: 'Alcance',
                value: ability.range
            }
            : null,
        manaCost > 0
            ? {
                label: 'Custo de Mana',
                value: manaCost
            }
            : null
    ]

    const details = rawDetails.filter(isAbilityDetail)

    return (
        <div className="perk-ability-card">
            <div className="perk-ability-card-header">
                <div>
                    <span className="perk-ability-card-label">
                        Habilidade
                    </span>

                    <h3>{ability.name}</h3>
                </div>
            </div>

            <p className="perk-ability-card-description">
                {ability.description}
            </p>

            {details.length > 0 && (
                <div className="perk-ability-card-details">
                    {details.map(detail => (
                        <div
                            key={detail.label}
                            className="perk-ability-detail"
                        >
                            <span>{detail.label}</span>
                            <strong>{detail.value}</strong>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default PerkAbilityCard
