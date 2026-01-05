import type { Item } from '../items.types'
import ItemExpanded from './ItemExpanded'

function ItemCard({
  item,
  isOpen,
  onToggle
}: {
  item: Item
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <>
      <div className="item-card-small" onClick={onToggle}>
        <span className="item-name">{item.name}</span>
        <span className="item-value">{item.value}</span>
      </div>

      {isOpen && <ItemExpanded item={item} />}
    </>
  )
}

export default ItemCard
