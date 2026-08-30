import {
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import type {
  DragEvent,
  KeyboardEvent
} from 'react'
import {
  updateEncounterInitiative,
  updateEncounterResources
} from '../encounters.service'
import type {
  EncounterCombatMonster,
  EncounterCombatParticipant,
  EncounterCombatPlayer,
  EncounterResource,
  EncounterResourceUpdateMode
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

type ResourceValues = {
  current_hp: number
  max_hp: number
  current_mana?: number
  max_mana?: number
  current_sanity?: number
  max_sanity?: number
}

type ParticipantResources = Record<string, ResourceValues>

type ResourceInputs = Record<string, string>

type ResourceOperation = {
  mode: EncounterResourceUpdateMode
  value: number
}

type DropPosition = 'before' | 'after'

type DropTarget = {
  key: string
  position: DropPosition
}

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

  const [orderedParticipants, setOrderedParticipants] =
    useState<EncounterCombatParticipant[]>(participants)

  const [isReorderMode, setIsReorderMode] =
    useState(false)

  const [draggedKey, setDraggedKey] =
    useState<string | null>(null)

  const [dropTarget, setDropTarget] =
    useState<DropTarget | null>(null)

  const [initiativeSaving, setInitiativeSaving] =
    useState(false)

  const [initiativeError, setInitiativeError] =
    useState<string | null>(null)

  const dragStartOrderRef =
    useRef<EncounterCombatParticipant[] | null>(null)

  useEffect(() => {
    setOrderedParticipants(participants)

    const initialResources: ParticipantResources = {}

    participants.forEach(participant => {
      const key = getParticipantKey(participant)

      if (isPlayer(participant)) {
        initialResources[key] = {
          current_hp: participant.current_hp,
          max_hp: participant.max_hp,
          current_mana: participant.current_mana,
          max_mana: participant.max_mana,
          current_sanity: participant.current_sanity,
          max_sanity: participant.max_sanity
        }

        return
      }

      initialResources[key] = {
        current_hp: participant.current_hp,
        max_hp: participant.max_hp
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
    resource: EncounterResource
  ): number {
    const key = getParticipantKey(participant)
    const current = resources[key]

    if (resource === 'hp') {
      return current?.current_hp
        ?? participant.current_hp
    }

    if (!isPlayer(participant)) {
      return 0
    }

    if (resource === 'mana') {
      return current?.current_mana
        ?? participant.current_mana
    }

    return current?.current_sanity
      ?? participant.current_sanity
  }

  function getMaxValue(
    participant: EncounterCombatParticipant,
    resource: EncounterResource
  ): number {
    const key = getParticipantKey(participant)
    const current = resources[key]

    if (resource === 'hp') {
      return current?.max_hp
        ?? participant.max_hp
    }

    if (!isPlayer(participant)) {
      return 0
    }

    if (resource === 'mana') {
      return current?.max_mana
        ?? participant.max_mana
    }

    return current?.max_sanity
      ?? participant.max_sanity
  }

  function getParticipantWithCurrentResources(
    participant: EncounterCombatParticipant
  ): EncounterCombatParticipant {
    if (isPlayer(participant)) {
      return {
        ...participant,
        current_hp: getCurrentValue(
          participant,
          'hp'
        ),
        max_hp: getMaxValue(
          participant,
          'hp'
        ),
        current_mana: getCurrentValue(
          participant,
          'mana'
        ),
        max_mana: getMaxValue(
          participant,
          'mana'
        ),
        current_sanity: getCurrentValue(
          participant,
          'sanity'
        ),
        max_sanity: getMaxValue(
          participant,
          'sanity'
        )
      }
    }

    return {
      ...participant,
      current_hp: getCurrentValue(
        participant,
        'hp'
      ),
      max_hp: getMaxValue(
        participant,
        'hp'
      )
    }
  }

  function getInputKey(
    participant: EncounterCombatParticipant,
    resource: EncounterResource
  ): string {
    return `${getParticipantKey(participant)}-${resource}`
  }

  function parseResourceOperation(
    rawValue: string
  ): ResourceOperation | null {
    const value = rawValue.trim()

    if (!value) {
      return null
    }

    if (/^\+\d+$/.test(value)) {
      return {
        mode: 'delta',
        value: Number(value.slice(1))
      }
    }

    if (/^-\d+$/.test(value)) {
      return {
        mode: 'delta',
        value: -Number(value.slice(1))
      }
    }

    if (/^\d+$/.test(value)) {
      return {
        mode: 'set',
        value: Number(value)
      }
    }

    return null
  }

  async function handleResourceUpdate(
    participant: EncounterCombatParticipant,
    resource: EncounterResource
  ) {
    const participantKey =
      getParticipantKey(participant)

    const inputKey =
      getInputKey(participant, resource)

    const rawValue = inputs[inputKey]

    if (!rawValue?.trim()) {
      return
    }

    const operation =
      parseResourceOperation(rawValue)

    if (!operation) {
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
        const response =
          await updateEncounterResources({
            type: 'player',
            encounter_player_id:
              participant.encounter_player_id,
            resource,
            mode: operation.mode,
            value: operation.value
          })

        if (response.resources.type !== 'player') {
          throw new Error(
            'Resposta inválida ao atualizar player.'
          )
        }

        const updated = response.resources

        setResources(current => ({
          ...current,
          [participantKey]: {
            current_hp: updated.current_hp,
            max_hp: updated.max_hp,
            current_mana: updated.current_mana,
            max_mana: updated.max_mana,
            current_sanity: updated.current_sanity,
            max_sanity: updated.max_sanity
          }
        }))

        if (isSelected(participant)) {
          onSelectParticipant({
            ...participant,
            current_hp: updated.current_hp,
            max_hp: updated.max_hp,
            current_mana: updated.current_mana,
            max_mana: updated.max_mana,
            current_sanity: updated.current_sanity,
            max_sanity: updated.max_sanity
          })
        }
      } else {
        const response =
          await updateEncounterResources({
            type: 'monster',
            encounter_monster_id:
              participant.encounter_monster_id,
            resource: 'hp',
            mode: operation.mode,
            value: operation.value
          })

        if (response.resources.type !== 'monster') {
          throw new Error(
            'Resposta inválida ao atualizar monstro.'
          )
        }

        const updated = response.resources

        setResources(current => ({
          ...current,
          [participantKey]: {
            current_hp: updated.current_hp,
            max_hp: updated.max_hp
          }
        }))

        if (isSelected(participant)) {
          onSelectParticipant({
            ...participant,
            current_hp: updated.current_hp,
            max_hp: updated.max_hp
          })
        }
      }

      setInputs(current => ({
        ...current,
        [inputKey]: ''
      }))
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
    resource: EncounterResource,
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
    event: KeyboardEvent<HTMLInputElement>,
    participant: EncounterCombatParticipant,
    resource: EncounterResource
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

  function toggleReorderMode() {
    if (initiativeSaving) {
      return
    }

    setIsReorderMode(current => !current)
    setDraggedKey(null)
    setDropTarget(null)
    setInitiativeError(null)
  }

  function handleDragStart(
    event: DragEvent<HTMLDivElement>,
    participant: EncounterCombatParticipant
  ) {
    if (!isReorderMode || initiativeSaving) {
      event.preventDefault()
      return
    }

    const key = getParticipantKey(participant)

    dragStartOrderRef.current = [
      ...orderedParticipants
    ]

    setDraggedKey(key)
    setInitiativeError(null)

    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData(
      'text/plain',
      key
    )
  }

  function handleDragOver(
    event: DragEvent<HTMLDivElement>,
    participant: EncounterCombatParticipant
  ) {
    if (!isReorderMode || !draggedKey) {
      return
    }

    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'

    const targetKey =
      getParticipantKey(participant)

    if (targetKey === draggedKey) {
      setDropTarget(null)
      return
    }

    const rect =
      event.currentTarget.getBoundingClientRect()

    const middle =
      rect.top + rect.height / 2

    const position: DropPosition =
      event.clientY < middle
        ? 'before'
        : 'after'

    setDropTarget({
      key: targetKey,
      position
    })
  }

  function moveParticipant(
    current: EncounterCombatParticipant[],
    sourceKey: string,
    targetKey: string,
    position: DropPosition
  ): EncounterCombatParticipant[] {
    const sourceIndex =
      current.findIndex(
        participant =>
          getParticipantKey(participant) === sourceKey
      )

    if (sourceIndex < 0) {
      return current
    }

    const next = [...current]

    const [movedParticipant] =
      next.splice(sourceIndex, 1)

    const targetIndex =
      next.findIndex(
        participant =>
          getParticipantKey(participant) === targetKey
      )

    if (targetIndex < 0) {
      return current
    }

    const insertIndex =
      position === 'after'
        ? targetIndex + 1
        : targetIndex

    next.splice(
      insertIndex,
      0,
      movedParticipant
    )

    return next
  }

  function haveSameOrder(
    first: EncounterCombatParticipant[],
    second: EncounterCombatParticipant[]
  ): boolean {
    if (first.length !== second.length) {
      return false
    }

    return first.every(
      (participant, index) =>
        getParticipantKey(participant) ===
        getParticipantKey(second[index])
    )
  }

  function buildInitiativeChanges(
    nextOrder: EncounterCombatParticipant[],
    movedKey: string
  ): Map<string, number> {
    const changes = new Map<string, number>()

    const movedIndex =
      nextOrder.findIndex(
        participant =>
          getParticipantKey(participant) === movedKey
      )

    if (movedIndex < 0) {
      return changes
    }

    const movedParticipant =
      nextOrder[movedIndex]

    if (nextOrder.length === 1) {
      return changes
    }

    if (movedIndex === 0) {
      const otherValues = nextOrder
        .slice(1)
        .map(
          participant =>
            participant.initiative_value
        )

      const highest =
        Math.max(...otherValues)

      changes.set(
        getParticipantKey(movedParticipant),
        highest + 1
      )

      return changes
    }

    if (
      movedIndex ===
      nextOrder.length - 1
    ) {
      const otherValues = nextOrder
        .slice(0, -1)
        .map(
          participant =>
            participant.initiative_value
        )

      const lowest =
        Math.min(...otherValues)

      if (lowest > 1) {
        changes.set(
          getParticipantKey(movedParticipant),
          lowest - 1
        )

        return changes
      }

      return buildNormalizedInitiatives(
        nextOrder
      )
    }

    const above =
      nextOrder[movedIndex - 1]

    const below =
      nextOrder[movedIndex + 1]

    const aboveValue =
      above.initiative_value

    const belowValue =
      below.initiative_value

    if (
      aboveValue > belowValue &&
      aboveValue - belowValue >= 2
    ) {
      const newValue = Math.floor(
        (aboveValue + belowValue) / 2
      )

      changes.set(
        getParticipantKey(movedParticipant),
        newValue
      )

      return changes
    }

    return buildNormalizedInitiatives(
      nextOrder
    )
  }

  function buildNormalizedInitiatives(
    nextOrder: EncounterCombatParticipant[]
  ): Map<string, number> {
    const changes = new Map<string, number>()

    const highestValue =
      nextOrder.length * 10

    nextOrder.forEach(
      (participant, index) => {
        changes.set(
          getParticipantKey(participant),
          highestValue - index * 10
        )
      }
    )

    return changes
  }

  async function persistInitiativeOrder(
    nextOrder: EncounterCombatParticipant[],
    movedKey: string
  ): Promise<EncounterCombatParticipant[]> {
    const initiativeChanges =
      buildInitiativeChanges(
        nextOrder,
        movedKey
      )

    const changes = nextOrder
      .map(participant => {
        const key =
          getParticipantKey(participant)

        const newValue =
          initiativeChanges.get(key)

        if (
          newValue === undefined ||
          newValue === participant.initiative_value
        ) {
          return null
        }

        return {
          participant,
          newValue
        }
      })
      .filter(
        (
          change
        ): change is {
          participant: EncounterCombatParticipant
          newValue: number
        } => change !== null
      )

    for (const change of changes) {
      if (!change.participant.initiative_id) {
        throw new Error(
          'Participante sem iniciativa definida.'
        )
      }
    }

    await Promise.all(
      changes.map(change =>
        updateEncounterInitiative({
          initiative_id:
            change.participant.initiative_id,
          initiative_value:
            change.newValue
        })
      )
    )

    return nextOrder.map(participant => {
      const key =
        getParticipantKey(participant)

      const newValue =
        initiativeChanges.get(key)

      if (newValue === undefined) {
        return participant
      }

      return {
        ...participant,
        initiative_value: newValue
      }
    })
  }

  async function handleDrop(
    event: DragEvent<HTMLDivElement>,
    targetParticipant: EncounterCombatParticipant
  ) {
    event.preventDefault()
    event.stopPropagation()

    if (
      !isReorderMode ||
      !draggedKey ||
      initiativeSaving
    ) {
      return
    }

    const targetKey =
      getParticipantKey(targetParticipant)

    if (targetKey === draggedKey) {
      setDraggedKey(null)
      setDropTarget(null)
      return
    }

    const rect =
      event.currentTarget.getBoundingClientRect()

    const middle =
      rect.top + rect.height / 2

    const position: DropPosition =
      event.clientY < middle
        ? 'before'
        : 'after'

    const originalOrder =
      dragStartOrderRef.current
        ? [...dragStartOrderRef.current]
        : [...orderedParticipants]

    const nextOrder =
      moveParticipant(
        orderedParticipants,
        draggedKey,
        targetKey,
        position
      )

    setDraggedKey(null)
    setDropTarget(null)

    if (
      haveSameOrder(
        originalOrder,
        nextOrder
      )
    ) {
      dragStartOrderRef.current = null
      return
    }

    setOrderedParticipants(nextOrder)

    try {
      setInitiativeSaving(true)
      setInitiativeError(null)

      const savedOrder =
        await persistInitiativeOrder(
          nextOrder,
          draggedKey
        )

      setOrderedParticipants(savedOrder)

      if (selectedParticipant) {
        const selectedKey =
          getParticipantKey(selectedParticipant)

        const updatedSelected =
          savedOrder.find(
            participant =>
              getParticipantKey(participant) ===
              selectedKey
          )

        if (updatedSelected) {
          onSelectParticipant(
            getParticipantWithCurrentResources(
              updatedSelected
            )
          )
        }
      }
    } catch {
      setOrderedParticipants(originalOrder)

      setInitiativeError(
        'Erro ao atualizar a ordem de iniciativa.'
      )
    } finally {
      setInitiativeSaving(false)
      dragStartOrderRef.current = null
    }
  }

  function handleDragEnd() {
    setDraggedKey(null)
    setDropTarget(null)
  }

  function renderResourceInput(
    participant: EncounterCombatParticipant,
    resource: EncounterResource,
    label: string
  ) {
    const inputKey =
      getInputKey(participant, resource)

    const saveKey =
      `${getParticipantKey(participant)}-${resource}`

    const currentValue =
      getCurrentValue(participant, resource)

    const maxValue =
      getMaxValue(participant, resource)

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
          onClick={event =>
            event.stopPropagation()
          }
        >
          <input
            type="text"
            className="master-combat-resource-input"
            placeholder="-20 / +20 / valor"
            value={inputs[inputKey] ?? ''}
            disabled={
              isSaving ||
              isReorderMode
            }
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
              isReorderMode ||
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

  function getCardClassName(
    participant: EncounterCombatParticipant,
    type: 'player' | 'monster'
  ): string {
    const key =
      getParticipantKey(participant)

    const classes = [
      'master-combat-initiative-card',
      type
    ]

    if (isSelected(participant)) {
      classes.push('active')
    }

    if (isReorderMode) {
      classes.push('reorder-enabled')
    }

    if (draggedKey === key) {
      classes.push('dragging')
    }

    if (
      dropTarget?.key === key &&
      draggedKey !== key
    ) {
      classes.push(
        dropTarget.position === 'before'
          ? 'drop-before'
          : 'drop-after'
      )
    }

    return classes.join(' ')
  }

  function renderPlayerCard(
    player: EncounterCombatPlayer
  ) {
    return (
      <div
        key={getParticipantKey(player)}
        className={getCardClassName(
          player,
          'player'
        )}
        role="button"
        tabIndex={0}
        draggable={
          isReorderMode &&
          !initiativeSaving
        }
        onClick={() => {
          if (isReorderMode) {
            return
          }

          onSelectParticipant(
            getParticipantWithCurrentResources(
              player
            )
          )
        }}
        onDragStart={event =>
          handleDragStart(
            event,
            player
          )
        }
        onDragOver={event =>
          handleDragOver(
            event,
            player
          )
        }
        onDrop={event =>
          void handleDrop(
            event,
            player
          )
        }
        onDragEnd={handleDragEnd}
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

          <div className="master-combat-initiative-value-wrapper">
            {isReorderMode && (
              <span className="master-combat-initiative-drag-hint">
                ↕
              </span>
            )}

            <span className="master-combat-initiative-value">
              {player.initiative_value}
            </span>
          </div>
        </div>

        <div className="master-combat-initiative-resources">
          {renderResourceInput(
            player,
            'hp',
            'Vida'
          )}

          {renderResourceInput(
            player,
            'mana',
            'Mana'
          )}

          {renderResourceInput(
            player,
            'sanity',
            'Sanidade'
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
        className={getCardClassName(
          monster,
          'monster'
        )}
        role="button"
        tabIndex={0}
        draggable={
          isReorderMode &&
          !initiativeSaving
        }
        onClick={() => {
          if (isReorderMode) {
            return
          }

          onSelectParticipant(
            getParticipantWithCurrentResources(
              monster
            )
          )
        }}
        onDragStart={event =>
          handleDragStart(
            event,
            monster
          )
        }
        onDragOver={event =>
          handleDragOver(
            event,
            monster
          )
        }
        onDrop={event =>
          void handleDrop(
            event,
            monster
          )
        }
        onDragEnd={handleDragEnd}
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

          <div className="master-combat-initiative-value-wrapper">
            {isReorderMode && (
              <span className="master-combat-initiative-drag-hint">
                ↕
              </span>
            )}

            <span className="master-combat-initiative-value">
              {monster.initiative_value}
            </span>
          </div>
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
            'hp',
            'Vida'
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
            {orderedParticipants.length}{' '}
            {orderedParticipants.length === 1
              ? 'participante'
              : 'participantes'}
          </span>
        </div>

        <button
          type="button"
          className={`master-combat-initiative-reorder-toggle ${
            isReorderMode ? 'active' : ''
          }`}
          disabled={
            initiativeSaving ||
            orderedParticipants.length < 2
          }
          onClick={toggleReorderMode}
        >
          {initiativeSaving
            ? 'Salvando...'
            : isReorderMode
              ? 'Concluir'
              : 'Reordenar'}
        </button>
      </div>

      {isReorderMode && (
        <div className="master-combat-initiative-reorder-notice">
          Arraste os cards para alterar a ordem de iniciativa.
        </div>
      )}

      {initiativeError && (
        <div className="master-combat-initiative-error">
          {initiativeError}
        </div>
      )}

      {resourceError && (
        <div className="master-combat-resource-error">
          {resourceError}
        </div>
      )}

      <div className="master-combat-initiative-list">
        {orderedParticipants.length === 0 ? (
          <div className="master-combat-empty">
            Nenhum participante encontrado.
          </div>
        ) : (
          orderedParticipants.map(
            participant => {
              if (isPlayer(participant)) {
                return renderPlayerCard(
                  participant
                )
              }

              return renderMonsterCard(
                participant
              )
            }
          )
        )}
      </div>
    </div>
  )
}

export default MasterCombatInitiativeList
