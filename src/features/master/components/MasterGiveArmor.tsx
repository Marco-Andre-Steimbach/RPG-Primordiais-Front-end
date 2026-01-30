import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { fetchArmors } from '../armors.service'
import { fetchCampaignById } from '../campaigns.service'

import type { ArmorListItem } from '../armors.types'
import type { CampaignCharacter } from '../campaigns.types'

import MasterGiveArmorCard from './MasterGiveArmorCard'
import MasterGiveArmorModal from './MasterGiveArmorModal'

function MasterGiveArmor() {
  const { id } = useParams()
  const campaignId = Number(id)

  const [armors, setArmors] = useState<ArmorListItem[]>([])
  const [characters, setCharacters] =
    useState<CampaignCharacter[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [filter, setFilter] = useState('')
  const [expandedArmorId, setExpandedArmorId] =
    useState<number | null>(null)

  const [selectedArmor, setSelectedArmor] =
    useState<ArmorListItem | null>(null)

  const [action, setAction] =
    useState<'give' | 'buy' | null>(null)

  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)

    Promise.all([
      fetchArmors(),
      fetchCampaignById(campaignId)
    ])
      .then(([armorsRes, campaignRes]) => {
        setArmors(armorsRes.armors)
        setCharacters(campaignRes.campaign.characters)
      })
      .catch(() => {
        setError('Falha ao carregar armaduras.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [campaignId])

  const filteredArmors = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return armors
    return armors.filter(a =>
      a.item_name.toLowerCase().includes(q)
    )
  }, [armors, filter])

  function toggleExpand(id: number) {
    setExpandedArmorId(v => (v === id ? null : id))
  }

  if (loading) {
    return (
      <section className="master-sheet card">
        <div className="master-sheet-loading">
          Carregando armaduras...
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="master-sheet card">
        <div className="master-wizard-error">
          {error}
        </div>
      </section>
    )
  }

  return (
    <section className="master-sheet card">
      <h2 className="master-sheet-title">
        Dar / Comprar Armadura
      </h2>

      <input
        className="master-search-input"
        placeholder="Buscar armadura..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />

      {filteredArmors.length === 0 ? (
        <div className="master-empty">
          Nenhuma armadura encontrada.
        </div>
      ) : (
        <div className="master-gold-list">
          {filteredArmors.map(armor => (
            <MasterGiveArmorCard
              key={armor.armor_id}
              armor={armor}
              expanded={expandedArmorId === armor.armor_id}
              onToggle={() =>
                toggleExpand(armor.armor_id)
              }
              onGive={() => {
                setSelectedArmor(armor)
                setAction('give')
                setModalOpen(true)
              }}
              onBuy={() => {
                setSelectedArmor(armor)
                setAction('buy')
                setModalOpen(true)
              }}
            />
          ))}
        </div>
      )}

      {selectedArmor && action && (
        <MasterGiveArmorModal
          open={modalOpen}
          armor={selectedArmor}
          action={action}
          campaignId={campaignId}
          characters={characters}
          onClose={() => {
            setModalOpen(false)
            setSelectedArmor(null)
            setAction(null)
          }}
        />
      )}
    </section>
  )
}

export default MasterGiveArmor
