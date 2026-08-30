import {
  useEffect,
  useMemo,
  useState
} from 'react'
import { useParams } from 'react-router-dom'
import { fetchCampaignById } from '../campaigns.service'
import { fetchMonsters } from '../monsters.service'
import {
  discoverElementAttackRelations,
  fetchCharacterElements,
  fetchMonsterElements
} from '../element.service'
import { useElementMap } from '../hooks/useElementMap'
import type {
  CampaignCharacter
} from '../campaigns.types'
import type {
  MonsterListItem
} from '../monsters.types'
import type {
  DiscoverAttackRelationsResult
} from '../elements.types'

type EntityFilter =
  | 'player'
  | 'monster'
  | ''

function DiscoverElementAttackRelations() {
  const { id } = useParams()

  const campaignId = Number(id)

  const { elementMap } =
    useElementMap()

  const [selectedElements, setSelectedElements] =
    useState<number[]>([])

  const [entityFilter, setEntityFilter] =
    useState<EntityFilter>('')

  const [selectedEntityId, setSelectedEntityId] =
    useState('')

  const [characters, setCharacters] =
    useState<CampaignCharacter[]>([])

  const [monsters, setMonsters] =
    useState<MonsterListItem[]>([])

  const [result, setResult] =
    useState<DiscoverAttackRelationsResult | null>(
      null
    )

  const [loading, setLoading] =
    useState(false)

  const [loadingEntities, setLoadingEntities] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {
    if (!entityFilter) {
      setSelectedEntityId('')
      return
    }

    setLoadingEntities(true)
    setSelectedEntityId('')

    if (entityFilter === 'player') {
      fetchCampaignById(campaignId)
        .then(res => {
          setCharacters(
            res.campaign.characters
          )
        })
        .finally(() => {
          setLoadingEntities(false)
        })

      return
    }

    fetchMonsters()
      .then(res => {
        setMonsters(res.monsters)
      })
      .finally(() => {
        setLoadingEntities(false)
      })
  }, [entityFilter, campaignId])

  useEffect(() => {
    if (selectedElements.length === 0) {
      setResult(null)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    discoverElementAttackRelations(
      selectedElements
    )
      .then(res => {
        setResult(res.relations)
      })
      .catch(() => {
        setResult(null)
        setError(
          'Erro ao calcular relações elementais.'
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }, [selectedElements])

  const selectedElementNames =
    useMemo(() => {
      return Array
        .from(elementMap.values())
        .filter(element =>
          selectedElements.includes(
            element.id
          )
        )
        .map(element => element.name)
        .join(', ')
    }, [
      elementMap,
      selectedElements
    ])

  function toggleElement(
    elementId: number
  ) {
    setSelectedEntityId('')

    setSelectedElements(current =>
      current.includes(elementId)
        ? current.filter(
            id => id !== elementId
          )
        : [
            ...current,
            elementId
          ]
    )
  }

  async function handleSelectEntity(
    value: string
  ) {
    setSelectedEntityId(value)
    setError(null)

    const entityId =
      Number(value)

    if (
      !entityId ||
      !entityFilter
    ) {
      setSelectedElements([])
      return
    }

    try {
      setLoadingEntities(true)

      if (entityFilter === 'player') {
        const response =
          await fetchCharacterElements(
            entityId
          )

        setSelectedElements(
          response.elements.map(
            element => element.id
          )
        )

        return
      }

      const response =
        await fetchMonsterElements(
          entityId
        )

      setSelectedElements(
        response.elements.map(
          element => element.id
        )
      )
    } catch {
      setSelectedElements([])

      setError(
        'Erro ao carregar elementos da criatura.'
      )
    } finally {
      setLoadingEntities(false)
    }
  }

  function handleEntityFilterChange(
    value: EntityFilter
  ) {
    setEntityFilter(value)
    setSelectedEntityId('')
    setSelectedElements([])
    setResult(null)
    setError(null)
  }

  const attack =
    result?.attack ?? null

  const defense =
    result?.defense ?? null

  return (
    <div className="master-sheet card">
      <div className="element-weakness-layout">
        <div className="element-column">
          <h3>
            Elementos da Criatura
          </h3>

          <div className="defense-selector-card">
            <label>
              Tipo de criatura
            </label>

            <select
              value={entityFilter}
              onChange={event =>
                handleEntityFilterChange(
                  event.target
                    .value as EntityFilter
                )
              }
            >
              <option value="">
                Seleção manual
              </option>

              <option value="player">
                Player
              </option>

              <option value="monster">
                Monstro
              </option>
            </select>

            {entityFilter && (
              <>
                <label>
                  {entityFilter ===
                  'player'
                    ? 'Selecionar player'
                    : 'Selecionar monstro'}
                </label>

                <select
                  value={
                    selectedEntityId
                  }
                  disabled={
                    loadingEntities
                  }
                  onChange={event =>
                    void handleSelectEntity(
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    {loadingEntities
                      ? 'Carregando...'
                      : 'Selecione...'}
                  </option>

                  {entityFilter ===
                    'player' &&
                    characters.map(
                      character => (
                        <option
                          key={
                            character
                              .campaign_character_id
                          }
                          value={
                            character
                              .campaign_character_id
                          }
                        >
                          {
                            character.name
                          }
                        </option>
                      )
                    )}

                  {entityFilter ===
                    'monster' &&
                    monsters.map(
                      monster => (
                        <option
                          key={
                            monster.id
                          }
                          value={
                            monster.id
                          }
                        >
                          {
                            monster.name
                          }
                        </option>
                      )
                    )}
                </select>
              </>
            )}

            {selectedElements.length >
              0 && (
              <p>
                Tipos selecionados:{' '}
                {selectedElementNames}
              </p>
            )}
          </div>

          {Array
            .from(
              elementMap.values()
            )
            .map(element => (
              <button
                key={element.id}
                className={`element-btn ${
                  selectedElements.includes(
                    element.id
                  )
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  toggleElement(
                    element.id
                  )
                }
              >
                {element.name}
              </button>
            ))}
        </div>

        <div className="element-result-panel">
          <h3>
            Relações Elementais
          </h3>

          {selectedElements.length ===
            0 && (
            <span className="element-hint">
              Selecione manualmente os elementos ou carregue um Player/Monstro.
            </span>
          )}

          {loading && (
            <span className="element-hint">
              Calculando…
            </span>
          )}

          {error && (
            <span className="element-error">
              {error}
            </span>
          )}

          {!loading &&
            !error &&
            attack &&
            defense && (
              <div className="element-relations-dashboard">
                <section className="element-relation-panel">
                  <h4 className="element-relation-title">
                    Defesa
                  </h4>

                  <div className="element-relation-group">
                    <div className="element-relation-group-title positive">
                      Recebe mais dano de
                    </div>

                    {defense
                      .strong_against_me
                      .length > 0 ? (
                      <div className="element-relation-grid">
                        {defense
                          .strong_against_me
                          .map(
                            element => (
                              <div
                                key={
                                  element.id
                                }
                                className="element-relation-card positive"
                              >
                                <div className="element-relation-card-header">
                                  <strong>
                                    {
                                      element.name
                                    }
                                  </strong>

                                  <span className="element-relation-card-multiplier">
                                    x
                                    {element.multiplier.toFixed(
                                      2
                                    )}
                                  </span>
                                </div>

                                <span className="element-relation-card-modifier positive">
                                  +
                                  {element.modifier.toFixed(
                                    2
                                  )}
                                </span>
                              </div>
                            )
                          )}
                      </div>
                    ) : (
                      <span className="element-relation-empty">
                        Nenhum elemento causa dano aumentado
                      </span>
                    )}
                  </div>

                  <div className="element-relation-group">
                    <div className="element-relation-group-title negative">
                      Recebe menos dano de
                    </div>

                    {defense
                      .weak_against_me
                      .length > 0 ? (
                      <div className="element-relation-grid">
                        {defense
                          .weak_against_me
                          .map(
                            element => (
                              <div
                                key={
                                  element.id
                                }
                                className="element-relation-card negative"
                              >
                                <div className="element-relation-card-header">
                                  <strong>
                                    {
                                      element.name
                                    }
                                  </strong>

                                  <span className="element-relation-card-multiplier">
                                    x
                                    {element.multiplier.toFixed(
                                      2
                                    )}
                                  </span>
                                </div>

                                <span className="element-relation-card-modifier negative">
                                  {element.modifier.toFixed(
                                    2
                                  )}
                                </span>
                              </div>
                            )
                          )}
                      </div>
                    ) : (
                      <span className="element-relation-empty">
                        Nenhum elemento causa dano reduzido
                      </span>
                    )}
                  </div>
                </section>

                <section className="element-relation-panel">
                  <h4 className="element-relation-title">
                    Ataque
                  </h4>

                  <div className="element-relation-group">
                    <div className="element-relation-group-title positive">
                      Causa mais dano em
                    </div>

                    {attack
                      .strong_against
                      .length > 0 ? (
                      <div className="element-relation-grid">
                        {attack
                          .strong_against
                          .map(
                            element => (
                              <div
                                key={
                                  element.id
                                }
                                className="element-relation-card positive"
                              >
                                <div className="element-relation-card-header">
                                  <strong>
                                    {
                                      element.name
                                    }
                                  </strong>

                                  <span className="element-relation-card-multiplier">
                                    x
                                    {element.multiplier.toFixed(
                                      2
                                    )}
                                  </span>
                                </div>

                                <span className="element-relation-card-modifier positive">
                                  +
                                  {element.modifier.toFixed(
                                    2
                                  )}
                                </span>
                              </div>
                            )
                          )}
                      </div>
                    ) : (
                      <span className="element-relation-empty">
                        Nenhum elemento recebe dano aumentado
                      </span>
                    )}
                  </div>

                  <div className="element-relation-group">
                    <div className="element-relation-group-title negative">
                      Causa menos dano em
                    </div>

                    {attack
                      .weak_against
                      .length > 0 ? (
                      <div className="element-relation-grid">
                        {attack
                          .weak_against
                          .map(
                            element => (
                              <div
                                key={
                                  element.id
                                }
                                className="element-relation-card negative"
                              >
                                <div className="element-relation-card-header">
                                  <strong>
                                    {
                                      element.name
                                    }
                                  </strong>

                                  <span className="element-relation-card-multiplier">
                                    x
                                    {element.multiplier.toFixed(
                                      2
                                    )}
                                  </span>
                                </div>

                                <span className="element-relation-card-modifier negative">
                                  {element.modifier.toFixed(
                                    2
                                  )}
                                </span>
                              </div>
                            )
                          )}
                      </div>
                    ) : (
                      <span className="element-relation-empty">
                        Nenhum elemento recebe dano reduzido
                      </span>
                    )}
                  </div>
                </section>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default DiscoverElementAttackRelations
