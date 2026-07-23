import { useEffect, useMemo, useState } from 'react'
import {
    fetchEncounterParticipants,
    setEncounterInitiative,
    updateEncounterStatus,
} from '../encounters.service'

type SetupParticipant = {
    key: string
    type: 'player' | 'monster'
    targetId: number
    name: string
    displayName: string
    initiative: string
}

type Props = {
    encounterId: number
    onCombatStarted: () => void
    onBack: () => void
}

function MasterEncounterCombatSetup({
    encounterId,
    onCombatStarted,
    onBack,
}: Props) {
    const [participants, setParticipants] = useState<SetupParticipant[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        void loadParticipants()
    }, [encounterId])

    async function loadParticipants() {
        try {
            setIsLoading(true)
            setError(null)

            const response = await fetchEncounterParticipants(encounterId)
            const data = response.participants

            const players: SetupParticipant[] = data.players.map(player => ({
                key: `player-${player.encounter_player_id}`,
                type: 'player',
                targetId: player.encounter_player_id,
                name: player.character_name,
                displayName: player.character_name,
                initiative: '',
            }))

            const monsterNameCount = new Map<string, number>()

            data.monsters.forEach(monster => {
                const currentCount =
                    monsterNameCount.get(monster.monster_name) ?? 0

                monsterNameCount.set(
                    monster.monster_name,
                    currentCount + 1
                )
            })

            const monsterCurrentIndex = new Map<string, number>()

            const monsters: SetupParticipant[] = data.monsters.map(monster => {
                const currentIndex =
                    (monsterCurrentIndex.get(monster.monster_name) ?? 0) + 1

                monsterCurrentIndex.set(
                    monster.monster_name,
                    currentIndex
                )

                const total =
                    monsterNameCount.get(monster.monster_name) ?? 1

                return {
                    key: `monster-${monster.encounter_monster_id}`,
                    type: 'monster',
                    targetId: monster.encounter_monster_id,
                    name: monster.monster_name,
                    displayName:
                        total > 1
                            ? `${monster.monster_name} ${currentIndex}`
                            : monster.monster_name,
                    initiative: '',
                }
            })

            setParticipants([...players, ...monsters])
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Não foi possível carregar os participantes.'
            )
        } finally {
            setIsLoading(false)
        }
    }

    function handleInitiativeChange(key: string, value: string) {
        const sanitizedValue = value.replace(/\D/g, '')

        setParticipants(current =>
            current.map(participant =>
                participant.key === key
                    ? {
                          ...participant,
                          initiative: sanitizedValue,
                      }
                    : participant
            )
        )
    }

    const hasInvalidInitiative = useMemo(() => {
        return participants.some(participant => {
            const initiative = Number(participant.initiative)

            return (
                participant.initiative.trim() === '' ||
                !Number.isInteger(initiative) ||
                initiative < 0
            )
        })
    }, [participants])

    async function handleStartCombat() {
        if (participants.length === 0) {
            setError('O encontro não possui participantes.')
            return
        }

        if (hasInvalidInitiative) {
            setError('Informe uma iniciativa válida para todos.')
            return
        }

        try {
            setIsSubmitting(true)
            setError(null)

            for (const participant of participants) {
                await setEncounterInitiative({
                    encounter_id: encounterId,
                    initiative_value: Number(participant.initiative),
                    encounter_player_id:
                        participant.type === 'player'
                            ? participant.targetId
                            : undefined,
                    encounter_monster_id:
                        participant.type === 'monster'
                            ? participant.targetId
                            : undefined,
                })
            }

            await updateEncounterStatus({
                encounter_id: encounterId,
                status: 'active',
            })

            onCombatStarted()
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Não foi possível iniciar o combate.'
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="master-encounter-combat-setup">
                <span className="empty-text">
                    Carregando participantes...
                </span>
            </div>
        )
    }

    return (
        <div className="master-encounter-combat-setup">
            <div className="combat-setup-header">
                <div>
                    <h2>Definir iniciativas</h2>

                    <p>
                        Informe a iniciativa de todos os participantes antes de
                        começar o combate.
                    </p>
                </div>

                <button
                    type="button"
                    className="secondary-button"
                    onClick={onBack}
                    disabled={isSubmitting}
                >
                    Voltar
                </button>
            </div>

            {error && (
                <div className="combat-setup-error">
                    {error}
                </div>
            )}

            {participants.length === 0 ? (
                <div className="combat-setup-empty">
                    Nenhum participante foi adicionado ao encontro.
                </div>
            ) : (
                <div className="combat-setup-list">
                    {participants.map(participant => (
                        <div
                            key={participant.key}
                            className={`combat-setup-participant combat-setup-participant-${participant.type}`}
                        >
                            <div className="combat-setup-participant-info">
                                <span className="combat-setup-participant-name">
                                    {participant.displayName}
                                </span>

                                <span className="combat-setup-participant-type">
                                    {participant.type === 'player'
                                        ? 'Player'
                                        : 'Monstro'}
                                </span>
                            </div>

                            <label className="combat-setup-initiative">
                                <span>Iniciativa</span>

                                <input
                                    type="number"
                                    min={0}
                                    step={1}
                                    value={participant.initiative}
                                    onChange={event =>
                                        handleInitiativeChange(
                                            participant.key,
                                            event.target.value
                                        )
                                    }
                                    disabled={isSubmitting}
                                />
                            </label>
                        </div>
                    ))}
                </div>
            )}

            <div className="combat-setup-actions">
                <button
                    type="button"
                    className="primary-button"
                    onClick={handleStartCombat}
                    disabled={
                        isSubmitting ||
                        participants.length === 0 ||
                        hasInvalidInitiative
                    }
                >
                    {isSubmitting
                        ? 'Iniciando combate...'
                        : 'Começar combate'}
                </button>
            </div>
        </div>
    )
}

export default MasterEncounterCombatSetup
