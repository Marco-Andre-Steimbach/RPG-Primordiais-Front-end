import { useState } from 'react'
import { useElementMap } from '../hooks/useElementMap'
import { useWeaponDamageTypeMap } from '../hooks/useWeaponDamageTypeMap'
import type { CreateMonsterPayload } from '../monsterCreation.types'

type Props = {
  loading: boolean
  onSubmit: (payload: CreateMonsterPayload) => void
}

function MonsterBaseForm({ loading, onSubmit }: Props) {
  const { elementMap } = useElementMap()
  const { weaponDamageTypeMap } = useWeaponDamageTypeMap()

  const [form, setForm] = useState<CreateMonsterPayload>({
    name: '',
    description: '',
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
    element_types: []
  })

  function update<K extends keyof CreateMonsterPayload>(
    key: K,
    value: CreateMonsterPayload[K]
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

  return (
    <div className="master-wizard-panel">
      <div className="master-form full">
        <div className="master-field">
          <label>Nome</label>
          <input
            value={form.name}
            onChange={e => update('name', e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="master-field">
          <label>Descrição</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={e => update('description', e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      <div className="master-form">
        <div className="master-field">
          <label>HP Base</label>
          <input
            type="number"
            value={form.base_hp}
            onChange={e => update('base_hp', Number(e.target.value))}
          />
        </div>

        <div className="master-field">
          <label>AC Base</label>
          <input
            type="number"
            value={form.base_ac}
            onChange={e => update('base_ac', Number(e.target.value))}
          />
        </div>

        <div className="master-field">
          <label>Velocidade</label>
          <input
            type="number"
            value={form.base_speed}
            onChange={e => update('base_speed', Number(e.target.value))}
          />
        </div>

        <div className="master-field">
          <label>Ações por turno</label>
          <input
            type="number"
            value={form.actions_per_turn}
            onChange={e =>
              update('actions_per_turn', Number(e.target.value))
            }
          />
        </div>

        <div className="master-field">
          <label>XP concedido</label>
          <input
            type="number"
            value={form.xp_reward}
            onChange={e => update('xp_reward', Number(e.target.value))}
          />
        </div>
      </div>

      <div className="master-form">
        <div className="master-field">
          <label>STR</label>
          <input
            type="number"
            value={form.base_str}
            onChange={e => update('base_str', Number(e.target.value))}
          />
        </div>

        <div className="master-field">
          <label>DEX</label>
          <input
            type="number"
            value={form.base_dex}
            onChange={e => update('base_dex', Number(e.target.value))}
          />
        </div>

        <div className="master-field">
          <label>CON</label>
          <input
            type="number"
            value={form.base_con}
            onChange={e => update('base_con', Number(e.target.value))}
          />
        </div>

        <div className="master-field">
          <label>WIS</label>
          <input
            type="number"
            value={form.base_wis}
            onChange={e => update('base_wis', Number(e.target.value))}
          />
        </div>

        <div className="master-field">
          <label>INT</label>
          <input
            type="number"
            value={form.base_int}
            onChange={e => update('base_int', Number(e.target.value))}
          />
        </div>
      </div>

      <div className="master-form full">
        <div className="master-field">
          <label>Fraqueza (tipo de dano)</label>
          <select
            value={form.weakness_damage_type_id}
            onChange={e =>
              update('weakness_damage_type_id', Number(e.target.value))
            }
          >
            {Array.from(weaponDamageTypeMap.values()).map(w => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="master-sheet-block">
        <h4 className="master-sheet-section-title">Elementos do Monstro</h4>

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
        disabled={loading || !form.name}
        onClick={() => onSubmit(form)}
      >
        Criar monstro
      </button>
    </div>
  )
}

export default MonsterBaseForm
