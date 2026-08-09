import { useEffect, useState } from 'react'
import {
  fetchEncounterById,
  fetchEncounterParticipants
} from '../encounters.service'
import type {
  EncounterDetails,
  EncounterParticipants
} from '../encounters.types'

type Props = {
  encounterId: number
  onAddParticipants: () => void
  onStartCombat: () => void
  onOpenCombat: () => void
}

const statusLabels = {
  pending: 'Pendente',
  active: 'Ativo',
  finished: 'Finalizado'
}

function MasterEncounterSheet({
  encounterId,
  onAddParticipants,
  onStartCombat,
  onOpenCombat
}: Props) {
  const [encounter, setEncounter] =
    useState<EncounterDetails | null>(null)

  const [participants, setParticipants] =
    useState<EncounterParticipants | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    setEncounter(null)
    setParticipants(null)

    Promise.all([
      fetchEncounterById(encounterId),
      fetchEncounterParticipants(encounterId)
    ])
      .then(([encounterResponse, participantsResponse]) => {
        setEncounter(encounterResponse.encounter)
        setParticipants(participantsResponse.participants)
      })
      .catch(() => {
        setError('Erro ao carregar encontro.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [encounterId])

  if (loading) {
    return (
      <section className="master-sheet card">
        Carregando encontro...
      </section>
    )
  }

  if (error || !encounter || !participants) {
    return (
      <section className="master-sheet card">
        {error ?? 'Encontro não encontrado.'}
      </section>
    )
  }

  const hasParticipants =
    participants.players.length > 0 ||
    participants.monsters.length > 0

  const isPending = encounter.status === 'pending'
  const isActive = encounter.status === 'active'
  const isFinished = encounter.status === 'finished'

  function handleCombatClick() {
    if (isActive) {
      onOpenCombat()
      return
    }

    if (isPending) {
      onStartCombat()
    }
  }

  return (
    <section className="master-sheet card">
      <div className="master-sheet-header">
        <div>
          <h2>{encounter.name}</h2>
          <span>{statusLabels[encounter.status]}</span>
        </div>

        <div className="master-wizard-actions">
          <button
            className="master-wizard-btn ghost"
            type="button"
            onClick={onAddParticipants}
            disabled={!isPending}
          >
            Adicionar participantes
          </button>

          <button
            className="master-wizard-btn primary"
            type="button"
            onClick={handleCombatClick}
            disabled={
              isFinished ||
              (isPending && !hasParticipants)
            }
          >
            {isActive
              ? 'Abrir combate'
              : isFinished
                ? 'Combate finalizado'
                : 'Iniciar combate'}
          </button>
        </div>
      </div>

      <div className="master-wizard-panel">
        <h3>Descrição</h3>

        <p>
          {encounter.description || 'Sem descrição.'}
        </p>
      </div>

      <div className="master-wizard-panel">
        <h3>Participantes</h3>

        <div>
          <h4>Personagens</h4>

          {participants.players.length === 0 ? (
            <p>Nenhum personagem adicionado.</p>
          ) : (
            <ul>
              {participants.players.map(player => (
                <li key={player.encounter_player_id}>
                  {player.character_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h4>Monstros</h4>

          {participants.monsters.length === 0 ? (
            <p>Nenhum monstro adicionado.</p>
          ) : (
            <ul>
              {participants.monsters.map(monster => (
                <li key={monster.encounter_monster_id}>
                  {monster.monster_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

export default MasterEncounterSheet
