import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { fetchItems } from '../items.service'
import { fetchCampaignById } from '../campaigns.service'

import type { Item } from '../items.types'
import type { CampaignCharacter } from '../campaigns.types'

import MasterGiveItemCard from './MasterGiveItemCard'
import MasterGiveItemModal from './MasterGiveItemModal'

function MasterGiveItem() {
  const { id } = useParams()
  const campaignId = Number(id)

  const [items, setItems] = useState<Item[]>([])
  const [characters, setCharacters] = useState<CampaignCharacter[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [filter, setFilter] = useState('')
  const [expandedItemId, setExpandedItemId] = useState<number | null>(null)

  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [action, setAction] = useState<'give' | 'buy' | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)

    Promise.all([
      fetchItems(),
      fetchCampaignById(campaignId)
    ])
      .then(([itemsRes, campaignRes]) => {
        setItems(itemsRes.items)
        setCharacters(campaignRes.campaign.characters)
      })
      .catch(() => {
        setError('Falha ao carregar dados.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [campaignId])

  const filteredItems = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return items
    return items.filter(i => i.name.toLowerCase().includes(q))
  }, [items, filter])

  function toggleExpand(id: number) {
    setExpandedItemId(v => (v === id ? null : id))
  }

  if (loading) {
    return (
      <section className="master-sheet card">
        <div className="master-sheet-loading">
          Carregando itens...
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="master-sheet card">
        <div className="master-wizard-error">{error}</div>
      </section>
    )
  }

  return (
    <section className="master-sheet card">
      <h2 className="master-sheet-title">Dar Item</h2>

      <input
        className="master-search-input"
        placeholder="Buscar item..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />

      {filteredItems.length === 0 ? (
        <div className="master-empty">
          Nenhum item encontrado.
        </div>
      ) : (
        <div className="master-gold-list">
          {filteredItems.map(item => (
            <MasterGiveItemCard
              key={item.id}
              item={item}
              expanded={expandedItemId === item.id}
              onToggle={() => toggleExpand(item.id)}
              onGive={() => {
                setSelectedItem(item)
                setAction('give')
                setModalOpen(true)
              }}
              onBuy={() => {
                setSelectedItem(item)
                setAction('buy')
                setModalOpen(true)
              }}
            />
          ))}
        </div>
      )}

      {selectedItem && action && (
        <MasterGiveItemModal
          open={modalOpen}
          item={selectedItem}
          action={action}
          campaignId={campaignId}
          characters={characters}
          onClose={() => {
            setModalOpen(false)
            setSelectedItem(null)
            setAction(null)
          }}
        />
      )}
    </section>
  )
}

export default MasterGiveItem
