import { useEffect, useState } from 'react'
import type { LupidaWeapon, Element } from '../campaigns.types'
import { fetchElementById } from '../campaigns.service'

type Props = {
    weapon: LupidaWeapon
    onBuy: (weapon: LupidaWeapon) => void
    canBuy: boolean
}

const DAMAGE_TYPE_MAP: Record<number, string> = {
    1: 'Cortante',
    2: 'Perfurante',
    3: 'Concussão'
}

function LupidaWeaponCard({ weapon, onBuy, canBuy }: Props) {
    const [open, setOpen] = useState(false)
    const [elements, setElements] = useState<Element[]>([])

    useEffect(() => {
        if (!open || weapon.elements.length === 0) return
        Promise.all(weapon.elements.map(id => fetchElementById(id)))
            .then(res => setElements(res.map(r => r.element)))
    }, [open, weapon.elements])

    return (
        <div className={`lupida-armor-card ${!canBuy ? 'disabled' : ''}`}>
            <div className="lupida-armor-header" onClick={() => setOpen(v => !v)}>
                <strong>{weapon.item_name}</strong>
                <span>{weapon.value} ouro</span>
            </div>

            {open && (
                <div className="lupida-armor-body">
                    <p>{weapon.item_description}</p>

                    <div className="lupida-armor-stats">
                        <span>Dano: {weapon.dice_formula} + {weapon.base_damage}</span>
                        <span>Tipo: {DAMAGE_TYPE_MAP[weapon.weapon_damage_type_id]}</span>
                        <span>Alcance: {weapon.range}</span>
                    </div>

                    {elements.length > 0 && (
                        <div className="lupida-armor-elements">
                            {elements.map(el => (
                                <span key={el.id} className="lupida-element-tag">
                                    {el.name}
                                </span>
                            ))}
                        </div>
                    )}

                    <button
                        className="lupida-buy-button"
                        disabled={!canBuy}
                        onClick={() => onBuy(weapon)}
                    >
                        Comprar
                    </button>
                </div>
            )}
        </div>
    )
}

export default LupidaWeaponCard
