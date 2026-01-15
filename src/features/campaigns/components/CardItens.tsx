import { useState } from 'react'
import type { Element, SheetItem } from '../campaigns.types'
import ItemCardSheet from './ItemCardSheet'

type Props = {
  items: SheetItem[]
  elementsMap: Map<number, Element>
}

function CardItens({ items, elementsMap }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (items.length === 0) {
    return (
      <div className="campaign-card">
        <h3>Itens</h3>
        <p>Nenhum item no inventário.</p>
      </div>
    )
  }

  function toggle(index: number) {
    setOpenIndex(prev => (prev === index ? null : index))
  }

  return (
    <div className="campaign-card">
      <h3>Itens</h3>

      {items.map((item, index) => (
        <ItemCardSheet
          key={`${item.item?.id ?? 'item'}-${index}`}
          item={item}
          elementsMap={elementsMap}
          isOpen={openIndex === index}
          onToggle={() => toggle(index)}
        />
      ))}
    </div>
  )
}

export default CardItens
