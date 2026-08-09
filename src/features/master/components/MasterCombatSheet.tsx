import MasterMonsterSheet from './MasterMonsterSheet'
import MasterCombatPlayerSheet from './MasterCombatPlayerSheet'
import type {
  EncounterCombatParticipant
} from '../encounters.types'

type Props = {
  campaignId: number
  participant: EncounterCombatParticipant | null
}

function MasterCombatSheet({
  campaignId,
  participant
}: Props) {
  if (!participant) {
    return (
      <div className="master-combat-panel master-combat-sheet">
        <div className="master-combat-panel-header">
          <div>
            <span className="master-combat-panel-eyebrow">
              Participante selecionado
            </span>

            <h2>Ficha de combate</h2>
          </div>
        </div>

        <div className="master-combat-panel-content">
          <p>
            Selecione alguém na iniciativa para visualizar a ficha.
          </p>
        </div>
      </div>
    )
  }

  if (participant.type === 'monster') {
    return (
      <div className="master-combat-sheet-scroll">
        <MasterMonsterSheet
          monsterId={participant.monster_id}
        />
      </div>
    )
  }

  return (
    <div className="master-combat-sheet-scroll">
      <MasterCombatPlayerSheet
        campaignId={campaignId}
        characterId={participant.character_id}
      />
    </div>
  )
}

export default MasterCombatSheet
