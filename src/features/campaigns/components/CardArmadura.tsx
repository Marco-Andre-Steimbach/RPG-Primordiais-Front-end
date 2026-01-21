import { useState } from 'react'
import type { Element, SheetArmor } from '../campaigns.types'
import ArmorCardSheet from './ArmorCardSheet'


type Props = {
    baseArmor: number
    armors: SheetArmor[]
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
