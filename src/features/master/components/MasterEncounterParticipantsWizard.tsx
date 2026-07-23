import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchCampaignById } from '../campaigns.service'
import { fetchMonsters } from '../monsters.service'
import {
  addMonsterToEncounter,
  addPlayerToEncounter
} from '../encounters.service'
import type { CampaignCharacter } from '../campaigns.types'
import type { MonsterListItem } from '../monsters.types'

type Props = {
  encounterId: number
  onCancel: () => void
  onDone: () => void
}

type SelectedMonster = {
  monster_id: number
  monster_name: string
  quantity: number
}

function MasterEncounterParticipantsWizard({
  encounterId,
  onCancel,
  onDone
}: Props) {
  const { id } = useParams()

  const [characters, setCharacters] = useState<CampaignCharacter[]>([])
  const [monsters, setMonsters] = useState<MonsterListItem[]>([])

  const [selectedCharacterIds, setSelectedCharacterIds] = useState<number[]>([])
  const [selectedMonsters, setSelectedMonsters] = useState<SelectedMonster[]>([])
  const [selectedMonsterId, setSelectedMonsterId] = useState('')

  const [characterSearch, setCharacterSearch] = useState('')
  const [monsterSearch, setMonsterSearch] = useState('')

  const [loadingData, setLoadingData] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const campaignId = Number(id)

    if (!campaignId || campaignId <= 0) {
      setError('Campanha inválida.')
      setLoadingData(false)
      return
    }

    setLoadingData(true)
    setError(null)

    Promise.all([
      fetchCampaignById(campaignId),
      fetchMonsters()
    ])
      .then(([campaignResponse, monstersResponse]) => {
        setCharacters(campaignResponse.campaign.characters)
        setMonsters(monstersResponse.monsters)
      })
      .catch(() => {
        setError('Erro ao carregar personagens e monstros.')
      })
      .finally(() => {
        setLoadingData(false)
      })
  }, [id])

  const filteredCharacters = useMemo(() => {
    const term = characterSearch.trim().toLowerCase()

    return characters.filter(character =>
      character.name.toLowerCase().includes(term)
    )
  }, [characters, characterSearch])

  const availableMonsters = useMemo(() => {
    const term = monsterSearch.trim().toLowerCase()

    return monsters.filter(monster => {
      const alreadySelected = selectedMonsters.some(
        selected => selected.monster_id === monster.id
      )

      return (
        !alreadySelected &&
        monster.name.toLowerCase().includes(term)
      )
    })
  }, [monsters, monsterSearch, selectedMonsters])

  function toggleCharacter(campaignCharacterId: number) {
    setSelectedCharacterIds(current => {
      const isSelected = current.includes(campaignCharacterId)

      if (isSelected) {
        return current.filter(id => id !== campaignCharacterId)
      }

      return [...current, campaignCharacterId]
    })
  }

  function handleAddMonster() {
    const monsterId = Number(selectedMonsterId)

    if (!monsterId) {
      return
    }

    const monster = monsters.find(item => item.id === monsterId)

    if (!monster) {
      return
    }

    setSelectedMonsters(current => [
      ...current,
      {
        monster_id: monster.id,
        monster_name: monster.name,
        quantity: 1
      }
    ])

    setSelectedMonsterId('')
    setMonsterSearch('')
  }

  function updateMonsterQuantity(monsterId: number, quantity: number) {
    setSelectedMonsters(current =>
      current.map(monster =>
        monster.monster_id === monsterId
          ? {
              ...monster,
              quantity: Math.max(1, quantity)
            }
          : monster
      )
    )
  }

  function removeMonster(monsterId: number) {
    setSelectedMonsters(current =>
      current.filter(monster => monster.monster_id !== monsterId)
    )
  }

  async function handleSubmit() {
    if (
      selectedCharacterIds.length === 0 &&
      selectedMonsters.length === 0
    ) {
      setError('Selecione pelo menos um participante.')
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      await Promise.all([
        ...selectedCharacterIds.map(campaignCharacterId =>
          addPlayerToEncounter({
            encounter_id: encounterId,
            campaign_character_id: campaignCharacterId
          })
        ),

        ...selectedMonsters.map(monster =>
          addMonsterToEncounter({
            encounter_id: encounterId,
            monster_id: monster.monster_id,
            quantity: monster.quantity,
            monster_level: 1
          })
        )
      ])

      onDone()
    } catch {
      setError('Erro ao adicionar participantes ao encontro.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingData) {
    return (
      <section className="master-sheet card">
        Carregando participantes...
      </section>
    )
  }

  return (
    <section className="master-sheet card master-wizard">
      <div className="master-wizard-top">
        <div>
          <h2 className="master-wizard-title">
            Adicionar participantes
          </h2>

          <p className="master-wizard-sub">
            Escolha os personagens e monstros do encontro
          </p>
        </div>

        <div className="master-wizard-actions">
          <button
            className="master-wizard-btn ghost"
            type="button"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancelar
          </button>
        </div>
      </div>

      {error && (
        <div className="master-wizard-error">
          {error}
        </div>
      )}

      <div className="encounter-participants-grid">
        <div className="master-wizard-panel">
          <h3>Personagens</h3>

          <input
            className="master-search-input"
            type="text"
            placeholder="Buscar personagem..."
            value={characterSearch}
            onChange={event => setCharacterSearch(event.target.value)}
            disabled={submitting}
          />

          <div className="encounter-participants-list">
            {filteredCharacters.length === 0 ? (
              <p>Nenhum personagem encontrado.</p>
            ) : (
              filteredCharacters.map(character => (
                <label
                  className="encounter-participant-option"
                  key={character.campaign_character_id}
                >
                  <input
                    type="checkbox"
                    checked={selectedCharacterIds.includes(
                      character.campaign_character_id
                    )}
                    onChange={() =>
                      toggleCharacter(character.campaign_character_id)
                    }
                    disabled={submitting}
                  />

                  <div>
                    <strong>{character.name}</strong>

                    <span>
                      Nível {character.level}
                      {character.controlled_by
                        ? ` • ${character.controlled_by}`
                        : ''}
                    </span>
                  </div>
                </label>
              ))
            )}
          </div>
        </div>

        <div className="master-wizard-panel">
          <h3>Monstros</h3>

          <input
            className="master-search-input"
            type="text"
            placeholder="Filtrar monstros..."
            value={monsterSearch}
            onChange={event => setMonsterSearch(event.target.value)}
            disabled={submitting}
          />

          <div className="encounter-monster-selector">
            <select
              className="form-input"
              value={selectedMonsterId}
              onChange={event => setSelectedMonsterId(event.target.value)}
              disabled={submitting}
            >
              <option value="">
                Selecione um monstro
              </option>

              {availableMonsters.map(monster => (
                <option
                  key={monster.id}
                  value={monster.id}
                >
                  {monster.name}
                </option>
              ))}
            </select>

            <button
              className="master-wizard-btn ghost"
              type="button"
              onClick={handleAddMonster}
              disabled={!selectedMonsterId || submitting}
            >
              Adicionar
            </button>
          </div>

          <div className="encounter-selected-monsters">
            {selectedMonsters.length === 0 ? (
              <p>Nenhum monstro selecionado.</p>
            ) : (
              selectedMonsters.map(monster => (
                <div
                  className="encounter-selected-monster"
                  key={monster.monster_id}
                >
                  <div>
                    <strong>{monster.monster_name}</strong>
                  </div>

                  <label>
                    Quantidade

                    <input
                      className="form-input"
                      type="number"
                      min={1}
                      value={monster.quantity}
                      onChange={event =>
                        updateMonsterQuantity(
                          monster.monster_id,
                          Number(event.target.value)
                        )
                      }
                      disabled={submitting}
                    />
                  </label>

                  <button
                    className="master-wizard-btn ghost"
                    type="button"
                    onClick={() => removeMonster(monster.monster_id)}
                    disabled={submitting}
                  >
                    Remover
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="master-wizard-actions">
        <button
          className="master-wizard-btn primary"
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting
            ? 'Adicionando...'
            : 'Adicionar participantes'}
        </button>
      </div>
    </section>
  )
}

export default MasterEncounterParticipantsWizard
