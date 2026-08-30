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
  active: 'Em combate',
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
      <section className="master-encounter-sheet">
        <div className="master-encounter-state">
          Carregando encontro...
        </div>
      </section>
    )
  }

  if (error || !encounter || !participants) {
    return (
      <section className="master-encounter-sheet">
        <div className="master-encounter-state error">
          {error ?? 'Encontro não encontrado.'}
        </div>
      </section>
    )
  }

  const playerCount =
    participants.players.length

  const monsterCount =
    participants.monsters.length

  const totalParticipants =
    playerCount + monsterCount

  const hasParticipants =
    totalParticipants > 0

  const isPending =
    encounter.status === 'pending'

  const isActive =
    encounter.status === 'active'

  const isFinished =
    encounter.status === 'finished'

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
    <section className="master-encounter-sheet">
      <header className="master-encounter-hero">
        <div className="master-encounter-hero-info">
          <div className="master-encounter-title-row">
            <h1>{encounter.name}</h1>

            <span
              className={`master-encounter-status ${encounter.status}`}
            >
              {statusLabels[encounter.status]}
            </span>
          </div>

          <p>
            {isPending &&
              'Prepare os participantes e configure o encontro antes de iniciar o combate.'}

            {isActive &&
              'Este encontro está em andamento. Continue de onde a batalha parou.'}

            {isFinished &&
              'Este encontro já foi finalizado.'}
          </p>
        </div>

        <div className="master-encounter-actions">
          <button
            className="master-encounter-button secondary"
            type="button"
            onClick={onAddParticipants}
            disabled={!isPending}
          >
            Adicionar participantes
          </button>

          <button
            className="master-encounter-button primary"
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
      </header>

      <div className="master-encounter-summary">
        <div className="master-encounter-summary-card">
          <span>Participantes</span>
          <strong>{totalParticipants}</strong>
        </div>

        <div className="master-encounter-summary-card player">
          <span>Personagens</span>
          <strong>{playerCount}</strong>
        </div>

        <div className="master-encounter-summary-card monster">
          <span>Monstros</span>
          <strong>{monsterCount}</strong>
        </div>

        <div className="master-encounter-summary-card">
          <span>Estado</span>
          <strong>
            {statusLabels[encounter.status]}
          </strong>
        </div>
      </div>

      <div className="master-encounter-content-grid">
        <div className="master-encounter-section">
          <div className="master-encounter-section-header">
            <div>
              <span className="master-encounter-section-eyebrow">
                Informações
              </span>

              <h2>Descrição</h2>
            </div>
          </div>

          <div className="master-encounter-description">
            {encounter.description?.trim() ? (
              <p>{encounter.description}</p>
            ) : (
              <p className="empty">
                Nenhuma descrição definida para este encontro.
              </p>
            )}
          </div>
        </div>

        <div className="master-encounter-section participants">
          <div className="master-encounter-section-header">
            <div>
              <span className="master-encounter-section-eyebrow">
                Formação
              </span>

              <h2>Participantes</h2>
            </div>

            {isPending && (
              <button
                type="button"
                className="master-encounter-small-action"
                onClick={onAddParticipants}
              >
                + Adicionar
              </button>
            )}
          </div>

          <div className="master-encounter-participant-columns">
            <div className="master-encounter-participant-group">
              <div className="master-encounter-participant-group-header">
                <div>
                  <span className="master-encounter-group-indicator player" />

                  <h3>Personagens</h3>
                </div>

                <span className="master-encounter-count">
                  {playerCount}
                </span>
              </div>

              {playerCount === 0 ? (
                <div className="master-encounter-empty-list">
                  Nenhum personagem adicionado.
                </div>
              ) : (
                <div className="master-encounter-participant-list">
                  {participants.players.map(
                    (player, index) => (
                      <div
                        key={player.encounter_player_id}
                        className="master-encounter-participant-card player"
                      >
                        <div className="master-encounter-participant-avatar player">
                          {index + 1}
                        </div>

                        <div className="master-encounter-participant-info">
                          <strong>
                            {player.character_name}
                          </strong>

                          <span>Personagem</span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            <div className="master-encounter-participant-group">
              <div className="master-encounter-participant-group-header">
                <div>
                  <span className="master-encounter-group-indicator monster" />

                  <h3>Monstros</h3>
                </div>

                <span className="master-encounter-count">
                  {monsterCount}
                </span>
              </div>

              {monsterCount === 0 ? (
                <div className="master-encounter-empty-list">
                  Nenhum monstro adicionado.
                </div>
              ) : (
                <div className="master-encounter-participant-list">
                  {participants.monsters.map(
                    (monster, index) => (
                      <div
                        key={monster.encounter_monster_id}
                        className="master-encounter-participant-card monster"
                      >
                        <div className="master-encounter-participant-avatar monster">
                          {index + 1}
                        </div>

                        <div className="master-encounter-participant-info">
                          <strong>
                            {monster.monster_name}
                          </strong>

                          <span>Monstro</span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MasterEncounterSheet
