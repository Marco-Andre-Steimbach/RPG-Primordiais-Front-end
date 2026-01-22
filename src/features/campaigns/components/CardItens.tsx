import { useState } from 'react'
import type { Element, SheetItem } from '../campaigns.types'
import ItemCardSheet from './ItemCardSheet'

type Props = {
  items: SheetItem[]
  elementsMap: Map<number, Element>
  campaignCharacterId: number
}

function CardItens({
  items,
  elementsMap,
  campaignCharacterId
}: Props) {

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (items.length === 0) {
    return (
      <div className="sheet-card">
        <h3 className="sheet-card-title">Itens</h3>
        <span className="empty-text">Nenhum item no inventário.</span>
      </div>
    )
  }

  function toggle(index: number) {
    setOpenIndex(prev => (prev === index ? null : index))
  }

  return (
    <div className="sheet-card">
      <h3>Itens</h3>

      {items.map((item, index) => (
        <ItemCardSheet
          key={`${item.item?.id}-${index}`}
          item={item}
          elementsMap={elementsMap}
          isOpen={openIndex === index}
          onToggle={() => toggle(index)}
          campaignCharacterId={campaignCharacterId}
        />
      ))}
    </div>
  )
}

export default CardItens
