import { useEffect, useMemo, useState } from 'react'
import {
    useLocation,
    useNavigate,
    useParams
} from 'react-router-dom'
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
    LupidaItem,
    CharacterModifiers
} from '../campaigns.types'

import '../campaigns.css'

import LupidaArmorCard from '../components/LupidaArmorCard'
import LupidaWeaponCard from '../components/LupidaWeaponCard'
import LupidaItemCard from '../components/LupidaItemCard'
import ConfirmArmorReplaceModal from '../components/ConfirmArmorReplaceModal'
import ConfirmWeaponReplaceModal from '../components/ConfirmWeaponReplaceModal'
import StrengthRequirementModal from '../components/StrengthRequirementModal'
import WeaponRequirementModal from '../components/WeaponRequirementModal'


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

type WeaponModifierFilter =
    | 'all'
    | LupidaWeapon['required_modifier']

type WeaponSortField =
    | 'value'
    | 'required_modifier_value'

type WeaponSortDirection =
    | 'asc'
    | 'desc'

function LupidaPage() {
    const { campaignId, characterId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    const routeState = location.state as {
        modifiers?: CharacterModifiers
    } | null

    const modifiers: CharacterModifiers =
        routeState?.modifiers ?? {
            str: 0,
            dex: 0,
            con: 0,
            intt: 0,
            wis: 0,
            cha: 0
        }

    const strengthModifier =
        modifiers.str

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

    const [weaponModifierFilter, setWeaponModifierFilter] =
        useState<WeaponModifierFilter>('all')

    const [weaponSortField, setWeaponSortField] =
        useState<WeaponSortField>('value')

    const [weaponSortDirection, setWeaponSortDirection] =
        useState<WeaponSortDirection>('asc')

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

    const [
        modifierBlockedWeapon,
        setModifierBlockedWeapon
    ] = useState<LupidaWeapon | null>(null)

    const filteredWeapons = useMemo(() => {
        const result =
            weaponModifierFilter === 'all'
                ? [...weapons]
                : weapons.filter(
                    weapon =>
                        weapon.required_modifier ===
                        weaponModifierFilter
                )

        result.sort((a, b) => {
            const firstValue =
                weaponSortField === 'value'
                    ? a.value
                    : a.required_modifier_value

            const secondValue =
                weaponSortField === 'value'
                    ? b.value
                    : b.required_modifier_value

            if (firstValue === secondValue) {
                return a.item_name.localeCompare(
                    b.item_name,
                    'pt-BR'
                )
            }

            return weaponSortDirection === 'asc'
                ? firstValue - secondValue
                : secondValue - firstValue
        })

        return result
    }, [
        weapons,
        weaponModifierFilter,
        weaponSortField,
        weaponSortDirection
    ])

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
    }
    function continueBuyArmor(
        armor: LupidaArmor
    ) {
        const conflict =
            equippedArmors.find(
                equippedArmor =>
                    equippedArmor.armor_slot_id ===
                    armor.armor_slot_id
            )

        if (conflict) {
            setPendingArmor(armor)
            setArmorModalOpen(true)
            return
        }

        void confirmBuyArmor(armor)
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
            setStrengthBlockedArmor(armor)
            return
        }

        continueBuyArmor(armor)
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

    function getWeaponModifier(
        weapon: LupidaWeapon
    ): number {
        const modifierKey: keyof CharacterModifiers =
            weapon.required_modifier === 'int'
                ? 'intt'
                : weapon.required_modifier

        return modifiers[modifierKey]
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
            getWeaponModifier(weapon) <
            weapon.required_modifier_value
        ) {
            setModifierBlockedWeapon(weapon)
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

            {activeTab === 'weapons' && (
                <div className="lupida-weapon-filters">
                    <div className="lupida-weapon-filter-group">
                        <label htmlFor="weapon-modifier-filter">
                            Modificador
                        </label>

                        <select
                            id="weapon-modifier-filter"
                            value={weaponModifierFilter}
                            onChange={event =>
                                setWeaponModifierFilter(
                                    event.target.value as WeaponModifierFilter
                                )
                            }
                        >
                            <option value="all">
                                Todos
                            </option>

                            <option value="str">
                                Força
                            </option>

                            <option value="dex">
                                Destreza
                            </option>

                            <option value="con">
                                Constituição
                            </option>

                            <option value="int">
                                Inteligência
                            </option>

                            <option value="wis">
                                Sabedoria
                            </option>

                            <option value="cha">
                                Carisma
                            </option>
                        </select>
                    </div>

                    <div className="lupida-weapon-filter-group">
                        <label htmlFor="weapon-sort-field">
                            Ordenar por
                        </label>

                        <select
                            id="weapon-sort-field"
                            value={weaponSortField}
                            onChange={event =>
                                setWeaponSortField(
                                    event.target.value as WeaponSortField
                                )
                            }
                        >
                            <option value="value">
                                Valor em ouro
                            </option>

                            <option value="required_modifier_value">
                                Requisito
                            </option>
                        </select>
                    </div>

                    <div className="lupida-weapon-filter-group">
                        <label htmlFor="weapon-sort-direction">
                            Ordem
                        </label>

                        <select
                            id="weapon-sort-direction"
                            value={weaponSortDirection}
                            onChange={event =>
                                setWeaponSortDirection(
                                    event.target.value as WeaponSortDirection
                                )
                            }
                        >
                            <option value="asc">
                                Menor primeiro
                            </option>

                            <option value="desc">
                                Maior primeiro
                            </option>
                        </select>
                    </div>

                    <div className="lupida-weapon-filter-count">
                        {filteredWeapons.length}{' '}
                        {filteredWeapons.length === 1
                            ? 'arma'
                            : 'armas'}
                    </div>
                </div>
            )}

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
                    filteredWeapons.map(weapon => (
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
                    armor={strengthBlockedArmor}
                    strengthModifier={strengthModifier}
                    onClose={() =>
                        setStrengthBlockedArmor(null)
                    }
                    onConfirm={() => {
                        const armor = strengthBlockedArmor

                        setStrengthBlockedArmor(null)

                        continueBuyArmor(armor)
                    }}
                />
            )}

            {modifierBlockedWeapon && (
                <WeaponRequirementModal
                    weapon={modifierBlockedWeapon}
                    currentModifier={
                        getWeaponModifier(
                            modifierBlockedWeapon
                        )
                    }
                    onClose={() =>
                        setModifierBlockedWeapon(null)
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
