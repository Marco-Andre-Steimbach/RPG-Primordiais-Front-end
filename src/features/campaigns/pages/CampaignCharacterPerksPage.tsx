import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
    fetchCharacterById,
    fetchCharacterSheetInfo,
    fetchCharacterSheet,
    fetchPerksByRace,
    fetchPerksByOrder,
    addPerkToCampaignCharacter
} from '../campaigns.service'

import type {
    AvailablePerk,
    Character,
    CharacterSheetInfo,
    Perk
} from '../campaigns.types'

import CharacterProgressionModal from '../components/CharacterProgressionModal'
import CampaignCharacterPerkCard from '../components/CampaignCharacterPerkCard'
import '../campaigns.css'

const attributeOptions = [
    { value: '', label: 'Todos os atributos' },
    { value: 'str', label: 'Força' },
    { value: 'dex', label: 'Destreza' },
    { value: 'con', label: 'Constituição' },
    { value: 'int', label: 'Inteligência' },
    { value: 'wis', label: 'Sabedoria' },
    { value: 'cha', label: 'Carisma' },
    { value: 'hp_max', label: 'Vida máxima' },
    { value: 'mana_max', label: 'Mana máxima' },
    { value: 'sanity', label: 'Sanidade' },
    { value: 'speed', label: 'Velocidade' },
    { value: 'armor_class', label: 'Classe de Armadura' }
]

function normalizeAttributeName(attributeName: string) {
    if (attributeName === 'intt') {
        return 'int'
    }

    return attributeName
}

function perkHasAttribute(
    perk: Perk,
    attributeName: string
) {
    return perk.attributes.some(
        attribute =>
            normalizeAttributeName(
                attribute.attribute_name
            ) === attributeName
    )
}

function CampaignCharacterPerksPage() {
    const { campaignId, characterId } = useParams()
    const navigate = useNavigate()

    const [character, setCharacter] = useState<Character | null>(null)
    const [infos, setInfos] = useState<CharacterSheetInfo | null>(null)
    const [ownedPerkIds, setOwnedPerkIds] = useState<number[]>([])
    const [perks, setPerks] = useState<AvailablePerk[]>([])
    const [attributeFilter, setAttributeFilter] = useState('')

    const [modalOpen, setModalOpen] = useState(false)
    const [addedModalOpen, setAddedModalOpen] = useState(false)

    useEffect(() => {
        if (!campaignId || !characterId) return

        fetchCharacterById(characterId).then(res => {
            setCharacter(res.character.character)
        })

        fetchCharacterSheetInfo(
            campaignId,
            characterId
        ).then(res => {
            setInfos(res.infos)
        })

        fetchCharacterSheet(
            campaignId,
            characterId
        ).then(res => {
            setOwnedPerkIds(
                res.sheet.perks.map(perk => perk.id)
            )
        })
    }, [campaignId, characterId])

    useEffect(() => {
        if (!character || !infos) return

        Promise.all([
            fetchPerksByRace(character.race_id),
            fetchPerksByOrder(character.order_id)
        ]).then(([raceResponse, orderResponse]) => {
            const racePerks: AvailablePerk[] =
                raceResponse.perks.map(perk => ({
                    ...perk,
                    origin: 'race'
                }))

            const orderPerks: AvailablePerk[] =
                orderResponse.perks.map(perk => ({
                    ...perk,
                    origin: 'order'
                }))

            const availablePerks = [
                ...racePerks,
                ...orderPerks
            ].filter(
                perk =>
                    perk.required_level <= infos.level &&
                    !ownedPerkIds.includes(perk.id)
            )

            setPerks(availablePerks)
        })
    }, [character, infos, ownedPerkIds])

    useEffect(() => {
        if (!infos) return

        setModalOpen(infos.perks >= infos.level)
    }, [infos])

    const sortedPerks = useMemo(() => {
        return [...perks].sort((firstPerk, secondPerk) => {
            if (attributeFilter) {
                const firstHasAttribute = perkHasAttribute(
                    firstPerk,
                    attributeFilter
                )

                const secondHasAttribute = perkHasAttribute(
                    secondPerk,
                    attributeFilter
                )

                if (
                    firstHasAttribute !==
                    secondHasAttribute
                ) {
                    return firstHasAttribute ? -1 : 1
                }
            }

            if (
                firstPerk.required_level !==
                secondPerk.required_level
            ) {
                return (
                    firstPerk.required_level -
                    secondPerk.required_level
                )
            }

            if (firstPerk.origin !== secondPerk.origin) {
                return firstPerk.origin === 'race'
                    ? -1
                    : 1
            }

            return firstPerk.name.localeCompare(
                secondPerk.name,
                'pt-BR'
            )
        })
    }, [perks, attributeFilter])

    if (
        !campaignId ||
        !characterId ||
        !character ||
        !infos
    ) {
        return (
            <div className="campaign-page-loading">
                Carregando perks...
            </div>
        )
    }

    const missing = Math.max(
        infos.level - infos.perks,
        0
    )

    const handleAddPerk = async (perkId: number) => {
        await addPerkToCampaignCharacter(
            infos.campaign_character_id,
            {
                perk_id: perkId
            }
        )

        const [infoResponse, sheetResponse] =
            await Promise.all([
                fetchCharacterSheetInfo(
                    campaignId,
                    characterId
                ),
                fetchCharacterSheet(
                    campaignId,
                    characterId
                )
            ])

        setInfos(infoResponse.infos)

        setOwnedPerkIds(
            sheetResponse.sheet.perks.map(
                perk => perk.id
            )
        )

        setAddedModalOpen(true)
    }

    return (
        <div className="campaign-perks-page">
            <header className="campaign-perks-header">
                <h1>Perks disponíveis</h1>

                <p>
                    Faltam {missing} perk(s)
                </p>
            </header>

            <div className="campaign-perks-filters">
                <div className="campaign-perks-filter">
                    <label htmlFor="perk-attribute-filter">
                        Priorizar atributo
                    </label>

                    <select
                        id="perk-attribute-filter"
                        value={attributeFilter}
                        onChange={event =>
                            setAttributeFilter(
                                event.target.value
                            )
                        }
                    >
                        {attributeOptions.map(option => (
                            <option
                                key={option.value || 'all'}
                                value={option.value}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {sortedPerks.map(perk => (
                <CampaignCharacterPerkCard
                    key={`${perk.origin}-${perk.id}`}
                    perk={perk}
                    canAdd={
                        missing > 0 &&
                        infos.level >=
                            perk.required_level
                    }
                    onAdd={handleAddPerk}
                />
            ))}

            {modalOpen && (
                <CharacterProgressionModal
                    title="Perks completos"
                    message="Você já distribuiu todos os perks disponíveis. Agora pode voltar para a ficha do personagem."
                    onConfirm={() =>
                        navigate(
                            `/campaign/${campaignId}/characters/${characterId}/sheet`
                        )
                    }
                />
            )}

            {addedModalOpen && (
                <CharacterProgressionModal
                    title="Perk adicionado"
                    message="O perk foi adicionado com sucesso ao personagem."
                    onConfirm={() =>
                        setAddedModalOpen(false)
                    }
                />
            )}
        </div>
    )
}

export default CampaignCharacterPerksPage
