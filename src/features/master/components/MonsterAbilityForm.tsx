import { useState } from 'react'
import { useElementMap } from '../hooks/useElementMap'
import type { CreateMonsterAbilityPayload } from '../monsterCreation.types'

type Props = {
  loading: boolean
  onSubmit: (payload: CreateMonsterAbilityPayload) => void
}

function MonsterAbilityForm({ loading, onSubmit }: Props) {
  const { elementMap } = useElementMap()

  const [form, setForm] = useState<CreateMonsterAbilityPayload>({
    title: '',
    description: '',
    dice_formula: '',
    base_damage: 0,
    bonus_damage: 0,
    bonus_speed: 0,
    ability_range: 1,
    element_types: []
  })

  function update<K extends keyof CreateMonsterAbilityPayload>(
    key: K,
    value: CreateMonsterAbilityPayload[K]
  ) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function toggleElement(id: number) {
    setForm(prev => ({
      ...prev,
      element_types: prev.element_types.includes(id)
        ? prev.element_types.filter(e => e !== id)
        : [...prev.element_types, id]
    }))
  }

  function submit() {
    onSubmit(form)
    setForm({
      title: '',
      description: '',
      dice_formula: '',
      base_damage: 0,
      bonus_damage: 0,
      bonus_speed: 0,
      ability_range: 1,
      element_types: []
    })
  }

  return (
    <div className="master-wizard-panel">
      <div className="master-form full">
        <div className="master-field">
          <label>Título da habilidade</label>
          <input
            value={form.title}
            onChange={e => update('title', e.target.value)}
          />
        </div>

        <div className="master-field">
          <label>Descrição</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={e => update('description', e.target.value)}
          />
        </div>
      </div>

      <div className="master-form">
        <div className="master-field">
          <label>Fórmula</label>
          <input
            value={form.dice_formula}
            onChange={e => update('dice_formula', e.target.value)}
          />
        </div>

        <div className="master-field">
          <label>Dano base</label>
          <input
            type="number"
            value={form.base_damage}
            onChange={e =>
              update('base_damage', Number(e.target.value))
            }
          />
        </div>

        <div className="master-field">
          <label>Bônus de dano</label>
          <input
            type="number"
            value={form.bonus_damage}
            onChange={e =>
              update('bonus_damage', Number(e.target.value))
            }
          />
        </div>

        <div className="master-field">
          <label>Bônus de velocidade</label>
          <input
            type="number"
            value={form.bonus_speed}
            onChange={e =>
              update('bonus_speed', Number(e.target.value))
            }
          />
        </div>

        <div className="master-field">
          <label>Alcance</label>
          <input
            type="number"
            value={form.ability_range}
            onChange={e =>
              update('ability_range', Number(e.target.value))
            }
          />
        </div>
      </div>

      <div className="master-sheet-block">
        <h4 className="master-sheet-section-title">
          Elementos da Habilidade
        </h4>

        <div className="master-sheet-elements">
          {Array.from(elementMap.values()).map(el => (
            <button
              key={el.id}
              type="button"
              className={`master-element-tag ${
                form.element_types.includes(el.id) ? 'active' : ''
              }`}
              onClick={() => toggleElement(el.id)}
            >
              {el.name}
            </button>
          ))}
        </div>
      </div>

      <button
        className="master-wizard-btn primary"
        disabled={loading || !form.title}
        onClick={submit}
      >
        Adicionar habilidade
      </button>
    </div>
  )
}

export default MonsterAbilityForm
