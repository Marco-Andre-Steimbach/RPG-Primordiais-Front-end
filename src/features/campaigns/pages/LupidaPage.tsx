import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    fetchLupida,
    fetchCharacterSheetInfo,
    spendCampaignCharacterGold,
    addArmorToCampaignCharacter,
    addWeaponToCampaignCharacter,
    addItemToCampaignCharacter
} from '../campaigns.service'
import type {
    LupidaArmor,
    LupidaWeapon,
    LupidaItem
} from '../campaigns.types'

import '../campaigns.css'

import LupidaArmorCard from '../components/LupidaArmorCard'
import LupidaWeaponCard from '../components/LupidaWeaponCard'
import LupidaItemCard from '../components/LupidaItemCard'
import ConfirmArmorReplaceModal from '../components/ConfirmArmorReplaceModal'
import ConfirmWeaponReplaceModal from '../components/ConfirmWeaponReplaceModal'

type TabType = 'armors' | 'weapons' | 'items'

type EquippedArmor = {
    armor_id: number
    armor_slot_id: number
}

type EquippedWeapon = {
    campaign_weapon_id: number
    weapon_id: number
    item_name: string
}

function LupidaPage() {
    const { campaignId, characterId } = useParams()
    const navigate = useNavigate()

    const [activeTab, setActiveTab] = useState<TabType>('armors')
    const [campaignCharacterId, setCampaignCharacterId] = useState<number | null>(null)

    const [armors, setArmors] = useState<LupidaArmor[]>([])
    const [weapons, setWeapons] = useState<LupidaWeapon[]>([])
    const [items, setItems] = useState<LupidaItem[]>([])

    const [equippedArmors, setEquippedArmors] = useState<EquippedArmor[]>([])
    const [equippedWeapons, setEquippedWeapons] = useState<EquippedWeapon[]>([])

    const [gold, setGold] = useState(0)
    const [loading, setLoading] = useState(true)

    const [pendingArmor, setPendingArmor] = useState<LupidaArmor | null>(null)
    const [armorModalOpen, setArmorModalOpen] = useState(false)

    const [pendingWeapon, setPendingWeapon] = useState<LupidaWeapon | null>(null)
    const [weaponModalOpen, setWeaponModalOpen] = useState(false)

    useEffect(() => {
        if (!campaignId || !characterId) return

        Promise.all([
            fetchLupida(campaignId),
            fetchCharacterSheetInfo(campaignId, characterId)
        ]).then(([lupidaRes, infoRes]) => {
            setArmors(lupidaRes.lupida.armors)
            setWeapons(lupidaRes.lupida.weapons)
            setItems(lupidaRes.lupida.items)

            const infos = infoRes?.infos
            if (infos) {
                setGold(infos.gold)
                setCampaignCharacterId(infos.campaign_character_id)

                setEquippedArmors(
                    infos.armors.map((a: any) => ({
                        armor_id: a.armor_id,
                        armor_slot_id: a.armor_slot_id
                    }))
                )

                setEquippedWeapons(
                    infos.weapons.map((w: any) => ({
                        campaign_weapon_id: w.id,
                        weapon_id: w.weapon_id,
                        item_name: w.item_name
                    }))
                )
            }

            setLoading(false)
        })
    }, [campaignId, characterId])

    useEffect(() => {
        const blockBack = () => {
            navigate(`/campaigns/${campaignId}`, { replace: true })
        }

        window.addEventListener('popstate', blockBack)

        return () => {
            window.removeEventListener('popstate', blockBack)
        }
    }, [campaignId, navigate])


    function tryBuyArmor(armor: LupidaArmor) {
        if (gold < armor.value) return

        const conflict = equippedArmors.find(
            ea => ea.armor_slot_id === armor.armor_slot_id
        )

        if (conflict) {
            setPendingArmor(armor)
            setArmorModalOpen(true)
            return
        }

        confirmBuyArmor(armor)
    }

    async function confirmBuyArmor(armor: LupidaArmor) {
        await addArmorToCampaignCharacter(campaignCharacterId!, {
            armor_item_id: armor.item_id,
            equip: true
        })

        await spendCampaignCharacterGold({
            campaign_character_id: campaignCharacterId!,
            amount: armor.value,
            operation: 'remove'
        })

        setGold(v => v - armor.value)
        setArmors(v => v.filter(a => a.armor_id !== armor.armor_id))
        setArmorModalOpen(false)
        setPendingArmor(null)
    }

    function tryBuyWeapon(weapon: LupidaWeapon) {
        if (gold < weapon.value) return

        if (equippedWeapons.length >= 2) {
            setPendingWeapon(weapon)
            setWeaponModalOpen(true)
            return
        }

        confirmBuyWeapon(weapon)
    }

    async function confirmBuyWeapon(
        weapon: LupidaWeapon,
        weaponToRemove?: EquippedWeapon
    ) {
        await addWeaponToCampaignCharacter(campaignCharacterId!, {
            weapon_id: weapon.item_id,
            equip: true,
            deactivate_weapon_id: weaponToRemove?.campaign_weapon_id
        })

        await spendCampaignCharacterGold({
            campaign_character_id: campaignCharacterId!,
            amount: weapon.value,
            operation: 'remove'
        })

        setGold(v => v - weapon.value)
        setWeapons(v => v.filter(w => w.id !== weapon.id))
        setWeaponModalOpen(false)
        setPendingWeapon(null)
    }

    async function buyItem(item: LupidaItem, quantity: number) {
        const totalCost = item.value * quantity
        if (gold < totalCost) return

        await addItemToCampaignCharacter(campaignCharacterId!, {
            item_id: item.item_id,
            quantity
        })

        await spendCampaignCharacterGold({
            campaign_character_id: campaignCharacterId!,
            amount: totalCost,
            operation: 'remove'
        })

        setGold(v => v - totalCost)

        setItems(v =>
            v.map(i =>
                i.item_id === item.item_id
                    ? { ...i, quantity: i.quantity - quantity }
                    : i
            ).filter(i => i.quantity > 0)
        )
    }

    function handleCloseLupida() {
        navigate(`/campaigns/${campaignId}`, { replace: true })
    }

    if (loading) {
        return <div className="campaign-page-loading">Carregando Lúpida...</div>
    }

    return (
        <div className="lupida-page">
            <header className="lupida-header">
                <h1>Lúpida</h1>
                <div className="lupida-gold">
                    Ouro: <strong>{gold}</strong>
                </div>
            </header>

            <div className="lupida-tabs">
                <button className={activeTab === 'armors' ? 'active' : ''} onClick={() => setActiveTab('armors')}>
                    Armaduras
                </button>
                <button className={activeTab === 'weapons' ? 'active' : ''} onClick={() => setActiveTab('weapons')}>
                    Armas
                </button>
                <button className={activeTab === 'items' ? 'active' : ''} onClick={() => setActiveTab('items')}>
                    Itens
                </button>
            </div>

            <div className="lupida-content">
                {activeTab === 'armors' &&
                    armors.map(armor => (
                        <LupidaArmorCard
                            key={armor.armor_id}
                            armor={armor}
                            onBuy={tryBuyArmor}
                        />
                    ))}

                {activeTab === 'weapons' &&
                    weapons.map(weapon => (
                        <LupidaWeaponCard
                            key={weapon.id}
                            weapon={weapon}
                            onBuy={tryBuyWeapon}
                        />
                    ))}

                {activeTab === 'items' &&
                    items.map(item => (
                        <LupidaItemCard
                            key={item.item_id}
                            item={item}
                            onBuy={buyItem}
                        />
                    ))}
            </div>

            <footer className="lupida-footer">
                <button onClick={handleCloseLupida}>Sair da Lúpida</button>
            </footer>

            {armorModalOpen && pendingArmor && (
                <ConfirmArmorReplaceModal
                    armor={pendingArmor}
                    onCancel={() => setArmorModalOpen(false)}
                    onConfirm={() => confirmBuyArmor(pendingArmor)}
                />
            )}

            {weaponModalOpen && pendingWeapon && (
                <ConfirmWeaponReplaceModal
                    equippedWeapons={equippedWeapons}
                    onCancel={() => setWeaponModalOpen(false)}
                    onConfirm={campaignWeaponId =>
                        confirmBuyWeapon(
                            pendingWeapon,
                            equippedWeapons.find(
                                w => w.campaign_weapon_id === campaignWeaponId
                            )
                        )
                    }
                />
            )}
        </div>
    )
}

export default LupidaPage
