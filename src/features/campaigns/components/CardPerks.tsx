import { useMemo, useState } from 'react'

import type {
    Element,
    Perk
} from '../campaigns.types'

import PerkDetailsCard from './PerkDetailsCard'

type Props = {
    perks: Perk[]
    elementsMap: Map<number, Element>
}

function CardPerks({
    perks,
    elementsMap
}: Props) {
    const [openId, setOpenId] = useState<number | null>(null)
    const [search, setSearch] = useState('')

    const filteredPerks = useMemo(() => {
        const normalizedSearch =
            search.trim().toLowerCase()

        if (!normalizedSearch) {
            return perks
        }

        return perks.filter(perk =>
            perk.name
                .toLowerCase()
                .includes(normalizedSearch)
        )
    }, [perks, search])

    return (
        <div className="sheet-card">
            <h3 className="sheet-card-title">
                Perks
            </h3>

            <input
                className="sheet-search-input"
                type="text"
                placeholder="Buscar perk..."
                value={search}
                onChange={event =>
                    setSearch(event.target.value)
                }
            />

            {perks.length === 0 && (
                <span className="empty-text">
                    Nenhum perk adquirido
                </span>
            )}

            {perks.length > 0 &&
                filteredPerks.length === 0 && (
                    <span className="empty-text">
                        Nenhum perk encontrado
                    </span>
                )}

            <div className="sheet-perks-list">
                {filteredPerks.map(perk => {
                    const expanded =
                        openId === perk.id

                    const resolvedElements =
                        perk.element_types
                            .map(id =>
                                elementsMap.get(id)
                            )
                            .filter(Boolean) as Element[]

                    const typeLabel =
                        perk.type === 'active'
                            ? 'Ativo'
                            : 'Passivo'

                    return (
                        <article
                            key={perk.id}
                            className={`sheet-perk-card ${
                                expanded
                                    ? 'sheet-perk-card--expanded'
                                    : ''
                            }`}
                        >
                            <button
                                type="button"
                                className="sheet-perk-card__header"
                                onClick={() =>
                                    setOpenId(
                                        expanded
                                            ? null
                                            : perk.id
                                    )
                                }
                                aria-expanded={expanded}
                            >
                                <div className="sheet-perk-card__main">
                                    <strong className="sheet-perk-card__name">
                                        {perk.name}
                                    </strong>

                                    <span className="sheet-perk-card__type">
                                        {typeLabel}
                                    </span>
                                </div>

                                <div className="sheet-perk-card__meta">
                                    {perk.type === 'active' &&
                                        perk.mana_cost > 0 && (
                                            <span>
                                                Mana {perk.mana_cost}
                                            </span>
                                        )}

                                    <span
                                        className={`sheet-perk-card__arrow ${
                                            expanded
                                                ? 'sheet-perk-card__arrow--open'
                                                : ''
                                        }`}
                                    >
                                        ▼
                                    </span>
                                </div>
                            </button>

                            {expanded && (
                                <div className="sheet-perk-card__content">
                                    <PerkDetailsCard
                                        perk={perk}
                                    />

                                    {resolvedElements.length > 0 && (
                                        <div className="sheet-perk-elements">
                                            <span className="sheet-perk-elements__title">
                                                Elementos
                                            </span>

                                            <div className="sheet-perk-elements__list">
                                                {resolvedElements.map(
                                                    element => (
                                                        <span
                                                            key={
                                                                element.id
                                                            }
                                                            className="item-element-tag"
                                                        >
                                                            {
                                                                element.name
                                                            }
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </article>
                    )
                })}
            </div>
        </div>
    )
}

export default CardPerks
