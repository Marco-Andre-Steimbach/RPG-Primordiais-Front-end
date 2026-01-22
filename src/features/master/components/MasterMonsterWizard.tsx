import { useMemo, useState } from 'react'
import { useMonsterCreation } from '../hooks/useMonsterCreation'
import type {
  CreateMonsterPayload,
  CreateMonsterAttackPayload,
  CreateMonsterAbilityPayload
} from '../monsterCreation.types'

type Step = 1 | 2 | 3 | 4

type Props = {
  onCancel: () => void
  onDone: (monsterId: number) => void
}

function MasterMonsterWizard({ onCancel, onDone }: Props) {
  const {
    monsterId,
    attackIds,
    abilityIds,
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
    () => !!monsterId && (attackIds.length > 0 || abilityIds.length > 0),
    [monsterId, attackIds.length, abilityIds.length]
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
          Ataques ({attackIds.length})
        </button>

        <button
          className={`master-step ${step === 3 ? 'active' : ''}`}
          onClick={() => setStep(3)}
          disabled={!canGoAttacks || loading}
        >
          Habilidades ({abilityIds.length})
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
          <div className="master-wizard-panel">
            <div className="master-empty">
              Aqui entra o formulário do monstro (POST /monsters).
            </div>

            <button
              className="master-wizard-btn primary"
              disabled={loading}
              onClick={() =>
                handleCreateMonster({
                  name: 'Novo Monstro',
                  description: '...',
                  base_hp: 10,
                  base_ac: 10,
                  base_speed: 6,
                  actions_per_turn: 1,
                  xp_reward: 0,
                  base_str: 1,
                  base_dex: 1,
                  base_con: 1,
                  base_wis: 1,
                  base_int: 1,
                  weakness_damage_type_id: 1,
                  element_types: [1]
                })
              }
            >
              Criar (teste)
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="master-wizard-panel">
            <div className="master-empty">
              Aqui entra o form de ataque + lista de ataques criados.
            </div>

            <button
              className="master-wizard-btn primary"
              disabled={loading || !monsterId}
              onClick={() =>
                handleAddAttack({
                  name: 'Ataque Teste',
                  description: '...',
                  dice_formula: '1d4',
                  base_damage: 1,
                  bonus_accuracy: 0,
                  attack_range: 1,
                  weapon_damage_type_id: 1,
                  element_types: [1]
                })
              }
            >
              Adicionar ataque (teste)
            </button>

            <button
              className="master-wizard-btn ghost"
              disabled={loading || !monsterId}
              onClick={() => setStep(3)}
            >
              Próximo
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="master-wizard-panel">
            <div className="master-empty">
              Aqui entra o form de habilidade + lista de habilidades criadas.
            </div>

            <button
              className="master-wizard-btn primary"
              disabled={loading || !monsterId}
              onClick={() =>
                handleAddAbility({
                  title: 'Habilidade Teste',
                  description: '...',
                  dice_formula: '1d6',
                  base_damage: 1,
                  bonus_damage: 0,
                  bonus_speed: 0,
                  ability_range: 1,
                  element_types: [1]
                })
              }
            >
              Adicionar habilidade (teste)
            </button>

            <button
              className="master-wizard-btn ghost"
              disabled={loading || !monsterId}
              onClick={() => setStep(4)}
            >
              Próximo
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="master-wizard-panel">
            <div className="master-wizard-summary">
              <div><strong>Monstro:</strong> {monsterId ?? '-'}</div>
              <div><strong>Ataques:</strong> {attackIds.length}</div>
              <div><strong>Habilidades:</strong> {abilityIds.length}</div>
            </div>

            <button className="master-wizard-btn primary" disabled={loading || !canFinalize} onClick={handleFinalize}>
              Finalizar e vincular
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default MasterMonsterWizard
