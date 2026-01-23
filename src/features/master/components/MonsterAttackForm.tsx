import { useState } from 'react'
import { useElementMap } from '../hooks/useElementMap'
import { useWeaponDamageTypeMap } from '../hooks/useWeaponDamageTypeMap'
import type { CreateMonsterAttackPayload } from '../monsterCreation.types'

type Props = {
  loading: boolean
  onSubmit: (payload: CreateMonsterAttackPayload) => void
}

function MonsterAttackForm({ loading, onSubmit }: Props) {
  const { elementMap } = useElementMap()
  const { weaponDamageTypeMap } = useWeaponDamageTypeMap()

  const [form, setForm] = useState<CreateMonsterAttackPayload>({
    name: '',
    description: '',
    dice_formula: '',
    base_damage: 0,
    bonus_accuracy: 0,
    attack_range: 1,
    weapon_damage_type_id: 1,
    element_types: []
  })

  function update<K extends keyof CreateMonsterAttackPayload>(
    key: K,
    value: CreateMonsterAttackPayload[K]
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
      name: '',
      description: '',
      dice_formula: '',
      base_damage: 0,
      bonus_accuracy: 0,
      attack_range: 1,
      weapon_damage_type_id: 1,
      element_types: []
    })
  }

  return (
    <div className="master-wizard-panel">
      <div className="master-form full">
        <div className="master-field">
          <label>Nome do ataque</label>
          <input value={form.name} onChange={e => update('name', e.target.value)} />
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
          <input value={form.dice_formula} onChange={e => update('dice_formula', e.target.value)} />
        </div>

        <div className="master-field">
          <label>Dano base</label>
          <input type="number" value={form.base_damage} onChange={e => update('base_damage', Number(e.target.value))} />
        </div>

        <div className="master-field">
          <label>Bônus de acerto</label>
          <input type="number" value={form.bonus_accuracy} onChange={e => update('bonus_accuracy', Number(e.target.value))} />
        </div>

        <div className="master-field">
          <label>Alcance</label>
          <input type="number" value={form.attack_range} onChange={e => update('attack_range', Number(e.target.value))} />
        </div>
      </div>

      <div className="master-form full">
        <div className="master-field">
          <label>Tipo de dano</label>
          <select
            value={form.weapon_damage_type_id}
            onChange={e => update('weapon_damage_type_id', Number(e.target.value))}
          >
            {Array.from(weaponDamageTypeMap.values()).map(w => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="master-sheet-block">
        <h4 className="master-sheet-section-title">Elementos do Ataque</h4>

        <div className="master-sheet-elements">
          {Array.from(elementMap.values()).map(el => (
            <button
              key={el.id}
              type="button"
              className={`master-element-tag ${form.element_types.includes(el.id) ? 'active' : ''}`}
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
        onClick={submit}
      >
        Adicionar ataque
      </button>
    </div>
  )
}

export default MonsterAttackForm
