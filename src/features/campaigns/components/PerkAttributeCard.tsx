import type { PerkAttribute } from '../campaigns.types'

interface PerkAttributeCardProps {
    attribute: PerkAttribute
}

const attributeLabels: Record<string, string> = {
    str: 'Força',
    dex: 'Destreza',
    con: 'Constituição',
    int: 'Inteligência',
    intt: 'Inteligência',
    wis: 'Sabedoria',
    cha: 'Carisma',
    hp_max: 'Vida máxima',
    mana_max: 'Mana máxima',
    sanity: 'Sanidade',
    speed: 'Velocidade',
    armor_class: 'Classe de Armadura'
}

function PerkAttributeCard({
    attribute
}: PerkAttributeCardProps) {
    const label =
        attributeLabels[attribute.attribute_name] ??
        attribute.attribute_name

    const value =
        attribute.attribute_value > 0
            ? `+${attribute.attribute_value}`
            : attribute.attribute_value

    return (
        <div className="perk-attribute-card">
            <span className="perk-attribute-card-name">
                {label}
            </span>

            <strong className="perk-attribute-card-value">
                {value}
            </strong>
        </div>
    )
}

export default PerkAttributeCard
