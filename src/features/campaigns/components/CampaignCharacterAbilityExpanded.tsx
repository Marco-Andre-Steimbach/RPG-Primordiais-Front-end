import { useNavigate } from 'react-router-dom'
import type { Ability } from '../campaigns.types'

type Props = {
  ability: Ability
  canAdd: boolean
  onAdd: (abilityId: number) => void
}

function CampaignCharacterAbilityExpanded({
  ability,
  canAdd,
  onAdd
}: Props) {
  const navigate = useNavigate()

  return (
    <div className="campaign-ability-expanded">
      <button
        className="campaign-ability-button"
        onClick={() => navigate(`/abilities/${ability.id}`)}
      >
        Visualizar habilidade
      </button>

      {canAdd && (
        <button
          className="campaign-ability-button primary"
          onClick={() => onAdd(ability.id)}
        >
          Adicionar habilidade
        </button>
      )}

      {!canAdd && (
        <span className="campaign-ability-locked">
          Limite de habilidades atingido
        </span>
      )}
    </div>
  )
}

export default CampaignCharacterAbilityExpanded
