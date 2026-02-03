import { useState } from 'react'
import { useItemCreation } from '../hooks/useItemCreation'

import type {
  CreateItemPayload,
  CreateItemAbilityPayload
} from '../items.types'

import ItemAbilityForm from '../components/ItemAbilityForm'
import ItemBaseForm from '../components/ItemBaseForm'
import ItemCreatedList from '../components/ItemCreatedList'

type Step = 1 | 2 | 3

type Props = {
  onCancel: () => void
  onDone: (itemId: number) => void
}

function MasterItemWizard({ onCancel, onDone }: Props) {
  const {
    abilities,
    loading,
    error,
    addAbility,
    createBaseItem,
    reset
  } = useItemCreation()

  const [step, setStep] = useState<Step>(1)

  async function handleAddAbility(
    payload: CreateItemAbilityPayload
  ) {
    await addAbility(payload)
  }

  async function handleCreateItem(
    payload: Omit<CreateItemPayload, 'item_abilities'>
  ) {
    const res = await createBaseItem({
      ...payload,
      item_abilities: abilities.map(a => a.id)
    })

    if (res?.id) {
      setStep(3)
      onDone(res.id)
    }
  }

  function handleExit() {
    reset()
    onCancel()
  }

  return (
    <section className="master-sheet card master-wizard">
      <div className="master-wizard-top">
        <div>
          <h2 className="master-wizard-title">Criar Item</h2>
          <p className="master-wizard-sub">
            Passo {step} de 3
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

          {step > 1 && (
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
          className={`master-step ${step === 1 ? 'active' : ''}`}
          onClick={() => setStep(1)}
          disabled={loading}
        >
          Habilidades ({abilities.length})
        </button>

        <button
          className={`master-step ${step === 2 ? 'active' : ''}`}
          onClick={() => setStep(2)}
          disabled={loading}
        >
          Item
        </button>

        <button
          className={`master-step ${step === 3 ? 'active' : ''}`}
          disabled
        >
          Finalizar
        </button>
      </div>

      <div className="master-wizard-body">
        {step === 1 && (
          <>
            <ItemAbilityForm
              loading={loading}
              onSubmit={handleAddAbility}
            />

            <ItemCreatedList
              title="Habilidades do Item"
              items={abilities}
            />

            <button
              className="master-wizard-btn ghost"
              disabled={loading}
              onClick={() => setStep(2)}
            >
              Próximo
            </button>
          </>
        )}

        {step === 2 && (
          <ItemBaseForm
            loading={loading}
            onSubmit={handleCreateItem}
          />
        )}

        {step === 3 && (
          <div className="master-wizard-panel">
            <div className="master-wizard-summary">
              <strong>Item criado com sucesso.</strong>
              <div>Habilidades associadas: {abilities.length}</div>
            </div>

            <button
              className="master-wizard-btn primary"
              onClick={handleExit}
            >
              Finalizar
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default MasterItemWizard
