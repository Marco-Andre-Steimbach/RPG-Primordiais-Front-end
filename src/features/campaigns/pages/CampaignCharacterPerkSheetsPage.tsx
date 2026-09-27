import {
    useEffect,
    useState
} from 'react'

import {
    useNavigate,
    useParams
} from 'react-router-dom'

import {
    fetchCampaignCharacterPerkSheets
} from '../campaigns.service'

import type {
    CharacterPerkSheet
} from '../campaigns.types'

import PerkDetailsCard from '../components/PerkDetailsCard'

import '../campaigns.css'

function getSheetTypeLabel(
    sheetType: string | null
) {
    switch (sheetType) {
        case 'companion':
            return 'Companheiro'

        case 'transformation':
            return 'Transformação'

        default:
            return sheetType ?? 'Ficha especial'
    }
}

function getDurationUnitLabel(
    unit: string | null
) {
    switch (unit) {
        case 'turn':
            return 'turno(s)'

        case 'round':
            return 'rodada(s)'

        case 'combat':
            return 'combate'

        default:
            return ''
    }
}

function getHpLabel(
    sheet: CharacterPerkSheet
) {
    if (
        !sheet.resolved.hp_runtime &&
        sheet.resolved.hp !== null
    ) {
        return String(
            sheet.resolved.hp
        )
    }

    if (
        sheet.config.hp_source ===
        'owner_current'
    ) {
        const numerator =
            sheet.config
                .owner_hp_numerator

        const denominator =
            sheet.config
                .owner_hp_denominator

        if (denominator === 1) {
            return `${numerator}× Vida Atual`
        }

        return `${numerator}/${denominator} da Vida Atual`
    }

    return 'Calculada em combate'
}

function getManaLabel(
    sheet: CharacterPerkSheet
) {
    if (
        sheet.config.mana_mode ===
        'owner'
    ) {
        return 'Reserva do dono'
    }

    return String(
        sheet.resolved.mana
    )
}

function getArmorClassLabel(
    sheet: CharacterPerkSheet
) {
    if (
        sheet.config
            .armor_class_mode === 'add'
    ) {
        const bonus =
            sheet.config.armor_class

        return `CA do dono +${bonus}`
    }

    return String(
        sheet.resolved.armor_class
    )
}

function getSpeedLabel(
    sheet: CharacterPerkSheet
) {
    if (
        sheet.config.speed_mode ===
        'owner'
    ) {
        return 'Do dono'
    }

    return String(
        sheet.resolved.speed
    )
}

function getActionsLabel(
    sheet: CharacterPerkSheet
) {
    if (
        sheet.resolved
            .actions_from_owner
    ) {
        return 'Do dono'
    }

    return String(
        sheet.resolved
            .actions_per_turn ?? 0
    )
}

function getInitiativeLabel(
    sheet: CharacterPerkSheet
) {
    if (
        sheet.resolved
            .initiative_from_owner
    ) {
        return 'Do dono'
    }

    return (
        sheet.resolved
            .initiative_rule ??
        'Não definida'
    )
}

function CampaignCharacterPerkSheetsPage() {
    const {
        campaignId,
        characterId
    } = useParams()

    const navigate =
        useNavigate()

    const [
        perkSheets,
        setPerkSheets
    ] = useState<CharacterPerkSheet[]>(
        []
    )

    const [
        loading,
        setLoading
    ] = useState(true)

    const [
        error,
        setError
    ] = useState<string | null>(
        null
    )

    const [
        expandedSheetId,
        setExpandedSheetId
    ] = useState<number | null>(
        null
    )

    const [
        expandedPerkIds,
        setExpandedPerkIds
    ] = useState<number[]>([])

    useEffect(() => {
        if (
            !campaignId ||
            !characterId
        ) {
            setError(
                'Campanha ou personagem inválido.'
            )

            setLoading(false)

            return
        }

        setLoading(true)
        setError(null)

        fetchCampaignCharacterPerkSheets(
            campaignId,
            characterId
        )
            .then(response => {
                const sheets =
                    response.perk_sheets ??
                    []

                setPerkSheets(
                    sheets
                )

                setExpandedSheetId(
                    sheets.length > 0
                        ? sheets[0].perk_id
                        : null
                )
            })
            .catch(() => {
                setError(
                    'Não foi possível carregar as fichas especiais.'
                )
            })
            .finally(() => {
                setLoading(false)
            })
    }, [
        campaignId,
        characterId
    ])

    const toggleSheet =
        (perkId: number) => {
            setExpandedSheetId(
                current =>
                    current === perkId
                        ? null
                        : perkId
            )

            setExpandedPerkIds(
                []
            )
        }

    const togglePerk =
        (perkId: number) => {
            setExpandedPerkIds(
                current => {
                    if (
                        current.includes(
                            perkId
                        )
                    ) {
                        return current.filter(
                            id =>
                                id !==
                                perkId
                        )
                    }

                    return [
                        ...current,
                        perkId
                    ]
                }
            )
        }

    if (loading) {
        return (
            <div className="campaign-perks-loading">
                <span className="campaign-loading-spinner" />

                <strong>
                    Carregando fichas especiais
                </strong>

                <span>
                    Preparando os dados do personagem...
                </span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="campaign-perk-sheets-page">
                <button
                    type="button"
                    className="campaign-perk-sheets-back"
                    onClick={() =>
                        navigate(
                            `/campaign/${campaignId}/characters/${characterId}/sheet`
                        )
                    }
                >
                    Voltar para ficha
                </button>

                <div className="campaign-perk-sheets-error">
                    {error}
                </div>
            </div>
        )
    }

    return (
        <div className="campaign-perk-sheets-page">
            <header className="campaign-perk-sheets-header">
                <div>
                    <span className="campaign-perk-sheets-eyebrow">
                        Personagem
                    </span>

                    <h1>
                        Fichas Especiais
                    </h1>

                    <p>
                        Companheiros, transformações e outras
                        fichas derivadas dos perks do personagem.
                    </p>
                </div>

                <button
                    type="button"
                    className="campaign-perk-sheets-back"
                    onClick={() =>
                        navigate(
                            `/campaign/${campaignId}/characters/${characterId}/sheet`
                        )
                    }
                >
                    Voltar para ficha
                </button>
            </header>

            {perkSheets.length === 0 && (
                <div className="campaign-perk-sheets-empty">
                    Este personagem não possui nenhuma ficha especial.
                </div>
            )}

            <div className="campaign-perk-sheets-list">
                {perkSheets.map(
                    perkSheet => {
                        const expanded =
                            expandedSheetId ===
                            perkSheet.perk_id

                        const hasDuration =
                            perkSheet.resolved
                                .duration_formula !==
                            null

                        return (
                            <article
                                key={
                                    perkSheet.perk_id
                                }
                                className={`campaign-perk-sheet-card ${
                                    expanded
                                        ? 'campaign-perk-sheet-card--expanded'
                                        : ''
                                }`}
                            >
                                <button
                                    type="button"
                                    className="campaign-perk-sheet-card__toggle"
                                    onClick={() =>
                                        toggleSheet(
                                            perkSheet.perk_id
                                        )
                                    }
                                    aria-expanded={
                                        expanded
                                    }
                                >
                                    <div className="campaign-perk-sheet-card__heading">
                                        <span className="campaign-perk-sheet-card__type">
                                            {getSheetTypeLabel(
                                                perkSheet.sheet_type
                                            )}
                                        </span>

                                        <strong>
                                            {perkSheet.name ??
                                                `Ficha ${perkSheet.perk_id}`}
                                        </strong>

                                        <span className="campaign-perk-sheet-card__summary">
                                            {perkSheet.perks.length}{' '}
                                            perk(s) vinculados
                                        </span>
                                    </div>

                                    <span
                                        className={`campaign-perk-sheet-card__arrow ${
                                            expanded
                                                ? 'campaign-perk-sheet-card__arrow--open'
                                                : ''
                                        }`}
                                    >
                                        ▼
                                    </span>
                                </button>

                                {expanded && (
                                    <div className="campaign-perk-sheet-card__body">
                                        {perkSheet.description && (
                                            <div className="campaign-perk-sheet-card__description">
                                                {
                                                    perkSheet.description
                                                }
                                            </div>
                                        )}

                                        <div className="campaign-perk-sheet-stats">
                                            <div className="campaign-perk-sheet-stat">
                                                <span>
                                                    Vida
                                                </span>

                                                <strong>
                                                    {getHpLabel(
                                                        perkSheet
                                                    )}
                                                </strong>
                                            </div>

                                            <div className="campaign-perk-sheet-stat">
                                                <span>
                                                    Mana
                                                </span>

                                                <strong>
                                                    {getManaLabel(
                                                        perkSheet
                                                    )}
                                                </strong>
                                            </div>

                                            <div className="campaign-perk-sheet-stat">
                                                <span>
                                                    Classe de Armadura
                                                </span>

                                                <strong>
                                                    {getArmorClassLabel(
                                                        perkSheet
                                                    )}
                                                </strong>
                                            </div>

                                            <div className="campaign-perk-sheet-stat">
                                                <span>
                                                    Velocidade
                                                </span>

                                                <strong>
                                                    {getSpeedLabel(
                                                        perkSheet
                                                    )}
                                                </strong>
                                            </div>

                                            <div className="campaign-perk-sheet-stat">
                                                <span>
                                                    Ações por turno
                                                </span>

                                                <strong>
                                                    {getActionsLabel(
                                                        perkSheet
                                                    )}
                                                </strong>
                                            </div>

                                            <div className="campaign-perk-sheet-stat">
                                                <span>
                                                    Iniciativa
                                                </span>

                                                <strong>
                                                    {getInitiativeLabel(
                                                        perkSheet
                                                    )}
                                                </strong>
                                            </div>

                                            {hasDuration && (
                                                <div className="campaign-perk-sheet-stat">
                                                    <span>
                                                        Duração
                                                    </span>

                                                    <strong>
                                                        {
                                                            perkSheet
                                                                .resolved
                                                                .duration_formula
                                                        }{' '}
                                                        {getDurationUnitLabel(
                                                            perkSheet
                                                                .resolved
                                                                .duration_unit
                                                        )}
                                                    </strong>
                                                </div>
                                            )}

                                            <div className="campaign-perk-sheet-stat">
                                                <span>
                                                    Custo de Mana
                                                </span>

                                                <strong>
                                                    {perkSheet
                                                        .resolved
                                                        .mana_cost_multiplier ===
                                                    0
                                                        ? 'Sem custo'
                                                        : `${perkSheet.resolved.mana_cost_multiplier}×`}
                                                </strong>
                                            </div>
                                        </div>

                                        <section className="campaign-perk-sheet-perks">
                                            <div className="campaign-perk-sheet-perks__header">
                                                <div>
                                                    <span>
                                                        Perks da ficha
                                                    </span>

                                                    <strong>
                                                        {
                                                            perkSheet
                                                                .perks
                                                                .length
                                                        }
                                                    </strong>
                                                </div>
                                            </div>

                                            {perkSheet.perks.length ===
                                                0 && (
                                                <div className="campaign-perk-sheet-perks__empty">
                                                    Nenhum perk adicional adquirido para esta ficha.
                                                </div>
                                            )}

                                            {perkSheet.perks.map(
                                                perk => {
                                                    const perkExpanded =
                                                        expandedPerkIds.includes(
                                                            perk.id
                                                        )

                                                    return (
                                                        <div
                                                            key={
                                                                perk.id
                                                            }
                                                            className={`campaign-perk-sheet-perk ${
                                                                perkExpanded
                                                                    ? 'campaign-perk-sheet-perk--expanded'
                                                                    : ''
                                                            }`}
                                                        >
                                                            <button
                                                                type="button"
                                                                className="campaign-perk-sheet-perk__header"
                                                                onClick={() =>
                                                                    togglePerk(
                                                                        perk.id
                                                                    )
                                                                }
                                                                aria-expanded={
                                                                    perkExpanded
                                                                }
                                                            >
                                                                <div>
                                                                    <strong>
                                                                        {
                                                                            perk.name
                                                                        }
                                                                    </strong>

                                                                    <span>
                                                                        {perk.type ===
                                                                        'active'
                                                                            ? 'Ativo'
                                                                            : 'Passivo'}
                                                                    </span>
                                                                </div>

                                                                <span>
                                                                    {perkExpanded
                                                                        ? '▲'
                                                                        : '▼'}
                                                                </span>
                                                            </button>

                                                            {perkExpanded && (
                                                                <div className="campaign-perk-sheet-perk__content">
                                                                    <PerkDetailsCard
                                                                        perk={
                                                                            perk
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                }
                                            )}
                                        </section>
                                    </div>
                                )}
                            </article>
                        )
                    }
                )}
            </div>
        </div>
    )
}

export default CampaignCharacterPerkSheetsPage
