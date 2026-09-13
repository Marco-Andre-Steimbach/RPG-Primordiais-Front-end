import {
    useEffect,
    useMemo,
    useState
} from 'react'
import {
    useNavigate,
    useParams
} from 'react-router-dom'

import {
    fetchCharacterAbilities,
    fetchCharacterSheetInfo,
    fetchCharacterSheet,
    addAbilityToCampaignCharacter,
    fetchAllElements
} from '../campaigns.service'

import type {
    CampaignCharacterAbility,
    CharacterSheetInfo,
    Element
} from '../campaigns.types'

import CharacterProgressionModal from '../components/CharacterProgressionModal'
import AbilityCardSheet from '../components/AbilityCardSheet'

import '../campaigns.css'

function calculateExpectedAbilities(level: number) {
    if (level <= 4) {
        return level
    }

    return 4 + Math.floor((level - 4) / 3)
}

function CampaignCharacterAbilitiesPage() {
    const {
        campaignId,
        characterId
    } = useParams()

    const navigate = useNavigate()

    const [
        abilities,
        setAbilities
    ] = useState<CampaignCharacterAbility[]>([])

    const [
        infos,
        setInfos
    ] = useState<CharacterSheetInfo | null>(null)

    const [
        ownedAbilityIds,
        setOwnedAbilityIds
    ] = useState<number[]>([])

    const [
        elements,
        setElements
    ] = useState<Element[]>([])

    const [
        openAbilityId,
        setOpenAbilityId
    ] = useState<number | null>(null)

    const [
        search,
        setSearch
    ] = useState('')

    const [
        modalComplete,
        setModalComplete
    ] = useState(false)

    const [
        modalAdded,
        setModalAdded
    ] = useState(false)

    const loadData = async () => {
        if (!campaignId || !characterId) {
            return
        }

        const [
            infosResponse,
            sheetResponse,
            abilitiesResponse
        ] = await Promise.all([
            fetchCharacterSheetInfo(
                campaignId,
                characterId
            ),
            fetchCharacterSheet(
                campaignId,
                characterId
            ),
            fetchCharacterAbilities(
                characterId
            )
        ])

        setInfos(
            infosResponse.infos
        )

        setOwnedAbilityIds(
            sheetResponse.sheet.abilities.map(
                ability =>
                    ability.ability.id
            )
        )

        setAbilities(
            abilitiesResponse.abilities
        )
    }

    useEffect(() => {
        if (!campaignId || !characterId) {
            return
        }

        loadData()

        fetchAllElements()
            .then(response => {
                setElements(
                    response.elements
                )
            })
    }, [
        campaignId,
        characterId
    ])

    useEffect(() => {
        if (!infos) {
            return
        }

        const expected =
            calculateExpectedAbilities(
                infos.level
            )

        setModalComplete(
            infos.abilities >= expected
        )
    }, [infos])

    const elementsMap = useMemo(() => {
        const map =
            new Map<number, Element>()

        elements.forEach(element => {
            map.set(
                element.id,
                element
            )
        })

        return map
    }, [elements])

    const expectedAbilities =
        infos
            ? calculateExpectedAbilities(
                infos.level
            )
            : 0

    const missing =
        infos
            ? Math.max(
                expectedAbilities -
                    infos.abilities,
                0
            )
            : 0

    const availableAbilities =
        useMemo(() => {
            return abilities.filter(
                entry =>
                    !ownedAbilityIds.includes(
                        entry.ability.id
                    )
            )
        }, [
            abilities,
            ownedAbilityIds
        ])

    const filteredAbilities =
        useMemo(() => {
            const normalizedSearch =
                search
                    .trim()
                    .toLowerCase()

            if (!normalizedSearch) {
                return availableAbilities
            }

            return availableAbilities.filter(
                entry => {
                    if (
                        entry.schema === 'new'
                    ) {
                        const normalTitle =
                            entry.ability
                                .forms
                                .normal
                                ?.title ?? ''

                        const arcaneTitle =
                            entry.ability
                                .forms
                                .arcane
                                ?.title ?? ''

                        return (
                            normalTitle
                                .toLowerCase()
                                .includes(
                                    normalizedSearch
                                ) ||
                            arcaneTitle
                                .toLowerCase()
                                .includes(
                                    normalizedSearch
                                )
                        )
                    }

                    return (
                        entry.ability.title
                            .toLowerCase()
                            .includes(
                                normalizedSearch
                            ) ||
                        (
                            entry.ability
                                .arcane_title ??
                            ''
                        )
                            .toLowerCase()
                            .includes(
                                normalizedSearch
                            )
                    )
                }
            )
        }, [
            availableAbilities,
            search
        ])

    const handleAddAbility = async (
        abilityId: number
    ) => {
        if (!infos) {
            return
        }

        await addAbilityToCampaignCharacter(
            infos.campaign_character_id,
            {
                ability_id: abilityId
            }
        )

        setOpenAbilityId(null)

        await loadData()

        setModalAdded(true)
    }

    if (!infos) {
        return (
            <div className="campaign-page-loading">
                Carregando habilidades...
            </div>
        )
    }

    return (
        <div className="campaign-abilities-page">
            <header className="campaign-perks-header">
                <h1>
                    Habilidades disponíveis
                </h1>

                <p>
                    Faltam {missing}{' '}
                    habilidade(s)
                </p>
            </header>

            <input
                className="sheet-search-input"
                type="text"
                placeholder="Buscar habilidade..."
                value={search}
                onChange={event =>
                    setSearch(
                        event.target.value
                    )
                }
            />

            {availableAbilities.length === 0 && (
                <span className="empty-text">
                    Nenhuma habilidade disponível
                </span>
            )}

            {availableAbilities.length > 0 &&
                filteredAbilities.length ===
                    0 && (
                    <span className="empty-text">
                        Nenhuma habilidade encontrada
                    </span>
                )}

            <div className="sheet-abilities-list">
                {filteredAbilities.map(
                    entry => {
                        const resolvedElements =
                            entry.elements
                                .map(id =>
                                    elementsMap.get(
                                        id
                                    )
                                )
                                .filter(
                                    Boolean
                                ) as Element[]

                        return (
                            <AbilityCardSheet
                                key={
                                    entry.ability.id
                                }
                                entry={entry}
                                elements={
                                    resolvedElements
                                }
                                elementsMap={
                                    elementsMap
                                }
                                isOpen={
                                    openAbilityId ===
                                    entry.ability.id
                                }
                                onToggle={() =>
                                    setOpenAbilityId(
                                        openAbilityId ===
                                            entry
                                                .ability
                                                .id
                                            ? null
                                            : entry
                                                .ability
                                                .id
                                    )
                                }
                                canAdd={
                                    missing > 0
                                }
                                onAdd={
                                    handleAddAbility
                                }
                            />
                        )
                    }
                )}
            </div>

            {modalAdded ? (
                <CharacterProgressionModal
                    title="Habilidade adicionada"
                    message="A habilidade foi adicionada com sucesso ao personagem."
                    onConfirm={() =>
                        setModalAdded(false)
                    }
                />
            ) : (
                modalComplete && (
                    <CharacterProgressionModal
                        title="Habilidades completas"
                        message="Você já escolheu todas as habilidades disponíveis. Agora pode voltar para a ficha do personagem."
                        onConfirm={() =>
                            navigate(
                                `/campaign/${campaignId}/characters/${characterId}/sheet`
                            )
                        }
                    />
                )
            )}
        </div>
    )
}

export default CampaignCharacterAbilitiesPage
