import { useEffect, useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    fetchCampaignById,
    fetchCharacterSheetInfo,
    fetchFullCharacterSheet,
    fetchAllElements
} from '../campaigns.service'
import type {
    CampaignWithCharacters,
    CharacterSheetInfo,
    FullCharacterSheet,
    Element
} from '../campaigns.types'

import CharacterProgressionModal from '../components/CharacterProgressionModal'
import CardInfosGameplay from '../components/CardInfosGameplay'
import CardAtributos from '../components/CardAtributos'
import CardAbilidades from '../components/CardAbilidades'
import CardTiposPersonagem from '../components/CardTiposPersonagem'
import CardFraquezasDefensivas from '../components/CardFraquezasDefensivas'
import CardArmadura from '../components/CardArmadura'
import CardArmas from '../components/CardArmas'
import CardItens from '../components/CardItens'
import CardPerks from '../components/CardPerks'
import CardInfosGerais from '../components/CardInfosGerais'
import CollapsibleSection from '../components/CollapsibleSection'

import '../campaigns.css'

function calculateExpectedAbilities(level: number) {
    if (level <= 4) return level
    return 4 + Math.floor((level - 4) / 3)
}

const DAMAGE_TYPE_MAP: Record<number, string> = {
    1: 'Cortante',
    2: 'Perfurante',
    3: 'Concussão'
}

function getCharacterWeakDamageTypes(armors: any[]) {
    const chestArmor = armors.find(
        a => a.is_equipped && a.armor.armor_slot_id === 2
    )

    if (!chestArmor) {
        return [1, 2, 3]
    }

    const weakType = chestArmor.armor.weak_damage_type_id

    if (!weakType) {
        return []
    }

    return [weakType]
}

function CharacterSheetPage() {
    const { campaignId, characterId } = useParams()
    const navigate = useNavigate()

    const [campaign, setCampaign] = useState<CampaignWithCharacters | null>(null)
    const [infos, setInfos] = useState<CharacterSheetInfo | null>(null)
    const [sheet, setSheet] = useState<FullCharacterSheet | null>(null)
    const [elements, setElements] = useState<Element[]>([])
    const [modal, setModal] = useState<null | {
        title: string
        message: string
        redirect: string
    }>(null)

    useEffect(() => {
        if (!campaignId || !characterId) return

        fetchCampaignById(campaignId).then(res => {
            setCampaign(res.campaign)
        })

        fetchCharacterSheetInfo(campaignId, characterId).then(res => {
            setInfos(res.infos)
        })

        fetchFullCharacterSheet(campaignId, characterId).then(res => {
            setSheet(res.sheet)
        })

        fetchAllElements().then(res => {
            setElements(res.elements)
        })
    }, [campaignId, characterId])

    useEffect(() => {
        if (!campaign || !infos || !sheet) return

        const character = campaign.characters.find(
            c => c.character_id === Number(characterId)
        )

        if (!character) return

        const level = character.level
        const expectedPerks = level
        const expectedAbilities = calculateExpectedAbilities(level)

        if (sheet.progression.pending_level_ups > 0) {
            setModal({
                title: 'Atributo para evoluir',
                message: `Este personagem possui ${sheet.progression.pending_level_ups} ponto(s) de atributo pendente(s). Você precisa distribuí-los antes de continuar.`,
                redirect: `/campaigns/${campaignId}`
            })
            return
        }

        if (infos.perks < expectedPerks) {
            setModal({
                title: 'Perks pendentes',
                message: `Este personagem possui ${infos.perks} perks, mas deveria possuir ${expectedPerks}. Você precisa distribuir ${expectedPerks - infos.perks} perk(s) antes de continuar.`,
                redirect: `/campaign/${campaignId}/characters/${characterId}/perks`
            })
            return
        }

        if (infos.abilities < expectedAbilities) {
            setModal({
                title: 'Habilidades pendentes',
                message: `Este personagem possui ${infos.abilities} habilidades, mas deveria possuir ${expectedAbilities}. Você precisa escolher ${expectedAbilities - infos.abilities} habilidade(s) antes de continuar.`,
                redirect: `/campaign/${campaignId}/characters/${characterId}/abilities`
            })
            return
        }

        setModal(null)
    }, [campaign, infos, sheet, campaignId, characterId])

    const elementsMap = useMemo(() => {
        const map = new Map<number, Element>()
        elements.forEach(el => map.set(el.id, el))
        return map
    }, [elements])

    const characterElementIds = useMemo(() => {
        if (!sheet) return []

        const ids = new Set<number>()

        sheet.armors.forEach(armor => {
            armor.elements.forEach(elId => ids.add(elId))
        })

        if (ids.size === 0) {
            ids.add(1)
        }

        return Array.from(ids)
    }, [sheet])

    const characterElements = useMemo(() => {
        return characterElementIds
            .map(id => elementsMap.get(id))
            .filter(Boolean) as Element[]
    }, [characterElementIds, elementsMap])

    const weakDamageTypeIds = useMemo(() => {
        if (!sheet) return []
        return getCharacterWeakDamageTypes(sheet.armors)
    }, [sheet])

    const weakDamageTypes = useMemo(() => {
        return weakDamageTypeIds.map(id => ({
            id,
            name: DAMAGE_TYPE_MAP[id]
        }))
    }, [weakDamageTypeIds])

    if (modal) {
        return (
            <CharacterProgressionModal
                title={modal.title}
                message={modal.message}
                onConfirm={() => navigate(modal.redirect)}
            />
        )
    }

    if (!sheet) {
        return (
            <div className="campaign-page-loading">
                Carregando ficha do personagem...
            </div>
        )
    }

    return (
        <div className="character-sheet-page">
            <button
                className="lupida-button"
                onClick={() =>
                    navigate(
                        `/campaign/${campaignId}/characters/${characterId}/lupida`
                    )
                }
            >
                Ir para Lupida
            </button>

            <CardInfosGerais
                level={sheet.progression.level}
                gold={sheet.progression.gold}
                xpCurrent={sheet.progression.xp.current}
                xpRequired={sheet.progression.xp.required_for_next_level}
                xpRemaining={sheet.progression.xp.to_next_level}
                pendingLevelUps={sheet.progression.pending_level_ups}
            />

            <CardInfosGameplay
                level={sheet.base.level}
                hpMax={sheet.base.hp_max}
                manaMax={sheet.base.mana_max}
                armorClass={sheet.derived.armor_class}
                sanityMax={sheet.base.sanity.max}
                speed={sheet.derived.speed}
            />

            <CardTiposPersonagem elements={characterElements} />

            <CardFraquezasDefensivas damageTypes={weakDamageTypes} />

            <CardAtributos
                attributes={sheet.base.attributes.final}
                modifiers={sheet.base.modifiers}
            />

            <CollapsibleSection title="Habilidades">
                <CardAbilidades
                    abilities={sheet.abilities}
                    elementsMap={elementsMap}
                />
            </CollapsibleSection>

            <CollapsibleSection title="Perks">
                <CardPerks
                    perks={sheet.perks}
                    elementsMap={elementsMap}
                />
            </CollapsibleSection>

            <CollapsibleSection title="Armadura">
                <CardArmadura
                    baseArmor={sheet.base.base_ca}
                    armors={sheet.armors}
                    elementsMap={elementsMap}
                    campaignCharacterId={sheet.base.campaign_character_id}
                />
            </CollapsibleSection>

            <CollapsibleSection title="Armas">
                <CardArmas
                    weapons={sheet.weapons}
                    elementsMap={elementsMap}
                />
            </CollapsibleSection>

            <CollapsibleSection title="Itens">
                <CardItens
                    items={sheet.items}
                    elementsMap={elementsMap}
                    campaignCharacterId={sheet.base.campaign_character_id}
                />
            </CollapsibleSection>
        </div>
    )
}

export default CharacterSheetPage
