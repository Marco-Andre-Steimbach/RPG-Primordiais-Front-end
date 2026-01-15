import { useState } from 'react'
import type { Element } from '../campaigns.types'
import ArmorCardSheet from './ArmorCardSheet'

type ArmorSheet = {
    armor: {
        armor_class_bonus: number
        min_strength_required: number
        speed_penalty: number
        element_types: number[]
        armor_abilities: any[]
        armor_slot_id: number
        item_id: number
    }
    slot: {
        name: string
    }
    elements: number[]
    abilities: any[]
    is_equipped: boolean
    item?: {
        name: string
        description: string
        value: number
    }
}

type Props = {
    baseArmor: number
    armors: ArmorSheet[]
    elementsMap: Map<number, Element>
}

function CardArmadura({ baseArmor, armors, elementsMap }: Props) {
    const [openId, setOpenId] = useState<number | null>(null)

    return (
        <div className="sheet-card">
            <h3 className="sheet-card-title">
                Armaduras
                <span className="sheet-card-sub">
                    CA Base {baseArmor}
                </span>
            </h3>

            {armors.length === 0 && (
                <span className="empty-text">
                    Nenhuma armadura equipada
                </span>
            )}

            {armors.map((armor, index) => (
                <ArmorCardSheet
                    key={index}
                    armor={armor}
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

export default CardArmadura
