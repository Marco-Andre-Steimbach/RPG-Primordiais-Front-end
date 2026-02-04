import { useState } from 'react'
import type { CreateWeaponAbilityPayload } from '../weapons.types'
import { useElementMap } from '../hooks/useElementMap'

type Props = {
  loading: boolean
  onSubmit: (payload: CreateWeaponAbilityPayload) => Promise<void>
}

function WeaponAbilityForm({ loading, onSubmit }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [diceFormula, setDiceFormula] = useState<string | null>(null)

  const [baseDamage, setBaseDamage] = useState(0)
  const [bonusDamage, setBonusDamage] = useState(0)
  const [bonusAccuracy, setBonusAccuracy] = useState(0)
  const [bonusSpeed, setBonusSpeed] = useState(0)
  const [range, setRange] = useState(0)

  const [elementTypes, setElementTypes] = useState<number[]>([])

  const { elementMap, loading: elementsLoading } =
    useElementMap()

  function toggleElement(id: number) {
    setElementTypes(prev =>
      prev.includes(id)
        ? prev.filter(e => e !== id)
        : [...prev, id]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    await onSubmit({
      title,
      description,
      dice_formula: diceFormula,
      base_damage: baseDamage,
      bonus_damage: bonusDamage,
      bonus_accuracy: bonusAccuracy,
      bonus_speed: bonusSpeed,
      range,
      element_types: elementTypes
    })

    setTitle('')
    setDescription('')
    setDiceFormula(null)
    setBaseDamage(0)
    setBonusDamage(0)
    setBonusAccuracy(0)
    setBonusSpeed(0)
    setRange(0)
    setElementTypes([])
  }

  return (
    <form className="master-form" onSubmit={handleSubmit}>
      <h3 className="master-form-title">
        Criar habilidade da arma
      </h3>

      <input
        className="master-input"
        placeholder="Título"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />

      <textarea
        className="master-textarea"
        placeholder="Descrição"
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
      />

      <input
        className="master-input"
        placeholder="Fórmula de dado (ex: 2d6)"
        value={diceFormula ?? ''}
        onChange={e =>
          setDiceFormula(e.target.value || null)
        }
      />

      <div className="master-form-grid">
        <div className="master-field">
          <label>Dano base</label>
          <input
            className="master-input"
            type="number"
            value={baseDamage}
            onChange={e =>
              setBaseDamage(Number(e.target.value))
            }
          />
        </div>

        <div className="master-field">
          <label>Bônus de dano</label>
          <input
            className="master-input"
            type="number"
            value={bonusDamage}
            onChange={e =>
              setBonusDamage(Number(e.target.value))
            }
          />
        </div>

        <div className="master-field">
          <label>Bônus de acerto</label>
          <input
            className="master-input"
            type="number"
            value={bonusAccuracy}
            onChange={e =>
              setBonusAccuracy(Number(e.target.value))
            }
          />
        </div>

        <div className="master-field">
          <label>Bônus de velocidade</label>
          <input
            className="master-input"
            type="number"
            value={bonusSpeed}
            onChange={e =>
              setBonusSpeed(Number(e.target.value))
            }
          />
        </div>

        <div className="master-field">
          <label>Alcance</label>
          <input
            className="master-input"
            type="number"
            value={range}
            onChange={e =>
              setRange(Number(e.target.value))
            }
          />
        </div>
      </div>

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
        className="master-wizard-btn ghost"
        type="submit"
        disabled={loading || elementsLoading}
      >
        Criar habilidade
      </button>
    </form>
  )
}

export default WeaponAbilityForm
