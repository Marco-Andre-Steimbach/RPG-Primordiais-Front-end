import { useEffect, useState } from 'react'
import { fetchAllItems } from '../items.service'
import type { Item } from '../items.types'

import ItemCard from '../components/ItemCard'
import ItemsFilter from '../components/ItemsFilter'

import '../items.css'

type ValueFilterType = '=' | '<' | '>' | ''

function ItemsAllPage() {
  const [items, setItems] = useState<Item[]>([])
  const [openItemId, setOpenItemId] = useState<number | null>(null)

  const [nameFilter, setNameFilter] = useState('')
  const [valueFilter, setValueFilter] = useState<number | null>(null)
  const [valueType, setValueType] = useState<ValueFilterType>('')

  useEffect(() => {
    fetchAllItems().then(res => setItems(res.items))
  }, [])

  const filteredItems = items.filter(item => {
    const byName =
      nameFilter.length === 0 ||
      item.name.toLowerCase().includes(nameFilter.toLowerCase())

    const byValue =
      valueFilter === null ||
      valueType === '' ||
      (valueType === '=' && item.value === valueFilter) ||
      (valueType === '<' && item.value < valueFilter) ||
      (valueType === '>' && item.value > valueFilter)

    return byName && byValue
  })

  return (
    <div className="items-all-container">
      <ItemsFilter
        onNameChange={setNameFilter}
        onValueChange={setValueFilter}
        onValueTypeChange={setValueType}
      />

      {filteredItems.map(item => (
        <ItemCard
          key={item.id}
          item={item}
          isOpen={openItemId === item.id}
          onToggle={() =>
            setOpenItemId(openItemId === item.id ? null : item.id)
          }
        />
      ))}
    </div>
  )
}

export default ItemsAllPage
