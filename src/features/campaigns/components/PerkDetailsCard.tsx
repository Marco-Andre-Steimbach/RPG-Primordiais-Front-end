import type {
    Perk,
    PerkAbility,
    PerkAttribute
} from '../campaigns.types'

import PerkAbilityCard from './PerkAbilityCard'
import PerkAttributeCard from './PerkAttributeCard'

interface PerkDetailsCardProps {
    perk: Perk
}

function normalizeAbilities(
    ability:
        | PerkAbility
        | PerkAbility[]
        | null
        | undefined
): PerkAbility[] {
    if (!ability) {
        return []
    }

    if (Array.isArray(ability)) {
        return ability
    }

    return [ability]
}

function normalizeAttributes(
    attributes:
        | PerkAttribute[]
        | null
        | undefined
): PerkAttribute[] {
    if (!Array.isArray(attributes)) {
        return []
    }

    return attributes
}

function PerkDetailsCard({
    perk
}: PerkDetailsCardProps) {
    const abilities =
        normalizeAbilities(
            perk.ability
        )

    const attributes =
        normalizeAttributes(
            perk.attributes
        )

    const hasAbilities =
        abilities.length > 0

    const hasAttributes =
        attributes.length > 0

    return (
        <div className="perk-details-card">
            <div className="perk-details-description">
                {perk.description}
            </div>

            {hasAbilities && (
                <section className="perk-details-section perk-details-section--ability">
                    <div className="perk-details-divider perk-details-divider--ability" />

                    <span className="perk-details-section-title">
                        Habilidade
                    </span>

                    <div className="perk-details-section-content">
                        {abilities.map(
                            ability => (
                                <PerkAbilityCard
                                    key={
                                        ability.id
                                    }
                                    ability={
                                        ability
                                    }
                                    manaCost={
                                        perk.mana_cost
                                    }
                                />
                            )
                        )}
                    </div>
                </section>
            )}

            {hasAttributes && (
                <section className="perk-details-section perk-details-section--attribute">
                    <div className="perk-details-divider perk-details-divider--attribute" />

                    <span className="perk-details-section-title">
                        Atributos
                    </span>

                    <div className="perk-attributes-grid">
                        {attributes.map(
                            (
                                attribute,
                                index
                            ) => (
                                <PerkAttributeCard
                                    key={`${attribute.attribute_name}-${index}`}
                                    attribute={
                                        attribute
                                    }
                                />
                            )
                        )}
                    </div>
                </section>
            )}
        </div>
    )
}

export default PerkDetailsCard
