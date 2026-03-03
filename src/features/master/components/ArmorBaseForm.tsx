import { useState } from 'react'
import type { CreateArmorPayload } from '../armors.types'
import { useElementMap } from '../hooks/useElementMap'
import { useWeaponDamageTypeMap } from '../hooks/useWeaponDamageTypeMap'
import { useArmorSlotMap, type ArmorSlot } from '../hooks/useArmorSlotMap'

type Props = {
  loading: boolean
  selectedAbilityIds: number[]
  onSubmit: (
    payload: Omit<CreateArmorPayload, 'item_id'>
  ) => Promise<void>
}

function ArmorBaseForm({
  loading,
  selectedAbilityIds,
  onSubmit
}: Props) {
  const [armorSlotId, setArmorSlotId] = useState<number>(1)
  const [armorClassBonus, setArmorClassBonus] = useState<number>(0)
  const [minStrengthRequired, setMinStrengthRequired] = useState<number>(0)
  const [speedPenalty, setSpeedPenalty] = useState<number>(0)
  const [weakDamageTypeId, setWeakDamageTypeId] =
    useState<number | null>(null)

  const [elementTypes, setElementTypes] = useState<number[]>([])

  const { elementMap, loading: elementsLoading } =
    useElementMap()

  const {
    weaponDamageTypeMap,
    loading: damageLoading
  } = useWeaponDamageTypeMap()

  const {
    armorSlotMap,
    loading: slotLoading
  } = useArmorSlotMap()

  const slots: ArmorSlot[] = Array.from(
    armorSlotMap.values()
  )

  const damageTypes = Array.from(
    weaponDamageTypeMap.values()
  )

  const elements = Array.from(
    elementMap.values()
  )

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

    await onSubmit({
      armor_slot_id: armorSlotId,
      armor_class_bonus: armorClassBonus,
      min_strength_required: minStrengthRequired,
      speed_penalty: speedPenalty,
      weak_damage_type_id:
        armorSlotId === 2 ? weakDamageTypeId : null,
      element_types: elementTypes,
      armor_abilities: selectedAbilityIds
    })
  }

  return (
    <form className="master-form" onSubmit={handleSubmit}>
      <h3 className="master-form-title">
        Criar armadura
      </h3>

      <div className="master-field">
        <label>Slot</label>
        <select
          className="master-input"
          value={armorSlotId}
          onChange={e => {
            const newId = Number(e.target.value)
            setArmorSlotId(newId)

            if (newId !== 2) {
              setWeakDamageTypeId(null)
            }
          }}
          disabled={slotLoading}
        >
          {slots.map(slot => (
            <option key={slot.id} value={slot.id}>
              {slot.name}
            </option>
          ))}
        </select>
      </div>

      <div className="master-form-grid">
        <div className="master-field">
          <label>Bônus de CA</label>
          <input
            className="master-input"
            type="number"
            value={armorClassBonus}
            onChange={e =>
              setArmorClassBonus(Number(e.target.value))
            }
          />
        </div>

        <div className="master-field">
          <label>Força mínima</label>
          <input
            className="master-input"
            type="number"
            value={minStrengthRequired}
            onChange={e =>
              setMinStrengthRequired(Number(e.target.value))
            }
          />
        </div>

        <div className="master-field">
          <label>Penalidade de velocidade</label>
          <input
            className="master-input"
            type="number"
            value={speedPenalty}
            onChange={e =>
              setSpeedPenalty(Number(e.target.value))
            }
          />
        </div>

        {armorSlotId === 2 && (
          <div className="master-field">
            <label>Fraqueza (tipo de dano)</label>
            <select
              className="master-input"
              value={weakDamageTypeId ?? ''}
              onChange={e =>
                setWeakDamageTypeId(
                  e.target.value
                    ? Number(e.target.value)
                    : null
                )
              }
              disabled={damageLoading}
            >
              <option value="">Nenhuma</option>
              {damageTypes.map(dt => (
                <option key={dt.id} value={dt.id}>
                  {dt.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="master-form-section">
        <h4 className="master-form-subtitle">
          Tipos elementais
        </h4>

        <div className="master-form-grid">
          {elements.map(el => (
            <button
              key={el.id}
              type="button"
              className={`master-chip ${
                elementTypes.includes(el.id)
                  ? 'active'
                  : ''
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
          elementsLoading ||
          slotLoading ||
          damageLoading
        }
      >
        Criar armadura
      </button>
    </form>
  )
}

export default ArmorBaseForm