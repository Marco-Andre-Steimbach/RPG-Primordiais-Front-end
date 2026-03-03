import { useState } from 'react'
import { useArmorCreation } from '../hooks/useArmorCreation'
import ArmorAbilityForm from './ArmorAbilityForm'
import ArmorAbilitySelect from './ArmorAbilitySelect'

type Props = {
  loading: boolean
  onNext: () => void
  armor: ReturnType<typeof useArmorCreation>
}

function ArmorAbilityStep({
  loading,
  onNext,
  armor
}: Props) {
  const [showCreate, setShowCreate] = useState(false)

  async function handleCreateAbility(payload: any) {
    await armor.createNewAbility(payload)
    setShowCreate(false)
  }

  return (
    <div className="master-form">
      <h3 className="master-form-title">
        Habilidades da armadura
      </h3>

      <ArmorAbilitySelect
        armor={armor}
        disabled={loading}
      />

      <div style={{ marginTop: 24 }}>
        {!showCreate ? (
          <button
            type="button"
            className="master-wizard-btn ghost"
            onClick={() => setShowCreate(true)}
          >
            Criar nova habilidade
          </button>
        ) : (
          <ArmorAbilityForm
            loading={loading}
            onSubmit={handleCreateAbility}
          />
        )}
      </div>

      <div style={{ marginTop: 24 }}>
        <button
          className="master-wizard-btn primary"
          onClick={onNext}
          disabled={loading}
        >
          Ir para criação da armadura
        </button>
      </div>
    </div>
  )
}

export default ArmorAbilityStep