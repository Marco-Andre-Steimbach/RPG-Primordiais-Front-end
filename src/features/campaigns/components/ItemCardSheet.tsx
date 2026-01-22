import { useEffect, useState } from 'react'
import type { Element, Item, SheetItem } from '../campaigns.types'
import {
    fetchItemById,
    useCampaignCharacterItem
} from '../campaigns.service'

type Props = {
    item: SheetItem
    elementsMap: Map<number, Element>
    isOpen: boolean
    onToggle: () => void
    campaignCharacterId: number
  }  

function ItemCardSheet({
    item,
    elementsMap,
    isOpen,
    onToggle,
    campaignCharacterId
}: Props) {

    const [itemData, setItemData] = useState<Item | null>(
        item.item ?? null
    )
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!isOpen) return
        if (itemData) return
        if (!item.item) return

        let mounted = true

        fetchItemById(item.item.id).then(res => {
            if (mounted) {
                setItemData(res.item)
            }
        })

        return () => {
            mounted = false
        }
    }, [isOpen, item.item, itemData])

    const resolvedElements = item.elements
        .map(id => elementsMap.get(id))
        .filter(Boolean) as Element[]

    async function handleUseItem() {
        if (!item.item) return
        if (item.quantity <= 0) return

        const payload = {
            campaign_character_id: campaignCharacterId,
            item_id: item.item.id
        }

        console.log('USE ITEM PAYLOAD >>>', payload)

        try {
            setLoading(true)
            await useCampaignCharacterItem(payload)
            window.location.reload()
        } finally {
            setLoading(false)
        }
    }



    return (
        <div className="item-wrapper">
            <div
                className="item-card item-card-header"
                onClick={onToggle}
            >
                <span className="item-name">
                    {itemData?.name ?? 'Item'}
                </span>

                <div className="item-meta">
                    <span className="item-quantity">
                        x{item.quantity}
                    </span>

                    <span className={`item-arrow ${isOpen ? 'open' : ''}`}>
                        ▼
                    </span>
                </div>
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

                    <div className="item-actions">
                        <span>
                            Quantidade: <strong>{item.quantity}</strong>
                        </span>

                        <button
                            className="use-item-button"
                            disabled={loading || item.quantity <= 0}
                            onClick={handleUseItem}
                        >
                            {loading ? 'Usando...' : 'Usar item'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ItemCardSheet
