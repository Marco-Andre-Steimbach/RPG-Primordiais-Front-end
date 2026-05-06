import { useState } from 'react'
import type { Element } from '../campaigns.types'
import { removeArmorFromCampaignCharacter } from '../campaigns.service'

const DAMAGE_TYPE_MAP: Record<number, string> = {
    1: 'Cortante',
    2: 'Perfurante',
    3: 'Concussão'
}

type Props = {
    armor: any
    elementsMap: Map<number, Element>
    isOpen: boolean
    onToggle: () => void
    campaignCharacterId: number
}

function ArmorCardSheet({
    armor,
    elementsMap,
    isOpen,
    onToggle,
    campaignCharacterId
}: Props) {
    const [showConfirm, setShowConfirm] = useState(false)
    const [loading, setLoading] = useState(false)

    const isChest =
        armor.slot.name.toLowerCase() === 'armadura'

    const weakDamage =
        armor.armor.weak_damage_type_id
            ? DAMAGE_TYPE_MAP[armor.armor.weak_damage_type_id]
            : null

    const resolvedElements = armor.elements
        .map((id: number) => elementsMap.get(id))
        .filter(Boolean) as Element[]

    async function handleUnequipArmor() {
        try {
            setLoading(true)

            await removeArmorFromCampaignCharacter(
                campaignCharacterId,
                {
                    armor_slot_id: armor.slot.id
                }
            )

            window.location.reload()
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="ability-wrapper">
            <div
                className="campaign-ability-card"
                onClick={onToggle}
            >
                <span className="campaign-ability-name">
                    {armor.armor.item_name}
                </span>

                <span className="campaign-ability-cost">
                    CA +{armor.armor.armor_class_bonus}
                </span>
            </div>

            {isOpen && (
                <div className="armor-card-expanded parchment">
                    {armor.armor.item_description && (
                        <p className="ability-description">
                            {armor.armor.item_description}
                        </p>
                    )}

                    <div className="armor-divider" />

                    <div className="armor-stats-grid">
                        <div>
                            <span>Slot </span>
                            <strong>{armor.slot.name}</strong>
                        </div>

                        <div>
                            <span>Bônus CA </span>
                            <strong>
                                +{armor.armor.armor_class_bonus}
                            </strong>
                        </div>

                        <div>
                            <span>Força mínima </span>
                            <strong>
                                {armor.armor.min_strength_required}
                            </strong>
                        </div>

                        {armor.armor.speed_penalty > 0 && (
                            <div>
                                <span>Penalidade de movimento</span>
                                <strong>
                                    -{armor.armor.speed_penalty}
                                </strong>
                            </div>
                        )}
                    </div>

                    {isChest && weakDamage && (
                        <>
                            <div className="armor-divider" />
                            <div className="armor-weakness">
                                <span>Fraqueza</span>
                                <strong>{weakDamage}</strong>
                            </div>
                        </>
                    )}

                    {resolvedElements.length > 0 && (
                        <>
                            <div className="armor-divider" />
                            <div className="ability-elements">
                                {resolvedElements.map(el => (
                                    <span
                                        key={el.id}
                                        className="item-element-tag"
                                    >
                                        {el.name}
                                    </span>
                                ))}
                            </div>
                        </>
                    )}

                    {armor.abilities.length > 0 && (
                        <>
                            <div className="armor-divider" />
                            <h4 className="section-title">
                                Habilidades
                            </h4>

                            {armor.abilities.map((ab: any) => (
                                <div
                                    key={ab.id}
                                    className="armor-ability-card"
                                >
                                    <div className="armor-ability-header">
                                        <strong>{ab.title}</strong>
                                        {ab.range > 0 && (
                                            <span>
                                                Alcance {ab.range}
                                            </span>
                                        )}
                                    </div>

                                    <p>{ab.description}</p>
                                </div>
                            ))}
                        </>
                    )}

                    <div className="armor-divider" />

                    <button
                        type="button"
                        className="armor-remove-button"
                        onClick={() => setShowConfirm(true)}
                    >
                        Desequipar armadura
                    </button>
                </div>
            )}

            {showConfirm && (
                <div className="unequip-modal-backdrop">
                    <div className="unequip-modal">
                        <h3>Desequipar armadura?</h3>

                        <p>
                            Tem certeza que deseja desequipar <strong>{armor.armor.item_name}</strong>?
                        </p>

                        <p>
                            Essa ação não poderá ser desfeita.
                        </p>

                        <div className="unequip-modal-actions">
                            <button
                                type="button"
                                className="secondary"
                                onClick={() => setShowConfirm(false)}
                                disabled={loading}
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                className="danger"
                                onClick={handleUnequipArmor}
                                disabled={loading}
                            >
                                {loading ? 'Desequipando...' : 'Desequipar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ArmorCardSheet
