import { useMemo, useState } from 'react'
import type {
    CampaignCharacterAbility,
    Element
} from '../campaigns.types'
import AbilityCardSheet from './AbilityCardSheet'

type Props = {
    abilities: CampaignCharacterAbility[]
    elementsMap: Map<number, Element>
}

function CardAbilidades({
    abilities,
    elementsMap
}: Props) {
    const [openAbilityId, setOpenAbilityId] =
        useState<number | null>(null)

    const [search, setSearch] = useState('')

    const filteredAbilities = useMemo(() => {
        const normalizedSearch =
            search.trim().toLowerCase()

        if (!normalizedSearch) {
            return abilities
        }

        return abilities.filter(entry => {
            if (entry.schema === 'new') {
                const normalTitle =
                    entry.ability.forms.normal?.title ?? ''

                const arcaneTitle =
                    entry.ability.forms.arcane?.title ?? ''

                return (
                    normalTitle
                        .toLowerCase()
                        .includes(normalizedSearch) ||
                    arcaneTitle
                        .toLowerCase()
                        .includes(normalizedSearch)
                )
            }

            return (
                entry.ability.title
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                (
                    entry.ability.arcane_title ?? ''
                )
                    .toLowerCase()
                    .includes(normalizedSearch)
            )
        })
    }, [abilities, search])

    return (
        <div className="sheet-card">
            <h3 className="sheet-card-title">
                Habilidades
            </h3>

            <input
                className="sheet-search-input"
                type="text"
                placeholder="Buscar habilidade..."
                value={search}
                onChange={e =>
                    setSearch(e.target.value)
                }
            />

            {abilities.length === 0 && (
                <span className="empty-text">
                    Nenhuma habilidade disponível
                </span>
            )}

            {abilities.length > 0 &&
                filteredAbilities.length === 0 && (
                    <span className="empty-text">
                        Nenhuma habilidade encontrada
                    </span>
                )}

<div className="sheet-abilities-list">
    {filteredAbilities.map(entry => {
        const resolvedElements =
            entry.elements
                .map(id => elementsMap.get(id))
                .filter(Boolean) as Element[]

        return (
            <AbilityCardSheet
                key={entry.ability.id}
                entry={entry}
                elements={resolvedElements}
                elementsMap={elementsMap}
                isOpen={
                    openAbilityId ===
                    entry.ability.id
                }
                onToggle={() =>
                    setOpenAbilityId(
                        openAbilityId ===
                            entry.ability.id
                            ? null
                            : entry.ability.id
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
