import { useEffect, useState } from 'react'
import type { Element, Item, SheetItem } from '../campaigns.types'
import { fetchItemById } from '../campaigns.service'

type Props = {
    item: SheetItem
    elementsMap: Map<number, Element>
    isOpen: boolean
    onToggle: () => void
}

function ItemCardSheet({
    item,
    elementsMap,
    isOpen,
    onToggle
}: Props) {
    const [itemData, setItemData] = useState<Item | null>(
        item.item ?? null
    )

    useEffect(() => {
        if (!isOpen) return
        if (itemData) return
        if (!item.item) return

        fetchItemById(item.item.id).then(res => {
            setItemData(res.item)
        })
    }, [isOpen])

    const resolvedElements = item.elements
        .map(id => elementsMap.get(id))
        .filter(Boolean) as Element[]

    return (
        <div className="item-wrapper">
            <div
                className="item-card"
                onClick={onToggle}
            >
                <span className="item-name">
                    {itemData ? itemData.name : 'Item'}
                </span>
            </div>

            {isOpen && (
                <div className="item-expanded">
                    {itemData?.description && (
                        <p className="ability-description">
                            {itemData.description}
                        </p>
                    )}

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

                    {item.abilities.length > 0 && (
                        <>
                            <h4>Habilidades</h4>
                            {item.abilities.map(ab => (
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

export default ItemCardSheet
