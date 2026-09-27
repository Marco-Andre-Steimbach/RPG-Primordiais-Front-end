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
    {
        value: '',
        label: 'Todos os atributos'
    },
    {
        value: 'str',
        label: 'Força'
    },
    {
        value: 'dex',
        label: 'Destreza'
    },
    {
        value: 'con',
        label: 'Constituição'
    },
    {
        value: 'int',
        label: 'Inteligência'
    },
    {
        value: 'wis',
        label: 'Sabedoria'
    },
    {
        value: 'cha',
        label: 'Carisma'
    },
    {
        value: 'hp_max',
        label: 'Vida máxima'
    },
    {
        value: 'mana_max',
        label: 'Mana máxima'
    },
    {
        value: 'sanity',
        label: 'Sanidade'
    },
    {
        value: 'speed',
        label: 'Velocidade'
    },
    {
        value: 'armor_class',
        label: 'Classe de Armadura'
    }
]

function normalizeAttributeName(
    attributeName: string
) {
    if (attributeName === 'intt') {
        return 'int'
    }

    return attributeName
}

function perkHasAttribute(
    perk: Perk,
    attributeName: string
) {
    return (
        perk.attributes ?? []
    ).some(
        attribute =>
            normalizeAttributeName(
                attribute.attribute_name
            ) === attributeName
    )
}

function CampaignCharacterPerksPage() {
    const {
        campaignId,
        characterId
    } = useParams()

    const navigate =
        useNavigate()

    const [
        character,
        setCharacter
    ] = useState<Character | null>(
        null
    )

    const [
        infos,
        setInfos
    ] = useState<CharacterSheetInfo | null>(
        null
    )

    const [
        ownedPerkIds,
        setOwnedPerkIds
    ] = useState<number[]>([])

    const [
        perkCatalog,
        setPerkCatalog
    ] = useState<AvailablePerk[]>([])

    const [
        attributeFilter,
        setAttributeFilter
    ] = useState('')

    const [
        modalOpen,
        setModalOpen
    ] = useState(false)

    const [
        addedModalOpen,
        setAddedModalOpen
    ] = useState(false)

    const [
        loading,
        setLoading
    ] = useState(true)

    const [
        loadingError,
        setLoadingError
    ] = useState<string | null>(
        null
    )

    const [
        addingPerkId,
        setAddingPerkId
    ] = useState<number | null>(
        null
    )

    const [
        addError,
        setAddError
    ] = useState<string | null>(
        null
    )

    useEffect(() => {
        if (
            !campaignId ||
            !characterId
        ) {
            setLoading(false)
            return
        }

        let cancelled = false

        const loadPage =
            async () => {
                setLoading(true)
                setLoadingError(null)

                try {
                    const characterRequest =
                        fetchCharacterById(
                            characterId
                        )

                    const infoRequest =
                        fetchCharacterSheetInfo(
                            campaignId,
                            characterId
                        )

                    const sheetRequest =
                        fetchCharacterSheet(
                            campaignId,
                            characterId
                        )

                    const characterResponse =
                        await characterRequest

                    const loadedCharacter =
                        characterResponse
                            .character
                            .character

                    const raceRequest =
                        fetchPerksByRace(
                            loadedCharacter.race_id
                        )

                    const orderRequest =
                        loadedCharacter.order_id
                            ? fetchPerksByOrder(
                                loadedCharacter.order_id
                            )
                            : Promise.resolve({
                                perks: []
                            })

                    const [
                        infoResponse,
                        sheetResponse,
                        raceResponse,
                        orderResponse
                    ] =
                        await Promise.all([
                            infoRequest,
                            sheetRequest,
                            raceRequest,
                            orderRequest
                        ])

                    if (cancelled) {
                        return
                    }

                    const racePerks:
                        AvailablePerk[] =
                        raceResponse.perks.map(
                            perk => ({
                                ...perk,
                                origin: 'race'
                            })
                        )

                    const orderPerks:
                        AvailablePerk[] =
                        orderResponse.perks.map(
                            perk => ({
                                ...perk,
                                origin: 'order'
                            })
                        )

                    setCharacter(
                        loadedCharacter
                    )

                    setInfos(
                        infoResponse.infos
                    )

                    setOwnedPerkIds(
                        sheetResponse
                            .sheet
                            .perks
                            .map(
                                perk =>
                                    perk.id
                            )
                    )

                    setPerkCatalog([
                        ...racePerks,
                        ...orderPerks
                    ])
                } catch {
                    if (cancelled) {
                        return
                    }

                    setLoadingError(
                        'Não foi possível carregar os perks do personagem.'
                    )
                } finally {
                    if (!cancelled) {
                        setLoading(false)
                    }
                }
            }

        loadPage()

        return () => {
            cancelled = true
        }
    }, [
        campaignId,
        characterId
    ])

    useEffect(() => {
        if (!infos) {
            return
        }

        setModalOpen(
            infos.perks >= infos.level
        )
    }, [infos])

    const perkNameById =
        useMemo(() => {
            const names =
                new Map<number, string>()

            perkCatalog.forEach(
                perk => {
                    if (
                        !names.has(perk.id)
                    ) {
                        names.set(
                            perk.id,
                            perk.name
                        )
                    }
                }
            )

            return names
        }, [perkCatalog])

    const availablePerks =
        useMemo(() => {
            if (!infos) {
                return []
            }

            return perkCatalog.filter(
                perk =>
                    perk.required_level <=
                        infos.level &&
                    !ownedPerkIds.includes(
                        perk.id
                    )
            )
        }, [
            perkCatalog,
            infos,
            ownedPerkIds
        ])

    const getMissingRequirementIds = (
        perk: Perk
    ) => {
        return (
            perk.required_perk_ids ?? []
        ).filter(
            requiredPerkId =>
                !ownedPerkIds.includes(
                    requiredPerkId
                )
        )
    }

    const getMissingRequirementNames = (
        perk: Perk
    ) => {
        return getMissingRequirementIds(
            perk
        ).map(
            requiredPerkId =>
                perkNameById.get(
                    requiredPerkId
                ) ??
                `Perk #${requiredPerkId}`
        )
    }

    const sortedPerks =
        useMemo(() => {
            return [
                ...availablePerks
            ].sort(
                (
                    firstPerk,
                    secondPerk
                ) => {
                    const firstRequirementsMet =
                        getMissingRequirementIds(
                            firstPerk
                        ).length === 0

                    const secondRequirementsMet =
                        getMissingRequirementIds(
                            secondPerk
                        ).length === 0

                    if (
                        firstRequirementsMet !==
                        secondRequirementsMet
                    ) {
                        return firstRequirementsMet
                            ? -1
                            : 1
                    }

                    if (attributeFilter) {
                        const firstHasAttribute =
                            perkHasAttribute(
                                firstPerk,
                                attributeFilter
                            )

                        const secondHasAttribute =
                            perkHasAttribute(
                                secondPerk,
                                attributeFilter
                            )

                        if (
                            firstHasAttribute !==
                            secondHasAttribute
                        ) {
                            return firstHasAttribute
                                ? -1
                                : 1
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

                    if (
                        firstPerk.origin !==
                        secondPerk.origin
                    ) {
                        return firstPerk.origin ===
                            'race'
                            ? -1
                            : 1
                    }

                    return firstPerk.name.localeCompare(
                        secondPerk.name,
                        'pt-BR'
                    )
                }
            )
        }, [
            availablePerks,
            attributeFilter,
            ownedPerkIds
        ])

    const handleAddPerk =
        async (
            perkId: number
        ) => {
            if (
                addingPerkId !== null ||
                !infos
            ) {
                return
            }

            setAddingPerkId(
                perkId
            )

            setAddError(null)

            try {
                await addPerkToCampaignCharacter(
                    infos.campaign_character_id,
                    {
                        perk_id: perkId
                    }
                )

                setOwnedPerkIds(
                    current => {
                        if (
                            current.includes(
                                perkId
                            )
                        ) {
                            return current
                        }

                        return [
                            ...current,
                            perkId
                        ]
                    }
                )

                setInfos(
                    current => {
                        if (!current) {
                            return current
                        }

                        return {
                            ...current,
                            perks:
                                current.perks + 1
                        }
                    }
                )

                setAddedModalOpen(
                    true
                )
            } catch {
                setAddError(
                    'Não foi possível adicionar o perk. Tente novamente.'
                )
            } finally {
                setAddingPerkId(
                    null
                )
            }
        }

    if (loading) {
        return (
            <div className="campaign-perks-loading">
                <span className="campaign-loading-spinner" />

                <strong>
                    Carregando perks
                </strong>

                <span>
                    Preparando os perks disponíveis do personagem...
                </span>
            </div>
        )
    }

    if (loadingError) {
        return (
            <div className="campaign-perks-page">
                <div className="campaign-perks-error">
                    {loadingError}
                </div>
            </div>
        )
    }

    if (
        !campaignId ||
        !characterId ||
        !character ||
        !infos
    ) {
        return (
            <div className="campaign-page-loading">
                Não foi possível carregar os perks.
            </div>
        )
    }

    const missing =
        Math.max(
            infos.level - infos.perks,
            0
        )

    return (
        <div className="campaign-perks-page">
            <header className="campaign-perks-header">
                <div>
                    <h1>
                        Perks disponíveis
                    </h1>

                    <p>
                        Faltam {missing} perk(s)
                    </p>
                </div>
            </header>

            {addError && (
                <div className="campaign-perks-error">
                    {addError}
                </div>
            )}

            <div className="campaign-perks-filters">
                <div className="campaign-perks-filter">
                    <label htmlFor="perk-attribute-filter">
                        Priorizar atributo
                    </label>

                    <select
                        id="perk-attribute-filter"
                        value={attributeFilter}
                        disabled={
                            addingPerkId !==
                            null
                        }
                        onChange={event =>
                            setAttributeFilter(
                                event.target.value
                            )
                        }
                    >
                        {attributeOptions.map(
                            option => (
                                <option
                                    key={
                                        option.value ||
                                        'all'
                                    }
                                    value={
                                        option.value
                                    }
                                >
                                    {
                                        option.label
                                    }
                                </option>
                            )
                        )}
                    </select>
                </div>
            </div>

            {sortedPerks.map(
                perk => {
                    const missingRequirements =
                        getMissingRequirementNames(
                            perk
                        )

                    const requirementsMet =
                        missingRequirements.length ===
                        0

                    const isAdding =
                        addingPerkId ===
                        perk.id

                    const canAdd =
                        addingPerkId === null &&
                        missing > 0 &&
                        infos.level >=
                            perk.required_level &&
                        requirementsMet

                    let disabledReason:
                        string | null =
                        null

                    if (isAdding) {
                        disabledReason =
                            'Adicionando perk...'
                    } else if (
                        addingPerkId !== null
                    ) {
                        disabledReason =
                            'Aguarde o perk atual ser adicionado.'
                    } else if (
                        !requirementsMet
                    ) {
                        disabledReason =
                            `Requer: ${missingRequirements.join(
                                ', '
                            )}`
                    } else if (
                        infos.level <
                        perk.required_level
                    ) {
                        disabledReason =
                            `Requer nível ${perk.required_level}`
                    } else if (
                        missing <= 0
                    ) {
                        disabledReason =
                            'Todos os espaços de perk já foram utilizados.'
                    }

                    return (
                        <CampaignCharacterPerkCard
                            key={`${perk.origin}-${perk.id}`}
                            perk={perk}
                            canAdd={canAdd}
                            disabledReason={
                                disabledReason
                            }
                            isAdding={
                                isAdding
                            }
                            onAdd={
                                handleAddPerk
                            }
                        />
                    )
                }
            )}

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
                        setAddedModalOpen(
                            false
                        )
                    }
                />
            )}
        </div>
    )
}

export default CampaignCharacterPerksPage
