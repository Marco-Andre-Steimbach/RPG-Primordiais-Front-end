import { useEffect, useState } from 'react'
import type { Element, Item } from '../campaigns.types'
import { fetchItemById } from '../campaigns.service'

type Props = {
    weapon: any
    elementsMap: Map<number, Element>
    isOpen: boolean
    onToggle: () => void
}

function WeaponCardSheet({
    weapon,
    elementsMap,
    isOpen,
    onToggle
}: Props) {
    const [item, setItem] = useState<Item | null>(null)

    useEffect(() => {
        if (!isOpen) return
        if (item) return

        fetchItemById(weapon.item_id).then(res => {
            setItem(res.item)
        })
    }, [isOpen])

    const resolvedElements = weapon.element_types
        .map((id: number) => elementsMap.get(id))
        .filter(Boolean) as Element[]

    return (
        <div className="ability-wrapper">
            <div
                className="campaign-ability-card"
                onClick={onToggle}
            >
                <span className="campaign-ability-name">
                    {item?.name ?? weapon.item_name}
                </span>

                <span className="campaign-ability-cost">
                    {weapon.dice_formula}
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
                            <span>Dano</span>
                            <strong>
                                {weapon.dice_formula}
                                {weapon.base_damage > 0 &&
                                    ` + ${weapon.base_damage}`}
                            </strong>
                        </div>

                        <div>
                            <span>Tipo</span>
                            <strong>{weapon.damage_type}</strong>
                        </div>
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

                    {weapon.abilities.length > 0 && (
                        <>
                            <h4>Habilidades</h4>
                            {weapon.abilities.map(ab => (
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

export default WeaponCardSheet
