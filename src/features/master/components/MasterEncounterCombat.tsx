import { useEffect, useState } from 'react'
import { fetchEncounterCombat } from '../encounters.service'
import type {
  EncounterCombat,
  EncounterCombatParticipant
} from '../encounters.types'
import MasterCombatInitiativeList from './MasterCombatInitiativeList'
import MasterCombatNavbar from './MasterCombatNavbar'
import MasterCombatSheet from './MasterCombatSheet'

type Props = {
  encounterId: number
  onBack?: () => void
}

function MasterEncounterCombat({
  encounterId,
  onBack
}: Props) {
  const [combat, setCombat] =
    useState<EncounterCombat | null>(null)

  const [
    selectedParticipant,
    setSelectedParticipant
  ] = useState<EncounterCombatParticipant | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    setCombat(null)
    setSelectedParticipant(null)

    fetchEncounterCombat(encounterId)
      .then(response => {
        const loadedCombat = response.combat

        setCombat(loadedCombat)

        setSelectedParticipant(
          loadedCombat.turn_order[0] ?? null
        )
      })
      .catch(() => {
        setError(
          'Erro ao carregar o combate.'
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }, [encounterId])

  if (loading) {
    return (
      <section className="master-combat-loading">
        Carregando combate...
      </section>
    )
  }

  if (error || !combat) {
    return (
      <section className="master-combat-error">
        <p>
          {error ?? 'Combate não encontrado.'}
        </p>

        {onBack && (
          <button
            type="button"
            className="master-wizard-btn ghost"
            onClick={onBack}
          >
            Voltar
          </button>
        )}
      </section>
    )
  }

  return (
    <section className="master-combat">
      <aside className="master-combat-left">
        <MasterCombatInitiativeList
          participants={combat.turn_order}
          selectedParticipant={selectedParticipant}
          onSelectParticipant={setSelectedParticipant}
        />
      </aside>

      <div className="master-combat-right">
        <MasterCombatNavbar
          onBack={onBack}
        />

        <MasterCombatSheet
          campaignId={combat.campaign_id}
          participant={selectedParticipant}
        />
      </div>
    </section>
  )
}

export default MasterEncounterCombat
