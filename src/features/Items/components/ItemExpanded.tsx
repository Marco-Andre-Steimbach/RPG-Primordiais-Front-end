import { useEffect, useState } from 'react'
import {
  fetchItemAbilities,
  fetchElementById
} from '../items.service'
import type { Item, ItemAbility } from '../items.types'
import ItemAbilities from './ItemAbilities'
import ItemElements from './ItemElements'

function ItemExpanded({ item }: { item: Item }) {
  const [abilities, setAbilities] = useState<ItemAbility[]>([])
  const [elements, setElements] = useState<any[]>([])

  useEffect(() => {
    if (item.item_abilities.length > 0) {
      fetchItemAbilities(item.id).then(r =>
        setAbilities(r.abilities)
      )
    } else {
      setAbilities([])
    }

    Promise.all(
      item.element_types.map(id => fetchElementById(id))
    ).then(r => setElements(r.map(e => e.element)))
  }, [item])

  return (
    <div className="item-card-expanded">
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <span className="item-expanded-value">
        Valor: {item.value}
      </span>

      {elements.length > 0 && <ItemElements elements={elements} />}
      {abilities.map(ab => (
  <ItemAbilities key={ab.id} ability={ab} />
))}

    </div>
  )
}

export default ItemExpanded
