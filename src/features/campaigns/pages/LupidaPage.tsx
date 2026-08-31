import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    fetchLupida,
    fetchCharacterSheetInfo,
    fetchFullCharacterSheet,
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
import StrengthRequirementModal from '../components/StrengthRequirementModal'

type TabType =
    | 'armors'
    | 'weapons'
    | 'items'

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

    const [activeTab, setActiveTab] =
        useState<TabType>('armors')

    const [
        campaignCharacterId,
        setCampaignCharacterId
    ] = useState<number | null>(null)

    const [armors, setArmors] =
        useState<LupidaArmor[]>([])

    const [weapons, setWeapons] =
        useState<LupidaWeapon[]>([])

    const [items, setItems] =
        useState<LupidaItem[]>([])

    const [equippedArmors, setEquippedArmors] =
        useState<EquippedArmor[]>([])

    const [equippedWeapons, setEquippedWeapons] =
        useState<EquippedWeapon[]>([])

    const [gold, setGold] =
        useState(0)

    const [strengthModifier, setStrengthModifier] =
        useState(0)

    const [loading, setLoading] =
        useState(true)

    const [pendingArmor, setPendingArmor] =
        useState<LupidaArmor | null>(null)

    const [armorModalOpen, setArmorModalOpen] =
        useState(false)

    const [
        strengthBlockedArmor,
        setStrengthBlockedArmor
    ] = useState<LupidaArmor | null>(null)

    const [pendingWeapon, setPendingWeapon] =
        useState<LupidaWeapon | null>(null)

    const [weaponModalOpen, setWeaponModalOpen] =
        useState(false)

    useEffect(() => {
        if (!campaignId || !characterId) {
            return
        }

        setLoading(true)

        async function load() {
            const [
                lupidaRes,
                infoRes
            ] = await Promise.all([
                fetchLupida(campaignId!),
                fetchCharacterSheetInfo(
                    campaignId!,
                    characterId!
                )
            ])

            setArmors(
                lupidaRes.lupida.armors
            )

            setWeapons(
                lupidaRes.lupida.weapons
            )

            setItems(
                lupidaRes.lupida.items
            )

            const infos =
                infoRes?.infos

            if (!infos) {
                return
            }

            setGold(infos.gold)

            setCampaignCharacterId(
                infos.campaign_character_id
            )

            setEquippedArmors(
                infos.armors.map(armor => ({
                    armor_id:
                        armor.armor_id,

                    armor_slot_id:
                        armor.armor_slot_id
                }))
            )

            setEquippedWeapons(
                infos.weapons.map(weapon => ({
                    campaign_weapon_id:
                        weapon.id,

                    weapon_id:
                        weapon.weapon_id,

                    item_name:
                        weapon.item_name
                }))
            )

            const sheetRes = await fetchFullCharacterSheet(
    campaignId!,
    characterId!
)

setStrengthModifier(
    sheetRes.sheet.base.modifiers.str
)
        }

        load()
            .finally(() => {
                setLoading(false)
            })
    }, [
        campaignId,
        characterId
    ])

    async function refreshCharacterInfos() {
        if (
            !campaignId ||
            !characterId
        ) {
            return
        }

        const infoRes =
            await fetchCharacterSheetInfo(
                campaignId,
                characterId
            )

        const infos =
            infoRes?.infos

        if (!infos) {
            return
        }

        setGold(
            infos.gold
        )

        setCampaignCharacterId(
            infos.campaign_character_id
        )

        setEquippedArmors(
            infos.armors.map(armor => ({
                armor_id:
                    armor.armor_id,

                armor_slot_id:
                    armor.armor_slot_id
            }))
        )

        setEquippedWeapons(
            infos.weapons.map(weapon => ({
                campaign_weapon_id:
                    weapon.id,

                weapon_id:
                    weapon.weapon_id,

                item_name:
                    weapon.item_name
            }))
        )

        const sheetRes = await fetchFullCharacterSheet(
    campaignId,
    characterId
)

setStrengthModifier(
    sheetRes.sheet.base.modifiers.str
)
    }

    function tryBuyArmor(
        armor: LupidaArmor
    ) {
        if (!campaignCharacterId) {
            return
        }

        if (gold < armor.value) {
            return
        }

        if (
            strengthModifier <
            armor.min_strength_required
        ) {
            setStrengthBlockedArmor(
                armor
            )

            return
        }

        const conflict =
            equippedArmors.find(
                equippedArmor =>
                    equippedArmor
                        .armor_slot_id ===
                    armor.armor_slot_id
            )

        if (conflict) {
            setPendingArmor(armor)
            setArmorModalOpen(true)
            return
        }

        void confirmBuyArmor(
            armor
        )
    }

    async function confirmBuyArmor(
        armor: LupidaArmor
    ) {
        if (!campaignCharacterId) {
            return
        }

        await addArmorToCampaignCharacter(
            campaignCharacterId,
            {
                armor_item_id:
                    armor.item_id,

                equip: true
            }
        )

        await spendCampaignCharacterGold({
            campaign_character_id:
                campaignCharacterId,

            amount:
                armor.value,

            operation:
                'remove'
        })

        setGold(
            value =>
                value - armor.value
        )

        setArmors(
            current =>
                current.filter(
                    currentArmor =>
                        currentArmor
                            .armor_id !==
                        armor.armor_id
                )
        )

        setArmorModalOpen(false)
        setPendingArmor(null)

        await refreshCharacterInfos()
    }

    function tryBuyWeapon(
        weapon: LupidaWeapon
    ) {
        if (!campaignCharacterId) {
            return
        }

        if (gold < weapon.value) {
            return
        }

        if (
            equippedWeapons.length >= 2
        ) {
            setPendingWeapon(weapon)
            setWeaponModalOpen(true)
            return
        }

        void confirmBuyWeapon(
            weapon
        )
    }

    async function confirmBuyWeapon(
        weapon: LupidaWeapon,
        weaponToRemove?: EquippedWeapon
    ) {
        if (!campaignCharacterId) {
            return
        }

        await addWeaponToCampaignCharacter(
            campaignCharacterId,
            {
                weapon_id:
                    weapon.item_id,

                equip: true,

                deactivate_weapon_id:
                    weaponToRemove
                        ?.campaign_weapon_id
            }
        )

        await spendCampaignCharacterGold({
            campaign_character_id:
                campaignCharacterId,

            amount:
                weapon.value,

            operation:
                'remove'
        })

        setGold(
            value =>
                value - weapon.value
        )

        setWeapons(
            current =>
                current.filter(
                    currentWeapon =>
                        currentWeapon.id !==
                        weapon.id
                )
        )

        setWeaponModalOpen(false)
        setPendingWeapon(null)

        await refreshCharacterInfos()
    }

    async function buyItem(
        item: LupidaItem,
        quantity: number
    ) {
        if (!campaignCharacterId) {
            return
        }

        const totalCost =
            item.value * quantity

        if (gold < totalCost) {
            return
        }

        await addItemToCampaignCharacter(
            campaignCharacterId,
            {
                item_id:
                    item.item_id,

                quantity
            }
        )

        await spendCampaignCharacterGold({
            campaign_character_id:
                campaignCharacterId,

            amount:
                totalCost,

            operation:
                'remove'
        })

        setGold(
            value =>
                value - totalCost
        )

        setItems(
            current =>
                current
                    .map(currentItem =>
                        currentItem
                            .item_id ===
                        item.item_id
                            ? {
                                ...currentItem,
                                quantity:
                                    currentItem
                                        .quantity -
                                    quantity
                            }
                            : currentItem
                    )
                    .filter(
                        currentItem =>
                            currentItem
                                .quantity > 0
                    )
        )

        await refreshCharacterInfos()
    }

    if (loading) {
        return (
            <div className="campaign-page-loading">
                Carregando Lúpida...
            </div>
        )
    }

    return (
        <div className="lupida-page">
            <header className="lupida-header">
                <div>
                    <h1>
                        Lúpida
                    </h1>

                    <span className="lupida-character-strength">
                        Força atual:{' '}
                        <strong>
                            +{strengthModifier}
                        </strong>
                    </span>
                </div>

                <div className="lupida-gold">
                    Ouro:{' '}
                    <strong>
                        {gold}
                    </strong>
                </div>
            </header>

            <div className="lupida-tabs">
                <button
                    className={
                        activeTab ===
                        'armors'
                            ? 'active'
                            : ''
                    }
                    onClick={() =>
                        setActiveTab(
                            'armors'
                        )
                    }
                >
                    Armaduras
                </button>

                <button
                    className={
                        activeTab ===
                        'weapons'
                            ? 'active'
                            : ''
                    }
                    onClick={() =>
                        setActiveTab(
                            'weapons'
                        )
                    }
                >
                    Armas
                </button>

                <button
                    className={
                        activeTab ===
                        'items'
                            ? 'active'
                            : ''
                    }
                    onClick={() =>
                        setActiveTab(
                            'items'
                        )
                    }
                >
                    Itens
                </button>
            </div>

            <div className="lupida-content">
                {activeTab ===
                    'armors' &&
                    armors.map(armor => (
                        <LupidaArmorCard
                            key={
                                armor.armor_id
                            }
                            armor={
                                armor
                            }
                            onBuy={
                                tryBuyArmor
                            }
                            canBuy={
                                gold >=
                                armor.value
                            }
                        />
                    ))}

                {activeTab ===
                    'weapons' &&
                    weapons.map(weapon => (
                        <LupidaWeaponCard
                            key={
                                weapon.id
                            }
                            weapon={
                                weapon
                            }
                            onBuy={
                                tryBuyWeapon
                            }
                            canBuy={
                                gold >=
                                weapon.value
                            }
                        />
                    ))}

                {activeTab ===
                    'items' &&
                    items.map(item => (
                        <LupidaItemCard
                            key={
                                item.item_id
                            }
                            item={
                                item
                            }
                            gold={
                                gold
                            }
                            onBuy={
                                buyItem
                            }
                            canBuy={
                                gold >=
                                item.value
                            }
                        />
                    ))}
            </div>

            <footer className="lupida-footer">
                <button
                    onClick={() =>
                        navigate(
                            `/campaigns/${campaignId}`,
                            {
                                replace: true
                            }
                        )
                    }
                >
                    Sair da Lúpida
                </button>
            </footer>

            {strengthBlockedArmor && (
                <StrengthRequirementModal
                    armor={
                        strengthBlockedArmor
                    }
                    strengthModifier={
                        strengthModifier
                    }
                    onClose={() =>
                        setStrengthBlockedArmor(
                            null
                        )
                    }
                />
            )}

            {armorModalOpen &&
                pendingArmor && (
                    <ConfirmArmorReplaceModal
                        armor={
                            pendingArmor
                        }
                        onCancel={() => {
                            setArmorModalOpen(
                                false
                            )

                            setPendingArmor(
                                null
                            )
                        }}
                        onConfirm={() =>
                            confirmBuyArmor(
                                pendingArmor
                            )
                        }
                    />
                )}

            {weaponModalOpen &&
                pendingWeapon && (
                    <ConfirmWeaponReplaceModal
                        equippedWeapons={
                            equippedWeapons
                        }
                        onCancel={() => {
                            setWeaponModalOpen(
                                false
                            )

                            setPendingWeapon(
                                null
                            )
                        }}
                        onConfirm={
                            campaignWeaponId =>
                                confirmBuyWeapon(
                                    pendingWeapon,
                                    equippedWeapons.find(
                                        weapon =>
                                            weapon
                                                .campaign_weapon_id ===
                                            campaignWeaponId
                                    )
                                )
                        }
                    />
                )}
        </div>
    )
}

export default LupidaPage
