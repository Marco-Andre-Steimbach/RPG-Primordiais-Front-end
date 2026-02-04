import { useState } from 'react'
import { useItemCreation } from '../hooks/useItemCreation'
import { useWeaponCreation } from '../hooks/useWeaponCreation'

import type {
  CreateItemPayload
} from '../items.types'

import type {
  CreateWeaponPayload,
  CreateWeaponAbilityPayload
} from '../weapons.types'

import ItemBaseForm from '../components/ItemBaseForm'
import WeaponBaseForm from '../components/WeaponBaseForm'
import WeaponAbilityForm from '../components/WeaponAbilityForm'
import ItemCreatedList from '../components/ItemCreatedList'

type Step = 1 | 2 | 3 | 4

type Props = {
  onCancel: () => void
}

function MasterWeaponWizard({ onCancel }: Props) {
  const item = useItemCreation()
  const weapon = useWeaponCreation()

  const [step, setStep] = useState<Step>(1)

  async function handleCreateItem(
    payload: Omit<CreateItemPayload, 'item_abilities'>
  ) {
    const res = await item.createBaseItem({
      ...payload,
      item_abilities: []
    })

    if (res?.id) {
      setStep(2)
    }
  }

  async function handleCreateWeapon(
    payload: Omit<CreateWeaponPayload, 'item_id'>
  ) {
    if (!item.itemId) return

    const res = await weapon.createBaseWeapon(
      item.itemId,
      payload
    )

    if (res?.id) {
      setStep(3)
    }
  }

  async function handleAddWeaponAbility(
    payload: CreateWeaponAbilityPayload
  ) {
    await weapon.addAbility(payload)
  }

  function handleExit() {
    item.reset()
    weapon.reset()
    onCancel()
  }

  const loading = item.loading || weapon.loading
  const error = item.error || weapon.error

  return (
    <section className="master-sheet card master-wizard">
      <div className="master-wizard-top">
        <div>
          <h2 className="master-wizard-title">Criar Arma</h2>
          <p className="master-wizard-sub">
            Passo {step} de 4
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
          disabled
        >
          Item
        </button>

        <button
          className={`master-step ${step === 2 ? 'active' : ''}`}
          disabled={!item.itemId}
        >
          Arma
        </button>

        <button
          className={`master-step ${step === 3 ? 'active' : ''}`}
          disabled={!weapon.weaponId}
        >
          Habilidades ({weapon.abilities.length})
        </button>

        <button
          className={`master-step ${step === 4 ? 'active' : ''}`}
          disabled
        >
          Finalizar
        </button>
      </div>

      <div className="master-wizard-body">
        {step === 1 && (
          <ItemBaseForm
            loading={loading}
            onSubmit={handleCreateItem}
          />
        )}

        {step === 2 && (
          <WeaponBaseForm
            loading={loading}
            onSubmit={handleCreateWeapon}
          />
        )}

        {step === 3 && (
          <>
            <WeaponAbilityForm
              loading={loading}
              onSubmit={handleAddWeaponAbility}
            />

            <ItemCreatedList
              title="Habilidades da Arma"
              items={weapon.abilities}
            />

            <button
              className="master-wizard-btn ghost"
              disabled={loading}
              onClick={() => setStep(4)}
            >
              Finalizar
            </button>
          </>
        )}

        {step === 4 && (
          <div className="master-wizard-panel">
            <div className="master-wizard-summary">
              <strong>Arma criada com sucesso.</strong>
              <div>Item ID: {item.itemId}</div>
              <div>Arma ID: {weapon.weaponId}</div>
              <div>Habilidades: {weapon.abilities.length}</div>
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

export default MasterWeaponWizard
