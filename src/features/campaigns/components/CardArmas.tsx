import { useState } from 'react'
import type { Element } from '../campaigns.types'
import WeaponCardSheet from './WeaponCardSheet' 

type WeaponSheet = {
    weapon: {
        base_damage: number
        dice_formula: string
        range: number
        element_types: number[]
        weapon_abilities: any[]
        item_id: number
    }
    elements: number[]
    abilities: any[]
    is_equipped: boolean
}

type Props = {
    weapons: WeaponSheet[]
    elementsMap: Map<number, Element>
}

function CardArmas({ weapons, elementsMap }: Props) {
    const [openId, setOpenId] = useState<number | null>(null)

    return (
        <div className="sheet-card">
            <h3 className="sheet-card-title">
                Armas
            </h3>

            {weapons.length === 0 && (
                <span className="empty-text">
                    Nenhuma arma equipada
                </span>
            )}

            {weapons.map((weapon, index) => (
                <WeaponCardSheet
                    key={index}
                    weapon={weapon}
                    elementsMap={elementsMap}
                    isOpen={openId === index}
                    onToggle={() =>
                        setOpenId(openId === index ? null : index)
                    }
                />
            ))}
        </div>
    )
}

export default CardArmas
