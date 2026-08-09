import { useEffect, useMemo, useState } from 'react'
import { updateEncounterResources } from '../encounters.service'
import type {
  EncounterCombatMonster,
  EncounterCombatParticipant,
  EncounterCombatPlayer
} from '../encounters.types'

type Props = {
  participants: EncounterCombatParticipant[]
  selectedParticipant: EncounterCombatParticipant | null
  onSelectParticipant: (
    participant: EncounterCombatParticipant
  ) => void
}

type MonsterMarker = {
  name: string
  color: string
}

type ResourceType =
  | 'current_hp'
  | 'current_mana'
  | 'current_sanity'

type ResourceValues = {
  current_hp: number
  current_mana?: number
  current_sanity?: number
}

type ParticipantResources = Record<string, ResourceValues>

type ResourceInputs = Record<string, string>

const monsterMarkers: MonsterMarker[] = [
  {
    name: 'Azul',
    color: '#3b82f6'
  },
  {
    name: 'Amarelo',
    color: '#facc15'
  },
  {
    name: 'Vermelho',
    color: '#ef4444'
  },
  {
    name: 'Verde',
    color: '#22c55e'
  },
  {
    name: 'Branco',
    color: '#ffffff'
  },
  {
    name: 'Preto',
    color: '#111111'
  }
]

function isPlayer(
  participant: EncounterCombatParticipant
): participant is EncounterCombatPlayer {
  return participant.type === 'player'
}

function isMonster(
  participant: EncounterCombatParticipant
): participant is EncounterCombatMonster {
  return participant.type === 'monster'
}

function getParticipantKey(
  participant: EncounterCombatParticipant
): string {
  if (isPlayer(participant)) {
    return `player-${participant.encounter_player_id}`
  }

  return `monster-${participant.encounter_monster_id}`
}

function MasterCombatInitiativeList({
  participants,
  selectedParticipant,
  onSelectParticipant
}: Props) {
  const [resources, setResources] =
    useState<ParticipantResources>({})

  const [inputs, setInputs] =
    useState<ResourceInputs>({})

  const [savingKey, setSavingKey] =
    useState<string | null>(null)

  const [resourceError, setResourceError] =
    useState<string | null>(null)

  useEffect(() => {
    const initialResources: ParticipantResources = {}

    participants.forEach(participant => {
      const key = getParticipantKey(participant)

      if (isPlayer(participant)) {
        initialResources[key] = {
          current_hp: participant.current_hp,
          current_mana: participant.current_mana,
          current_sanity: participant.current_sanity
        }

        return
      }

      initialResources[key] = {
        current_hp: participant.current_hp
      }
    })

    setResources(initialResources)
  }, [participants])

  const monsterMarkerMap = useMemo(() => {
    const markerMap = new Map<number, MonsterMarker>()
    const monsterCounters = new Map<string, number>()

    participants.forEach(participant => {
      if (!isMonster(participant)) {
        return
      }

      const normalizedName = participant.name
        .trim()
        .toLocaleLowerCase('pt-BR')

      const markerIndex =
        monsterCounters.get(normalizedName) ?? 0

      markerMap.set(
        participant.encounter_monster_id,
        monsterMarkers[
          markerIndex % monsterMarkers.length
        ]
      )

      monsterCounters.set(
        normalizedName,
        markerIndex + 1
      )
    })

    return markerMap
  }, [participants])

  function isSelected(
    participant: EncounterCombatParticipant
  ): boolean {
    if (!selectedParticipant) {
      return false
    }

    return (
      getParticipantKey(participant) ===
      getParticipantKey(selectedParticipant)
    )
  }

  function getCurrentValue(
    participant: EncounterCombatParticipant,
    resource: ResourceType
  ): number {
    const key = getParticipantKey(participant)
    const current = resources[key]

    if (!current) {
      if (resource === 'current_hp') {
        return participant.current_hp
      }

      if (isPlayer(participant)) {
        if (resource === 'current_mana') {
          return participant.current_mana
        }

        return participant.current_sanity
      }

      return 0
    }

    return current[resource] ?? 0
  }

  function getInputKey(
    participant: EncounterCombatParticipant,
    resource: ResourceType
  ): string {
    return `${getParticipantKey(participant)}-${resource}`
  }

  function calculateNewValue(
    currentValue: number,
    rawValue: string
  ): number | null {
    const value = rawValue.trim()

    if (!value) {
      return null
    }

    if (/^\+\d+$/.test(value)) {
      return Math.max(
        0,
        currentValue + Number(value.slice(1))
      )
    }

    if (/^-\d+$/.test(value)) {
      return Math.max(
        0,
        currentValue - Number(value.slice(1))
      )
    }

    if (/^\d+$/.test(value)) {
      return Math.max(0, Number(value))
    }

    return null
  }

  function buildUpdatedParticipant(
    participant: EncounterCombatParticipant,
    resource: ResourceType,
    value: number
  ): EncounterCombatParticipant {
    if (isPlayer(participant)) {
      return {
        ...participant,
        [resource]: value
      }
    }

    return {
      ...participant,
      current_hp: value
    }
  }

  async function handleResourceUpdate(
    participant: EncounterCombatParticipant,
    resource: ResourceType
  ) {
    const participantKey =
      getParticipantKey(participant)

    const inputKey =
      getInputKey(participant, resource)

    const rawValue = inputs[inputKey]

    if (!rawValue?.trim()) {
      return
    }

    const currentValue =
      getCurrentValue(participant, resource)

    const newValue =
      calculateNewValue(currentValue, rawValue)

    if (newValue === null) {
      setResourceError(
        'Use um valor como 50, +20 ou -15.'
      )
      return
    }

    const saveKey =
      `${participantKey}-${resource}`

    try {
      setSavingKey(saveKey)
      setResourceError(null)

      if (isPlayer(participant)) {
        await updateEncounterResources({
          type: 'player',
          encounter_player_id:
            participant.encounter_player_id,
          [resource]: newValue
        })
      } else {
        await updateEncounterResources({
          type: 'monster',
          encounter_monster_id:
            participant.encounter_monster_id,
          current_hp: newValue
        })
      }

      setResources(current => ({
        ...current,
        [participantKey]: {
          ...current[participantKey],
          [resource]: newValue
        }
      }))

      setInputs(current => ({
        ...current,
        [inputKey]: ''
      }))

      if (isSelected(participant)) {
        onSelectParticipant(
          buildUpdatedParticipant(
            participant,
            resource,
            newValue
          )
        )
      }
    } catch {
      setResourceError(
        'Erro ao atualizar recurso.'
      )
    } finally {
      setSavingKey(null)
    }
  }

  function handleInputChange(
    participant: EncounterCombatParticipant,
    resource: ResourceType,
    value: string
  ) {
    const inputKey =
      getInputKey(participant, resource)

    setInputs(current => ({
      ...current,
      [inputKey]: value
    }))
  }

  function handleInputKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
    participant: EncounterCombatParticipant,
    resource: ResourceType
  ) {
    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()

    void handleResourceUpdate(
      participant,
      resource
    )
  }

  function renderResourceInput(
    participant: EncounterCombatParticipant,
    resource: ResourceType,
    label: string,
    maxValue: number
  ) {
    const inputKey =
      getInputKey(participant, resource)

    const saveKey =
      `${getParticipantKey(participant)}-${resource}`

    const currentValue =
      getCurrentValue(participant, resource)

    const isSaving =
      savingKey === saveKey

    return (
      <div className="master-combat-initiative-resource-edit">
        <div className="master-combat-initiative-resource-line">
          <span>{label}</span>

          <strong>
            {currentValue} / {maxValue}
          </strong>
        </div>

        <div
          className="master-combat-resource-input-wrapper"
          onClick={event => event.stopPropagation()}
        >
          <input
            type="text"
            className="master-combat-resource-input"
            placeholder="-20 / +20 / valor"
            value={inputs[inputKey] ?? ''}
            disabled={isSaving}
            onChange={event =>
              handleInputChange(
                participant,
                resource,
                event.target.value
              )
            }
            onKeyDown={event =>
              handleInputKeyDown(
                event,
                participant,
                resource
              )
            }
          />

          <button
            type="button"
            className="master-combat-resource-apply"
            disabled={
              isSaving ||
              !(inputs[inputKey] ?? '').trim()
            }
            onClick={() =>
              void handleResourceUpdate(
                participant,
                resource
              )
            }
          >
            {isSaving ? '...' : '✓'}
          </button>
        </div>
      </div>
    )
  }

  function renderPlayerCard(
    player: EncounterCombatPlayer
  ) {
    return (
      <div
        key={getParticipantKey(player)}
        className={`master-combat-initiative-card player ${
          isSelected(player) ? 'active' : ''
        }`}
        role="button"
        tabIndex={0}
        onClick={() =>
          onSelectParticipant({
            ...player,
            current_hp: getCurrentValue(
              player,
              'current_hp'
            ),
            current_mana: getCurrentValue(
              player,
              'current_mana'
            ),
            current_sanity: getCurrentValue(
              player,
              'current_sanity'
            )
          })
        }
      >
        <div className="master-combat-initiative-card-top">
          <div>
            <span className="master-combat-initiative-type">
              Player
            </span>

            <strong className="master-combat-initiative-name">
              {player.name}
            </strong>
          </div>

          <span className="master-combat-initiative-value">
            {player.initiative_value}
          </span>
        </div>

        <div className="master-combat-initiative-resources">
          {renderResourceInput(
            player,
            'current_hp',
            'Vida',
            player.max_hp
          )}

          {renderResourceInput(
            player,
            'current_mana',
            'Mana',
            player.max_mana
          )}

          {renderResourceInput(
            player,
            'current_sanity',
            'Sanidade',
            player.max_sanity
          )}
        </div>
      </div>
    )
  }

  function renderMonsterCard(
    monster: EncounterCombatMonster
  ) {
    const marker = monsterMarkerMap.get(
      monster.encounter_monster_id
    )

    return (
      <div
        key={getParticipantKey(monster)}
        className={`master-combat-initiative-card monster ${
          isSelected(monster) ? 'active' : ''
        }`}
        role="button"
        tabIndex={0}
        onClick={() =>
          onSelectParticipant({
            ...monster,
            current_hp: getCurrentValue(
              monster,
              'current_hp'
            )
          })
        }
      >
        <div className="master-combat-initiative-card-top">
          <div>
            <span className="master-combat-initiative-type">
              Monstro
            </span>

            <strong className="master-combat-initiative-name">
              {monster.name}
            </strong>
          </div>

          <span className="master-combat-initiative-value">
            {monster.initiative_value}
          </span>
        </div>

        {marker && (
          <div className="master-combat-monster-marker">
            <span
              className="master-combat-monster-marker-dot"
              style={{
                backgroundColor: marker.color
              }}
            />

            <span>{marker.name}</span>
          </div>
        )}

        <div className="master-combat-initiative-resources">
          {renderResourceInput(
            monster,
            'current_hp',
            'Vida',
            monster.max_hp
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="master-combat-panel master-combat-initiative">
      <div className="master-combat-panel-header">
        <div>
          <h2>Iniciativa</h2>

          <span className="master-combat-panel-subtitle">
            {participants.length}{' '}
            {participants.length === 1
              ? 'participante'
              : 'participantes'}
          </span>
        </div>
      </div>

      {resourceError && (
        <div className="master-combat-resource-error">
          {resourceError}
        </div>
      )}

      <div className="master-combat-initiative-list">
        {participants.length === 0 ? (
          <div className="master-combat-empty">
            Nenhum participante encontrado.
          </div>
        ) : (
          participants.map(participant => {
            if (isPlayer(participant)) {
              return renderPlayerCard(participant)
            }

            return renderMonsterCard(participant)
          })
        )}
      </div>
    </div>
  )
}

export default MasterCombatInitiativeList
