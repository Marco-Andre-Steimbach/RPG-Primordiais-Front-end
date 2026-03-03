import { useEffect, useState } from 'react'
import {
  fetchArmorAbilities,
  fetchArmorAbilityById
} from '../armors.service'
import type {
  ArmorAbilityListItem,
  ArmorAbility
} from '../armors.types'
import { useArmorCreation } from '../hooks/useArmorCreation'

type Props = {
  armor: ReturnType<typeof useArmorCreation>
  disabled?: boolean
}

function ArmorAbilitySelect({ armor, disabled }: Props) {
  const [search, setSearch] = useState('')
  const [abilities, setAbilities] = useState<ArmorAbilityListItem[]>([])
  const [loadingList, setLoadingList] = useState(true)

  const [selectedId, setSelectedId] = useState<number | null>(null)

  const [modalAbility, setModalAbility] =
    useState<ArmorAbility | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchArmorAbilities()
        setAbilities(res.armor_abilities)
      } finally {
        setLoadingList(false)
      }
    }

    load()
  }, [])

  const filtered = abilities.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase())
  )

  async function handleViewDetails() {
    if (!selectedId) return

    try {
      setLoadingDetails(true)
      const res = await fetchArmorAbilityById(selectedId)
      setModalAbility(res.armor_ability)
    } finally {
      setLoadingDetails(false)
    }
  }

  function handleSelectAbility() {
    if (!modalAbility) return

    armor.toggleAbility(modalAbility.id)
    setModalAbility(null)
  }

  return (
    <div className="master-form-section">

      <h4 className="master-form-subtitle">
        Selecionar habilidade existente
      </h4>

      <input
        className="master-input"
        placeholder="Pesquisar habilidade..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        disabled={disabled}
      />

      <select
        className="master-input"
        value={selectedId ?? ''}
        onChange={e =>
          setSelectedId(
            e.target.value ? Number(e.target.value) : null
          )
        }
        disabled={disabled || loadingList}
      >
        <option value="">Selecione uma habilidade</option>

        {filtered.map(ability => (
          <option key={ability.id} value={ability.id}>
            {ability.title}
          </option>
        ))}
      </select>

      <div style={{ marginTop: 12 }}>
        <button
          type="button"
          className="master-wizard-btn ghost"
          onClick={handleViewDetails}
          disabled={!selectedId || loadingDetails}
        >
          Ver detalhes
        </button>
      </div>

      {/* Lista selecionadas */}
      {armor.selectedAbilityIds.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <strong>Selecionadas:</strong>
          <div className="master-form-grid" style={{ marginTop: 8 }}>
            {armor.selectedAbilityIds.map(id => {
              const ability = abilities.find(a => a.id === id)
              return (
                <button
                  key={id}
                  type="button"
                  className="master-chip active"
                  onClick={() => armor.toggleAbility(id)}
                >
                  {ability?.title ?? `ID ${id}`}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Modal */}
      {modalAbility && (
        <div className="master-modal-backdrop">
          <div className="master-modal">

            <h3>{modalAbility.title}</h3>

            <p style={{ marginTop: 8 }}>
              {modalAbility.description}
            </p>

            <div style={{ marginTop: 16 }}>
              <div>Dano base: {modalAbility.base_damage}</div>
              <div>Bônus CA: {modalAbility.armor_class_bonus}</div>
              <div>Bônus velocidade: {modalAbility.bonus_speed}</div>
              <div>Alcance: {modalAbility.range}</div>
              {modalAbility.dice_formula && (
                <div>Fórmula: {modalAbility.dice_formula}</div>
              )}
            </div>

            <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
              <button
                className="master-wizard-btn primary"
                onClick={handleSelectAbility}
              >
                Selecionar habilidade
              </button>

              <button
                className="master-wizard-btn ghost"
                onClick={() => setModalAbility(null)}
              >
                Fechar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default ArmorAbilitySelect