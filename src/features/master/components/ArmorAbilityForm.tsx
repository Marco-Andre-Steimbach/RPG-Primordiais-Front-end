import { useState } from 'react'
import type { CreateArmorAbilityPayload } from '../armors.types'

type Props = {
  loading: boolean
  onSubmit: (payload: CreateArmorAbilityPayload) => Promise<void>
}

function ArmorAbilityForm({ loading, onSubmit }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [diceFormula, setDiceFormula] = useState<string | null>(null)

  const [baseDamage, setBaseDamage] = useState(0)
  const [armorClassBonus, setArmorClassBonus] = useState(0)
  const [bonusSpeed, setBonusSpeed] = useState(0)
  const [range, setRange] = useState(0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    await onSubmit({
      title,
      description,
      dice_formula: diceFormula,
      base_damage: baseDamage,
      armor_class_bonus: armorClassBonus,
      bonus_speed: bonusSpeed,
      range
    })

    setTitle('')
    setDescription('')
    setDiceFormula(null)
    setBaseDamage(0)
    setArmorClassBonus(0)
    setBonusSpeed(0)
    setRange(0)
  }

  return (
    <form className="master-form" onSubmit={handleSubmit}>
      <h3 className="master-form-title">
        Criar habilidade da armadura
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
        placeholder="Fórmula de dado (opcional)"
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

      <button
        className="master-wizard-btn ghost"
        type="submit"
        disabled={loading}
      >
        Criar habilidade
      </button>
    </form>
  )
}

export default ArmorAbilityForm