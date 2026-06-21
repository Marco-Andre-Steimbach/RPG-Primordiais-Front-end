import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
    const [search, setSearch] = useState('')
    const navigate = useNavigate()

    const filteredPerks = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase()

        if (!normalizedSearch) return perks

        return perks.filter(perk =>
            perk.name.toLowerCase().includes(normalizedSearch)
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
                onChange={e => setSearch(e.target.value)}
            />

            {perks.length === 0 && (
                <span className="empty-text">
                    Nenhum perk adquirido
                </span>
            )}

            {perks.length > 0 && filteredPerks.length === 0 && (
                <span className="empty-text">
                    Nenhum perk encontrado
                </span>
            )}

            {filteredPerks.map(perk => {
                const resolvedElements = perk.element_types
                    .map(id => elementsMap.get(id))
                    .filter(Boolean) as Element[]

                return (
                    <div key={perk.id} className="ability-wrapper">
                        <div
                            className="campaign-ability-card"
                            onClick={() =>
                                setOpenId(openId === perk.id ? null : perk.id)
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

                        {openId === perk.id && (
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

                                <button
                                    className="perk-details-button"
                                    onClick={() => navigate(`/perks/${perk.id}`)}
                                >
                                    Ver detalhes do perk
                                </button>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default CardPerks
