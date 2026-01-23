import { useMemo, useState } from 'react'
import { useMonsterCreation } from '../hooks/useMonsterCreation'
import type {
  CreateMonsterPayload,
  CreateMonsterAttackPayload,
  CreateMonsterAbilityPayload
} from '../monsterCreation.types'
import MonsterBaseForm from '../components/MonsterBaseForm'
import MonsterAttackForm from '../components/MonsterAttackForm'
import MonsterCreatedList from '../components/MonsterCreatedList'
import MonsterAbilityForm from '../components/MonsterAbilityForm'

type Step = 1 | 2 | 3 | 4

type Props = {
  onCancel: () => void
  onDone: (monsterId: number) => void
}

function MasterMonsterWizard({ onCancel, onDone }: Props) {
  const {
    monsterId,
    attacks,
    abilities,
    loading,
    error,
    createBaseMonster,
    addAttack,
    addAbility,
    finalizeMonster,
    reset
  } = useMonsterCreation()

  const [step, setStep] = useState<Step>(1)

  const canGoAttacks = useMemo(() => !!monsterId, [monsterId])
  const canFinalize = useMemo(
    () => !!monsterId && (attacks.length > 0 || abilities.length > 0),
    [monsterId, attacks.length, abilities.length]
  )


  async function handleCreateMonster(payload: CreateMonsterPayload) {
    await createBaseMonster(payload)
    setStep(2)
  }

  async function handleAddAttack(payload: CreateMonsterAttackPayload) {
    await addAttack(payload)
  }

  async function handleAddAbility(payload: CreateMonsterAbilityPayload) {
    await addAbility(payload)
  }

  async function handleFinalize() {
    await finalizeMonster()
    if (monsterId) onDone(monsterId)
  }

  function handleExit() {
    reset()
    onCancel()
  }

  return (
    <section className="master-sheet card master-wizard">
      <div className="master-wizard-top">
        <div>
          <h2 className="master-wizard-title">Criar Monstro</h2>
          <p className="master-wizard-sub">
            Passo {step} de 4
            {monsterId ? ` • ID: ${monsterId}` : ''}
          </p>
        </div>

        <div className="master-wizard-actions">
          <button className="master-wizard-btn ghost" onClick={handleExit} disabled={loading}>
            Cancelar
          </button>

          {step > 1 && (
            <button
              className="master-wizard-btn ghost"
              onClick={() => setStep(s => (s > 1 ? ((s - 1) as Step) : s))}
              disabled={loading}
            >
              Voltar
            </button>
          )}
        </div>
      </div>

      {error && <div className="master-wizard-error">{error}</div>}

      <div className="master-wizard-steps">
        <button className={`master-step ${step === 1 ? 'active' : ''}`} onClick={() => setStep(1)} disabled={loading}>
          Monstro
        </button>

        <button
          className={`master-step ${step === 2 ? 'active' : ''}`}
          onClick={() => setStep(2)}
          disabled={!canGoAttacks || loading}
        >
          Ataques ({attacks.length})
        </button>

        <button
          className={`master-step ${step === 3 ? 'active' : ''}`}
          onClick={() => setStep(3)}
          disabled={!canGoAttacks || loading}
        >
          Habilidades ({abilities.length})
        </button>

        <button
          className={`master-step ${step === 4 ? 'active' : ''}`}
          onClick={() => setStep(4)}
          disabled={!canFinalize || loading}
        >
          Finalizar
        </button>
      </div>

      <div className="master-wizard-body">
        {step === 1 && (
          <MonsterBaseForm
            loading={loading}
            onSubmit={handleCreateMonster}
          />
        )}


        {step === 2 && (
          <>
            <MonsterAttackForm
              loading={loading}
              onSubmit={handleAddAttack}
            />

            <MonsterCreatedList
              title="Ataques"
              items={attacks}
            />

            <button
              className="master-wizard-btn ghost"
              disabled={loading}
              onClick={() => setStep(3)}
            >
              Próximo
            </button>
          </>
        )}


        {step === 3 && (
          <>
            <MonsterAbilityForm
              loading={loading}
              onSubmit={handleAddAbility}
            />

            <MonsterCreatedList
              title="Habilidades"
              items={abilities}
            />

            <button
              className="master-wizard-btn ghost"
              disabled={loading}
              onClick={() => setStep(4)}
            >
              Próximo
            </button>
          </>
        )}


        {step === 4 && (
          <div className="master-wizard-panel">
            <div className="master-wizard-summary">
              <div><strong>Monstro:</strong> {monsterId ?? '-'}</div>
              <div><strong>Ataques:</strong> {attacks.length}</div>
              <div><strong>Habilidades:</strong> {abilities.length}</div>
            </div>

            <button
              className="master-wizard-btn primary"
              disabled={loading || !canFinalize}
              onClick={handleFinalize}
            >
              Finalizar e vincular
            </button>
          </div>
        )}

      </div>
    </section>
  )
}

export default MasterMonsterWizard
