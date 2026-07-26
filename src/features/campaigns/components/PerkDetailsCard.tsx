import type { Perk } from '../campaigns.types'

import PerkAbilityCard from './PerkAbilityCard'
import PerkAttributeCard from './PerkAttributeCard'

interface PerkDetailsCardProps {
    perk: Perk
}

function PerkDetailsCard({ perk }: PerkDetailsCardProps) {
    const hasAttributes = perk.attributes.length > 0
    const hasAbilities = perk.ability.length > 0

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
                        {perk.ability.map(ability => (
                            <PerkAbilityCard
                                key={ability.id}
                                ability={ability}
                                manaCost={perk.mana_cost}
                            />
                        ))}
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
                        {perk.attributes.map((attribute, index) => (
                            <PerkAttributeCard
                                key={`${attribute.attribute_name}-${index}`}
                                attribute={attribute}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}

export default PerkDetailsCard
