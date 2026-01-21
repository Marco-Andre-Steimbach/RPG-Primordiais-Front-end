// ConfirmWeaponReplaceModal.tsx
import { useEffect, useState } from 'react'
import { fetchWeaponById } from '../campaigns.service'
import type { WeaponDetails } from '../campaigns.types'

type EquippedWeapon = {
    campaign_weapon_id: number
    weapon_id: number
}

type WeaponWithCampaignId = WeaponDetails & {
    campaign_weapon_id: number
}

type Props = {
    equippedWeapons: EquippedWeapon[]
    onCancel: () => void
    onConfirm: (campaignWeaponId: number) => void
}

function ConfirmWeaponReplaceModal({
    equippedWeapons,
    onCancel,
    onConfirm
}: Props) {
    const [details, setDetails] = useState<WeaponWithCampaignId[]>([])

    useEffect(() => {
        if (!equippedWeapons || equippedWeapons.length === 0) return

        Promise.all(
            equippedWeapons.map(w =>
                fetchWeaponById(w.weapon_id).then(r => ({
                    ...r.weapon,
                    campaign_weapon_id: w.campaign_weapon_id
                }))
            )
        ).then(setDetails)
    }, [equippedWeapons])

    return (
        <div className="confirm-modal-backdrop">
            <div className="confirm-modal">
                <h3>Substituir arma?</h3>
                <p>Você já possui 2 armas equipadas. Escolha uma para descartar.</p>

                <div className="confirm-options">
                    {details.map(w => (
                        <button
                            key={w.campaign_weapon_id}
                            className="confirm-option"
                            onClick={() => onConfirm(w.campaign_weapon_id)}
                        >
                            {w.item_name}
                        </button>
                    ))}
                </div>

                <button className="confirm-cancel" onClick={onCancel}>
                    Cancelar
                </button>
            </div>
        </div>
    )
}

export default ConfirmWeaponReplaceModal
