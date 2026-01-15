import { useState } from 'react'
import type { Element } from '../campaigns.types'
import ItemCardSheet from './ItemCardSheet'

type ItemSheet = {
    item: {
        item_id: number
    }
    elements?: number[]
    abilities?: any[]
}

type Props = {
    items: ItemSheet[]
    elementsMap: Map<number, Element>
}

function CardItens({ items, elementsMap }: Props) {
    const [openId, setOpenId] = useState<number | null>(null)

    return (
        <div className="sheet-card">
            <h3 className="sheet-card-title">
                Itens
            </h3>

            {items.length === 0 && (
                <span className="empty-text">
                    Nenhum item carregado
                </span>
            )}

            {items.map((item, index) => (
                <ItemCardSheet
                    key={index}
                    item={item}
                    elementsMap={elementsMap}
                    isOpen={openId === index}
                    onToggle={() =>
                        setOpenId(openId === index ? null : index)
                    }
                />
            ))}
        </div>
    )
}

export default CardItens
