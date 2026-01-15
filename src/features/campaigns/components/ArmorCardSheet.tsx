import { useEffect, useState } from 'react'
import type { Element, Item } from '../campaigns.types'
import { fetchItemById } from '../campaigns.service'

type Props = {
    armor: any
    elementsMap: Map<number, Element>
    isOpen: boolean
    onToggle: () => void
}

function ArmorCardSheet({
    armor,
    elementsMap,
    isOpen,
    onToggle
}: Props) {
    const [item, setItem] = useState<Item | null>(armor.item ?? null)

    useEffect(() => {
        if (!isOpen) return
        if (item) return

        fetchItemById(armor.armor.item_id).then(res => {
            setItem(res.item)
        })
    }, [isOpen])

    const resolvedElements = armor.elements
        .map((id: number) => elementsMap.get(id))
        .filter(Boolean) as Element[]

    return (
        <div className="ability-wrapper">
            <div
                className="campaign-ability-card"
                onClick={onToggle}
            >
                <span className="campaign-ability-name">
                    {item?.name ?? 'Armadura'}
                </span>

                <span className="campaign-ability-cost">
                    CA +{armor.armor.armor_class_bonus}
                </span>
            </div>

            {isOpen && (
                <div className="campaign-ability-expanded">
                    {item?.description && (
                        <p className="ability-description">
                            {item.description}
                        </p>
                    )}

                    <div className="ability-stats">
                        <div>
                            <span>Slot</span>
                            <strong>{armor.slot.name}</strong>
                        </div>

                        <div>
                            <span>Bônus CA</span>
                            <strong>
                                +{armor.armor.armor_class_bonus}
                            </strong>
                        </div>

                        <div>
                            <span>Força mínima</span>
                            <strong>
                                {armor.armor.min_strength_required}
                            </strong>
                        </div>

                        {armor.armor.speed_penalty > 0 && (
                            <div>
                                <span>Penalidade</span>
                                <strong>
                                    -{armor.armor.speed_penalty}
                                </strong>
                            </div>
                        )}
                    </div>

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

                    {armor.abilities.length > 0 && (
                        <>
                            <h4>Habilidades</h4>
                            {armor.abilities.map((ab: any) => (
                                <p key={ab.id}>
                                    <strong>{ab.title}</strong><br />
                                    {ab.description}
                                </p>
                            ))}
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default ArmorCardSheet
