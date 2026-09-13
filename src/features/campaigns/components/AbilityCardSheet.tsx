import { useEffect, useState } from 'react'
import type {
    AbilityNewForm,
    AbilityRuleNode,
    CampaignCharacterAbility,
    Element
} from '../campaigns.types'

type Props = {
    entry: CampaignCharacterAbility
    elements: Element[]
    elementsMap: Map<number, Element>
    isOpen: boolean
    onToggle: () => void
    canAdd?: boolean
    onAdd?: (abilityId: number) => void
}

function getActivationLabel(
    value: AbilityNewForm['activation_type']
) {
    switch (value) {
        case 'action':
            return 'Ação'
        case 'free_action':
            return 'Ação Livre'
        case 'reaction':
            return 'Reação'
        case 'automatic':
            return 'Automática'
        case 'custom':
            return 'Especial'
        default:
            return value
    }
}

function getRuleTypeLabel(
    value: AbilityNewForm['rule_type']
) {
    switch (value) {
        case 'direct':
            return 'Direta'
        case 'improvement':
            return 'Teste de Melhoria'
        case 'ability_test':
            return 'Teste de Habilidade'
        case 'attack':
            return 'Ataque'
        case 'opposed_test':
            return 'Teste Oposto'
        case 'random_table':
            return 'Tabela Aleatória'
        case 'custom':
            return 'Especial'
        default:
            return value
    }
}

function getNodeTitle(node: AbilityRuleNode) {
    if (node.title) {
        return node.title
    }

    switch (node.node_type) {
        case 'critical_success':
            return 'Acerto Crítico'
        case 'success':
            return 'Acerto'
        case 'failure':
            return 'Falha'
        case 'critical_failure':
            return 'Falha Crítica'
        case 'random_table':
            return 'Tabela Aleatória'
        case 'random_result':
            return 'Resultado'
        case 'condition':
            return 'Condição'
        case 'effect':
            return 'Efeito'
        case 'attack':
            return 'Ataque'
        case 'summon':
            return 'Invocação'
        case 'test':
            return 'Teste'
        case 'section':
            return 'Regra'
        default:
            return 'Regra'
    }
}

function resolveElements(
    elementTypeIds: number[] | undefined,
    elementsMap: Map<number, Element>
) {
    if (!elementTypeIds?.length) {
        return []
    }

    return elementTypeIds
        .map(id => elementsMap.get(id))
        .filter(
            (element): element is Element =>
                element !== undefined
        )
}

function ElementTags({
    elementTypeIds,
    elementsMap
}: {
    elementTypeIds: number[] | undefined
    elementsMap: Map<number, Element>
}) {
    const resolvedElements = resolveElements(
        elementTypeIds,
        elementsMap
    )

    if (resolvedElements.length === 0) {
        return null
    }

    return (
        <div className="sheet-ability-v2__elements">
            {resolvedElements.map(element => (
                <span
                    key={element.id}
                    className="sheet-ability-v2__element-tag"
                    data-element-id={element.id}
                >
                    {element.name}
                </span>
            ))}
        </div>
    )
}

function AbilityActions({
    abilityId,
    canAdd,
    onAdd
}: {
    abilityId: number
    canAdd?: boolean
    onAdd?: (abilityId: number) => void
}) {
    if (!onAdd) {
        return null
    }

    return (
        <div className="sheet-ability-v2__actions">
            {canAdd === false ? (
                <span className="campaign-ability-locked">
                    Limite de habilidades atingido
                </span>
            ) : (
                <button
                    type="button"
                    className="campaign-ability-button primary"
                    onClick={() => onAdd(abilityId)}
                >
                    Adicionar habilidade
                </button>
            )}
        </div>
    )
}

function AbilityRuleDetails({
    node,
    elementsMap,
    nested = false
}: {
    node: AbilityRuleNode
    elementsMap: Map<number, Element>
    nested?: boolean
}) {
    const hasStats =
        node.roll_formula ||
        node.actor_roll_formula ||
        node.defender_roll_formula ||
        node.damage_formula ||
        node.duration_formula ||
        node.range_formula ||
        node.area_formula ||
        node.action_change_formula ||
        node.movement_formula ||
        node.roll_min !== null ||
        node.roll_max !== null

    return (
        <div
            className={
                nested
                    ? 'sheet-ability-v2__rule sheet-ability-v2__rule--nested'
                    : 'sheet-ability-v2__rule'
            }
        >
            <div className="sheet-ability-v2__rule-header">
                <span className="sheet-ability-v2__rule-type">
                    {getNodeTitle(node)}
                </span>
            </div>

            {node.description && (
                <p className="sheet-ability-v2__rule-description">
                    {node.description}
                </p>
            )}

            <ElementTags
                elementTypeIds={node.element_type_ids}
                elementsMap={elementsMap}
            />

            {hasStats && (
                <div className="sheet-ability-v2__rule-stats">
                    {node.roll_formula && (
                        <div>
                            <span>Rolagem</span>
                            <strong>
                                {node.roll_formula}
                            </strong>
                        </div>
                    )}

                    {node.actor_roll_formula && (
                        <div>
                            <span>Teste</span>
                            <strong>
                                {node.actor_roll_formula}
                            </strong>
                        </div>
                    )}

                    {node.defender_roll_formula && (
                        <div>
                            <span>Contra</span>
                            <strong>
                                {node.defender_roll_formula}
                            </strong>
                        </div>
                    )}

                    {node.damage_formula && (
                        <div>
                            <span>Dano</span>
                            <strong>
                                {node.damage_formula}
                            </strong>
                        </div>
                    )}

                    {node.duration_formula && (
                        <div>
                            <span>Duração</span>
                            <strong>
                                {node.duration_formula}
                            </strong>
                        </div>
                    )}

                    {node.range_formula && (
                        <div>
                            <span>Alcance</span>
                            <strong>
                                {node.range_formula}
                            </strong>
                        </div>
                    )}

                    {node.area_formula && (
                        <div>
                            <span>Área</span>
                            <strong>
                                {node.area_formula}
                            </strong>
                        </div>
                    )}

                    {node.action_change_formula && (
                        <div>
                            <span>Ações</span>
                            <strong>
                                {node.action_change_formula}
                            </strong>
                        </div>
                    )}

                    {node.movement_formula && (
                        <div>
                            <span>Movimento</span>
                            <strong>
                                {node.movement_formula}
                            </strong>
                        </div>
                    )}

                    {node.roll_min !== null &&
                        node.roll_max !== null && (
                            <div>
                                <span>Resultado</span>
                                <strong>
                                    {node.roll_min ===
                                    node.roll_max
                                        ? node.roll_min
                                        : `${node.roll_min}–${node.roll_max}`}
                                </strong>
                            </div>
                        )}
                </div>
            )}

            {(node.children ?? []).length > 0 && (
                <div className="sheet-ability-v2__rule-children">
                    {(node.children ?? []).map(child => (
                        <AbilityRuleDetails
                            key={child.id}
                            node={child}
                            elementsMap={elementsMap}
                            nested
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

function AbilityFormPanel({
    form,
    variant,
    elementsMap
}: {
    form: AbilityNewForm
    variant: 'normal' | 'arcane'
    elementsMap: Map<number, Element>
}) {
    const [isExpanded, setIsExpanded] =
        useState(variant === 'normal')

    const [selectedRuleId, setSelectedRuleId] =
        useState<string>('')

    const selectedRule = form.rules.find(
        rule =>
            rule.id ===
            Number(selectedRuleId)
    )

    return (
        <section
            className={`sheet-ability-v2__form sheet-ability-v2__form--${variant}`}
        >
            <button
                type="button"
                className="sheet-ability-v2__form-toggle"
                onClick={() =>
                    setIsExpanded(current => !current)
                }
            >
                <div className="sheet-ability-v2__form-toggle-main">
                    <span className="sheet-ability-v2__form-label">
                        {variant === 'arcane'
                            ? 'Queima Arcana'
                            : 'Habilidade'}
                    </span>

                    <h4 className="sheet-ability-v2__form-title">
                        {form.title}
                    </h4>
                </div>

                <div className="sheet-ability-v2__form-toggle-meta">
                    <span className="sheet-ability-v2__form-mana">
                        Mana {form.mana_cost}
                    </span>

                    <span
                        className={
                            isExpanded
                                ? 'sheet-ability-v2__form-arrow sheet-ability-v2__form-arrow--open'
                                : 'sheet-ability-v2__form-arrow'
                        }
                    >
                        ▼
                    </span>
                </div>
            </button>

            {isExpanded && (
                <div className="sheet-ability-v2__form-body">
                    <p className="sheet-ability-v2__description">
                        {form.description}
                    </p>

                    <ElementTags
                        elementTypeIds={form.element_type_ids}
                        elementsMap={elementsMap}
                    />

                    <div className="sheet-ability-v2__meta">
                        <div>
                            <span>Ativação</span>

                            <strong>
                                {getActivationLabel(
                                    form.activation_type
                                )}
                            </strong>
                        </div>

                        {form.action_cost > 0 && (
                            <div>
                                <span>Custo</span>

                                <strong>
                                    {form.action_cost}{' '}
                                    {form.action_cost === 1
                                        ? 'ação'
                                        : 'ações'}
                                </strong>
                            </div>
                        )}

                        {form.range_formula && (
                            <div>
                                <span>Alcance</span>

                                <strong>
                                    {form.range_formula}
                                </strong>
                            </div>
                        )}

                        {form.area_formula && (
                            <div>
                                <span>Área</span>

                                <strong>
                                    {form.area_formula}
                                </strong>
                            </div>
                        )}

                        {form.uses_per_turn !== null && (
                            <div>
                                <span>Usos/turno</span>

                                <strong>
                                    {form.uses_per_turn}
                                </strong>
                            </div>
                        )}

                        {form.uses_per_combat !== null && (
                            <div>
                                <span>Usos/combate</span>

                                <strong>
                                    {form.uses_per_combat}
                                </strong>
                            </div>
                        )}

                        <div>
                            <span>Regra</span>

                            <strong>
                                {getRuleTypeLabel(
                                    form.rule_type
                                )}
                            </strong>
                        </div>
                    </div>

                    {form.rule_description && (
                        <div className="sheet-ability-v2__test-summary">
                            <p>
                                {form.rule_description}
                            </p>

                            {(form.actor_roll_formula ||
                                form.defender_roll_formula) && (
                                <div className="sheet-ability-v2__test-formula">
                                    {form.actor_roll_formula && (
                                        <span>
                                            <small>
                                                Teste
                                            </small>

                                            <strong>
                                                {
                                                    form.actor_roll_formula
                                                }
                                            </strong>
                                        </span>
                                    )}

                                    {form.defender_roll_formula && (
                                        <span>
                                            <small>
                                                Contra
                                            </small>

                                            <strong>
                                                {
                                                    form.defender_roll_formula
                                                }
                                            </strong>
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {form.rules.length > 0 && (
                        <div className="sheet-ability-v2__rule-picker">
                            <label>
                                Consultar regra
                            </label>

                            <select
                                value={selectedRuleId}
                                onChange={event =>
                                    setSelectedRuleId(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="">
                                    Selecione um resultado...
                                </option>

                                {form.rules.map(rule => (
                                    <option
                                        key={rule.id}
                                        value={rule.id}
                                    >
                                        {getNodeTitle(rule)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {selectedRule && (
                        <div className="sheet-ability-v2__selected-rule">
                            <AbilityRuleDetails
                                node={selectedRule}
                                elementsMap={elementsMap}
                            />
                        </div>
                    )}
                </div>
            )}
        </section>
    )
}

function NewAbilityCard({
    entry,
    elementsMap,
    isOpen,
    onToggle,
    canAdd,
    onAdd
}: {
    entry: Extract<
        CampaignCharacterAbility,
        { schema: 'new' }
    >
    elementsMap: Map<number, Element>
    isOpen: boolean
    onToggle: () => void
    canAdd?: boolean
    onAdd?: (abilityId: number) => void
}) {
    const normalForm =
        entry.ability.forms.normal

    const arcaneForm =
        entry.ability.forms.arcane

    if (!normalForm) {
        return null
    }

    return (
        <div className="sheet-ability-v2">
            <button
                type="button"
                className="sheet-ability-v2__button"
                onClick={onToggle}
            >
                <div className="sheet-ability-v2__button-main">
                    <strong>
                        {normalForm.title}
                    </strong>

                    <span>
                        {getRuleTypeLabel(
                            normalForm.rule_type
                        )}
                    </span>
                </div>

                <div className="sheet-ability-v2__button-meta">
                    <span>
                        Mana {normalForm.mana_cost}
                    </span>

                    <span
                        className={
                            isOpen
                                ? 'sheet-ability-v2__arrow sheet-ability-v2__arrow--open'
                                : 'sheet-ability-v2__arrow'
                        }
                    >
                        ▼
                    </span>
                </div>
            </button>

            {isOpen && (
                <div className="sheet-ability-v2__content">
                    <AbilityFormPanel
                        form={normalForm}
                        variant="normal"
                        elementsMap={elementsMap}
                    />

                    {arcaneForm && (
                        <AbilityFormPanel
                            form={arcaneForm}
                            variant="arcane"
                            elementsMap={elementsMap}
                        />
                    )}

                    <AbilityActions
                        abilityId={entry.ability.id}
                        canAdd={canAdd}
                        onAdd={onAdd}
                    />
                </div>
            )}
        </div>
    )
}

function AbilityCardSheet({
    entry,
    elements,
    elementsMap,
    isOpen,
    onToggle,
    canAdd,
    onAdd
}: Props) {
    const [
        showFullDescription,
        setShowFullDescription
    ] = useState(false)

    const [
        showArcane,
        setShowArcane
    ] = useState(false)

    useEffect(() => {
        if (!isOpen) {
            setShowFullDescription(false)
            setShowArcane(false)
        }
    }, [isOpen])

    if (entry.schema === 'new') {
        return (
            <NewAbilityCard
                entry={entry}
                elementsMap={elementsMap}
                isOpen={isOpen}
                onToggle={onToggle}
                canAdd={canAdd}
                onAdd={onAdd}
            />
        )
    }

    const ability = entry.ability

    const hasDamage =
        ability.dice_formula &&
        ability.dice_formula !== '0'

    return (
        <div className="ability-wrapper">
            <button
                type="button"
                className="campaign-ability-card"
                onClick={onToggle}
            >
                <span className="campaign-ability-name">
                    {ability.title}
                </span>

                <span className="campaign-ability-cost">
                    Mana {ability.mana_cost}
                </span>
            </button>

            {isOpen && (
                <div className="campaign-ability-expanded">
                    <div className="ability-stats">
                        <div className="ability-stat">
                            <span>
                                Mana
                            </span>

                            <strong>
                                {ability.mana_cost}
                            </strong>
                        </div>

                        {hasDamage && (
                            <div className="ability-stat">
                                <span>
                                    Dano
                                </span>

                                <strong>
                                    {ability.dice_formula}

                                    {ability.base_damage > 0 &&
                                        ` + ${ability.base_damage}`}

                                    {ability.bonus_damage > 0 &&
                                        ` + ${ability.bonus_damage}`}
                                </strong>
                            </div>
                        )}

                        {ability.range > 0 && (
                            <div className="ability-stat">
                                <span>
                                    Alcance
                                </span>

                                <strong>
                                    {ability.range}{' '}
                                    casas
                                </strong>
                            </div>
                        )}

                        {ability.arcane_mana_cost !==
                            null &&
                            ability.arcane_mana_cost >
                                0 && (
                                <div className="ability-stat">
                                    <span>
                                        Mana Arcana
                                    </span>

                                    <strong>
                                        {
                                            ability.arcane_mana_cost
                                        }
                                    </strong>
                                </div>
                            )}

                        {ability.bonus_speed > 0 && (
                            <div className="ability-stat">
                                <span>
                                    Velocidade
                                </span>

                                <strong>
                                    +{ability.bonus_speed}
                                </strong>
                            </div>
                        )}
                    </div>

                    {elements.length > 0 && (
                        <div className="ability-elements">
                            {elements.map(element => (
                                <span
                                    key={element.id}
                                    className="item-element-tag"
                                >
                                    {element.name}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="ability-divider" />

                    <div className="ability-description-container">
                        <p
                            className={`ability-description ${
                                showFullDescription
                                    ? 'expanded'
                                    : 'collapsed'
                            }`}
                        >
                            {ability.description}
                        </p>

                        <button
                            type="button"
                            className="ability-description-toggle"
                            onClick={() =>
                                setShowFullDescription(
                                    current =>
                                        !current
                                )
                            }
                        >
                            {showFullDescription
                                ? 'Mostrar menos'
                                : 'Ler descrição completa'}
                        </button>
                    </div>

                    {ability.arcane_title && (
                        <>
                            <div className="ability-divider" />

                            <button
                                type="button"
                                className="ability-arcane-toggle"
                                onClick={() =>
                                    setShowArcane(
                                        current =>
                                            !current
                                    )
                                }
                            >
                                <span>
                                    Queima Arcana
                                </span>

                                <strong>
                                    {showArcane
                                        ? '−'
                                        : '+'}
                                </strong>
                            </button>

                            {showArcane && (
                                <div className="ability-arcane">
                                    <strong>
                                        {
                                            ability.arcane_title
                                        }
                                    </strong>

                                    <p>
                                        {
                                            ability.arcane_description
                                        }
                                    </p>
                                </div>
                            )}
                        </>
                    )}

                    <AbilityActions
                        abilityId={entry.ability.id}
                        canAdd={canAdd}
                        onAdd={onAdd}
                    />
                </div>
            )}
        </div>
    )
}

export default AbilityCardSheet
