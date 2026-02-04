import { useState } from 'react'
import type { CreateItemAbilityPayload } from '../items.types'

type Props = {
    loading: boolean
    onSubmit: (payload: CreateItemAbilityPayload) => Promise<void>
}

function ItemAbilityForm({ loading, onSubmit }: Props) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [diceFormula, setDiceFormula] = useState<string | null>(null)

    const [baseDamage, setBaseDamage] = useState(0)
    const [bonusDamage, setBonusDamage] = useState(0)
    const [bonusAccuracy, setBonusAccuracy] = useState(0)
    const [bonusSpeed, setBonusSpeed] = useState(0)

    const [range, setRange] = useState(0)

    const [isConsumable, setIsConsumable] = useState(false)
    const [maxUses, setMaxUses] = useState<number | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        const payload: CreateItemAbilityPayload = {
            title,
            description,
            dice_formula: diceFormula,
            base_damage: baseDamage,
            bonus_damage: bonusDamage,
            bonus_accuracy: bonusAccuracy,
            bonus_speed: bonusSpeed,
            range,
            is_consumable: isConsumable ? 1 : 0,
            max_uses: isConsumable ? maxUses : null,
            override_element_type_id: 1
        }

        await onSubmit(payload)

        setTitle('')
        setDescription('')
        setDiceFormula(null)
        setBaseDamage(0)
        setBonusDamage(0)
        setBonusAccuracy(0)
        setBonusSpeed(0)
        setRange(0)
        setIsConsumable(false)
        setMaxUses(null)
    }


    return (
        <form className="master-form" onSubmit={handleSubmit}>
            <h3 className="master-form-title">Criar habilidade de item</h3>

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
                        onChange={e => setBaseDamage(Number(e.target.value))}
                    />
                    <small>Dano fixo causado</small>
                </div>

                <div className="master-field">
                    <label>Bônus de dano</label>
                    <input
                        className="master-input"
                        type="number"
                        value={bonusDamage}
                        onChange={e => setBonusDamage(Number(e.target.value))}
                    />
                    <small>Adicional ao dano base</small>
                </div>

                <div className="master-field">
                    <label>Bônus de acerto</label>
                    <input
                        className="master-input"
                        type="number"
                        value={bonusAccuracy}
                        onChange={e => setBonusAccuracy(Number(e.target.value))}
                    />
                    <small>Modificador de chance de acerto</small>
                </div>

                <div className="master-field">
                    <label>Bônus de velocidade</label>
                    <input
                        className="master-input"
                        type="number"
                        value={bonusSpeed}
                        onChange={e => setBonusSpeed(Number(e.target.value))}
                    />
                    <small>Afeta ordem/tempo de ação</small>
                </div>

                <div className="master-field">
                    <label>Alcance</label>
                    <input
                        className="master-input"
                        type="number"
                        value={range}
                        onChange={e => setRange(Number(e.target.value))}
                    />
                    <small>0 = corpo a corpo</small>
                </div>
            </div>

            <label className="master-checkbox">
                <input
                    type="checkbox"
                    checked={isConsumable}
                    onChange={e => setIsConsumable(e.target.checked)}
                />
                Consumível
            </label>

            {isConsumable && (
                <input
                    className="master-input"
                    type="number"
                    placeholder="Usos máximos"
                    value={maxUses ?? ''}
                    onChange={e =>
                        setMaxUses(
                            e.target.value
                                ? Number(e.target.value)
                                : null
                        )
                    }
                />
            )}

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

export default ItemAbilityForm
