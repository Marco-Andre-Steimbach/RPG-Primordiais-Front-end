import { useState } from 'react'
import type { CreateWeaponPayload } from '../weapons.types'
import { useWeaponDamageTypeMap } from '../hooks/useWeaponDamageTypeMap'
import { useElementMap } from '../hooks/useElementMap'
import AmmoSelect from './AmmoSelect'

type Props = {
  loading: boolean
  onSubmit: (
    payload: Omit<CreateWeaponPayload, 'item_id'>
  ) => Promise<void>
}

function WeaponBaseForm({ loading, onSubmit }: Props) {
  const [weaponDamageTypeId, setWeaponDamageTypeId] = useState<number>(1)
  const [diceFormula, setDiceFormula] = useState('1d6')

  const [baseDamage, setBaseDamage] = useState(0)
  const [bonusAccuracy, setBonusAccuracy] = useState(0)
  const [bonusSpeed, setBonusSpeed] = useState(0)
  const [range, setRange] = useState(0)

  const [usesAmmo, setUsesAmmo] = useState(false)
  const [ammoItemId, setAmmoItemId] = useState<number | null>(null)
  const [ammoPerUse, setAmmoPerUse] = useState(1)

  const [elementTypes, setElementTypes] = useState<number[]>([])

  const {
    weaponDamageTypeMap,
    loading: damageTypesLoading
  } = useWeaponDamageTypeMap()

  const {
    elementMap,
    loading: elementsLoading
  } = useElementMap()

  function toggleElement(id: number) {
    setElementTypes(prev =>
      prev.includes(id)
        ? prev.filter(e => e !== id)
        : [...prev, id]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (elementTypes.length === 0) {
      throw new Error('Selecione ao menos um tipo elemental.')
    }

    if (usesAmmo && !ammoItemId) {
      throw new Error('Selecione a munição da arma.')
    }

    const payload = {
      weapon_damage_type_id: weaponDamageTypeId,
      dice_formula: diceFormula,
      base_damage: baseDamage,
      bonus_accuracy: bonusAccuracy,
      bonus_speed: bonusSpeed,
      range,
      ammo_item_id: usesAmmo ? ammoItemId : null,
      ammo_per_use: usesAmmo ? ammoPerUse : 1,
      element_types: elementTypes
    }

    await onSubmit(payload)

    setDiceFormula('1d6')
    setBaseDamage(0)
    setBonusAccuracy(0)
    setBonusSpeed(0)
    setRange(0)
    setUsesAmmo(false)
    setAmmoItemId(null)
    setAmmoPerUse(1)
    setElementTypes([])
  }

  return (
    <form className="master-form" onSubmit={handleSubmit}>
      <h3 className="master-form-title">Criar arma</h3>

      <div className="master-field">
        <label>Tipo de dano</label>
        <select
          className="master-input"
          value={weaponDamageTypeId}
          onChange={e =>
            setWeaponDamageTypeId(Number(e.target.value))
          }
          disabled={damageTypesLoading}
        >
          {Array.from(weaponDamageTypeMap.values()).map(dt => (
            <option key={dt.id} value={dt.id}>
              {dt.name}
            </option>
          ))}
        </select>
      </div>

      <input
        className="master-input"
        placeholder="Fórmula de dado (ex: 1d8)"
        value={diceFormula}
        onChange={e => setDiceFormula(e.target.value)}
        required
      />

      <div className="master-form-grid">
        <div className="master-field">
          <label>Dano base</label>
          <input
            className="master-input"
            type="number"
            min={0}
            value={baseDamage}
            onChange={e => setBaseDamage(Number(e.target.value))}
          />
        </div>

        <div className="master-field">
          <label>Bônus de acerto</label>
          <input
            className="master-input"
            type="number"
            value={bonusAccuracy}
            onChange={e => setBonusAccuracy(Number(e.target.value))}
          />
        </div>

        <div className="master-field">
          <label>Bônus de velocidade</label>
          <input
            className="master-input"
            type="number"
            value={bonusSpeed}
            onChange={e => setBonusSpeed(Number(e.target.value))}
          />
        </div>

        <div className="master-field">
          <label>Alcance</label>
          <input
            className="master-input"
            type="number"
            min={0}
            value={range}
            onChange={e => setRange(Number(e.target.value))}
          />
        </div>
      </div>

      <label className="master-checkbox">
        <input
          type="checkbox"
          checked={usesAmmo}
          onChange={e => setUsesAmmo(e.target.checked)}
        />
        Usa munição
      </label>

      {usesAmmo && (
        <>
          <AmmoSelect
            value={ammoItemId}
            onChange={setAmmoItemId}
          />

          <div className="master-field">
            <label>Munição por uso</label>
            <input
              className="master-input"
              type="number"
              min={1}
              value={ammoPerUse}
              onChange={e =>
                setAmmoPerUse(Number(e.target.value))
              }
            />
          </div>
        </>
      )}

      <div className="master-form-section">
        <h4 className="master-form-subtitle">
          Tipos elementais
        </h4>

        <div className="master-form-grid">
          {Array.from(elementMap.values()).map(el => (
            <button
              key={el.id}
              type="button"
              className={`master-chip ${
                elementTypes.includes(el.id) ? 'active' : ''
              }`}
              onClick={() => toggleElement(el.id)}
              disabled={elementsLoading}
            >
              {el.name}
            </button>
          ))}
        </div>
      </div>

      <button
        className="master-wizard-btn primary"
        type="submit"
        disabled={
          loading ||
          damageTypesLoading ||
          elementsLoading ||
          elementTypes.length === 0
        }
      >
        Criar arma
      </button>
    </form>
  )
}

export default WeaponBaseForm
