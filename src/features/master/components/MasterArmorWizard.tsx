import { useState } from 'react'
import { useItemCreation } from '../hooks/useItemCreation'
import { useArmorCreation } from '../hooks/useArmorCreation'

import type {
  CreateItemPayload
} from '../items.types'

import type {
  CreateArmorPayload
} from '../armors.types'

import ItemBaseForm from '../components/ItemBaseForm'
import ArmorAbilityStep from '../components/ArmorAbilityStep'
import ArmorBaseForm from '../components/ArmorBaseForm'

type Step = 0 | 1 | 2 | 3

type Props = {
  onCancel: () => void
}

function MasterArmorWizard({ onCancel }: Props) {
  const item = useItemCreation()
  const armor = useArmorCreation()

  const [step, setStep] = useState<Step>(0)

  async function handleCreateItem(
    payload: Omit<CreateItemPayload, 'item_abilities'>
  ) {
    const res = await item.createBaseItem({
      ...payload,
      item_abilities: []
    })

    if (res?.id) {
      setStep(1)
    }
  }

  async function handleCreateArmor(
    payload: Omit<CreateArmorPayload, 'item_id'>
  ) {
    if (!item.itemId) return

    const res = await armor.createBaseArmor(
      item.itemId,
      payload
    )

    if (res?.id) {
      setStep(3)
    }
  }

  function handleExit() {
    item.reset()
    armor.reset()
    onCancel()
  }

  const loading = item.loading || armor.loading
  const error = item.error || armor.error

  return (
    <section className="master-sheet card master-wizard">
      <div className="master-wizard-top">
        <div>
          <h2 className="master-wizard-title">Criar Armadura</h2>
          <p className="master-wizard-sub">
            Passo {step + 1} de 4
          </p>
        </div>

        <div className="master-wizard-actions">
          <button
            className="master-wizard-btn ghost"
            onClick={handleExit}
            disabled={loading}
          >
            Cancelar
          </button>

          {step > 0 && step !== 3 && (
            <button
              className="master-wizard-btn ghost"
              onClick={() => setStep(s => (s - 1) as Step)}
              disabled={loading}
            >
              Voltar
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="master-wizard-error">
          {error}
        </div>
      )}

      <div className="master-wizard-steps">
        <button
          className={`master-step ${step === 0 ? 'active' : ''}`}
          disabled
        >
          Item
        </button>

        <button
          className={`master-step ${step === 1 ? 'active' : ''}`}
          disabled={!item.itemId}
        >
          Habilidades ({armor.selectedAbilityIds.length})
        </button>

        <button
          className={`master-step ${step === 2 ? 'active' : ''}`}
          disabled={!item.itemId}
        >
          Armadura
        </button>

        <button
          className={`master-step ${step === 3 ? 'active' : ''}`}
          disabled
        >
          Finalizar
        </button>
      </div>

      <div className="master-wizard-body">
        {step === 0 && (
          <ItemBaseForm
            loading={loading}
            onSubmit={handleCreateItem}
          />
        )}

        {step === 1 && (
          <ArmorAbilityStep
            loading={loading}
            armor={armor}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <ArmorBaseForm
            loading={loading}
            selectedAbilityIds={armor.selectedAbilityIds}
            onSubmit={handleCreateArmor}
          />
        )}

        {step === 3 && (
          <div className="master-wizard-panel">
            <div className="master-wizard-summary">
              <strong>Armadura criada com sucesso.</strong>
              <div>Item ID: {item.itemId}</div>
              <div>Armadura ID: {armor.armorId}</div>
              <div>
                Habilidades: {armor.selectedAbilityIds.length}
              </div>
            </div>

            <button
              className="master-wizard-btn primary"
              onClick={handleExit}
            >
              Concluir
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default MasterArmorWizard