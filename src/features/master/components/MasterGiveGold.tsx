import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchCampaignById } from '../campaigns.service'
import { giveCharacterGold } from '../characters.service'
import type { CampaignCharacter } from '../campaigns.types'

function parseInteger(value: string | undefined): number {
  if (!value) {
    return 0
  }

  const digits = value.replace(/\D/g, '')

  if (!digits) {
    return 0
  }

  return Number.parseInt(digits, 10)
}

function formatInteger(value: number): string {
  if (!value) {
    return ''
  }

  return value.toLocaleString('pt-BR')
}

function normalizeIntegerInput(value: string): string {
  return formatInteger(
    parseInteger(value)
  )
}

function MasterGiveGold() {
  const { id } = useParams()
  const campaignId = Number(id)

  const [characters, setCharacters] =
    useState<CampaignCharacter[]>([])

  const [loading, setLoading] =
    useState(true)

  const [values, setValues] =
    useState<Record<number, string>>({})

  const [multipliers, setMultipliers] =
    useState<Record<number, number>>({})

  const [processing, setProcessing] =
    useState<number | null>(null)

  const [bulkProcessing, setBulkProcessing] =
    useState(false)

  const [sharedValue, setSharedValue] =
    useState('')

  const [message, setMessage] =
    useState<string | null>(null)

  useEffect(() => {
    setLoading(true)

    fetchCampaignById(campaignId)
      .then(res => {
        setCharacters(
          res.campaign.characters
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }, [campaignId])

  const preparedTotal = useMemo(() => {
    return characters.reduce(
      (total, character) => {
        const id =
          character.campaign_character_id

        const base =
          parseInteger(values[id])

        const multiplier =
          multipliers[id] ?? 1

        return (
          total +
          base * multiplier
        )
      },
      0
    )
  }, [
    characters,
    values,
    multipliers
  ])

  function handleChange(
    campaignCharacterId: number,
    rawValue: string
  ) {
    setValues(current => ({
      ...current,
      [campaignCharacterId]:
        normalizeIntegerInput(rawValue)
    }))
  }

  function handleMultiplierChange(
    campaignCharacterId: number,
    value: number
  ) {
    const multiplier =
      Math.max(
        1,
        Math.floor(value || 1)
      )

    setMultipliers(current => ({
      ...current,
      [campaignCharacterId]:
        multiplier
    }))
  }

  function handleDivide() {
    const total =
      parseInteger(sharedValue)

    if (
      total <= 0 ||
      characters.length === 0
    ) {
      return
    }

    const base =
      Math.floor(
        total / characters.length
      )

    const remainder =
      total % characters.length

    const distributedValues:
      Record<number, string> = {}

    characters.forEach(
      (character, index) => {
        const amount =
          base +
          (
            index < remainder
              ? 1
              : 0
          )

        distributedValues[
          character.campaign_character_id
        ] = formatInteger(amount)
      }
    )

    setValues(distributedValues)

    setMessage(
      `${formatInteger(total)} de ouro dividido entre ${characters.length} personagens.`
    )
  }

  async function handleGold(
    campaignCharacterId: number,
    operation: 'add' | 'remove'
  ) {
    const baseAmount =
      parseInteger(
        values[campaignCharacterId]
      )

    if (baseAmount <= 0) {
      return
    }

    const multiplier =
      multipliers[
        campaignCharacterId
      ] ?? 1

    const amount =
      operation === 'add'
        ? baseAmount * multiplier
        : baseAmount

    setProcessing(
      campaignCharacterId
    )

    setMessage(null)

    try {
      await giveCharacterGold({
        campaign_character_id:
          campaignCharacterId,
        amount,
        operation
      })

      setValues(current => ({
        ...current,
        [campaignCharacterId]: ''
      }))
    } catch {
      setMessage(
        'Erro ao alterar ouro.'
      )
    } finally {
      setProcessing(null)
    }
  }

  async function handleBulkGive() {
    const prepared = characters
      .map(character => {
        const campaignCharacterId =
          character.campaign_character_id

        const baseAmount =
          parseInteger(
            values[
              campaignCharacterId
            ]
          )

        const multiplier =
          multipliers[
            campaignCharacterId
          ] ?? 1

        return {
          campaignCharacterId,
          amount:
            baseAmount *
            multiplier
        }
      })
      .filter(item =>
        item.amount > 0
      )

    if (prepared.length === 0) {
      return
    }

    setBulkProcessing(true)
    setMessage(null)

    const results =
      await Promise.allSettled(
        prepared.map(item =>
          giveCharacterGold({
            campaign_character_id:
              item.campaignCharacterId,
            amount: item.amount,
            operation: 'add'
          })
        )
      )

    const successIds: number[] = []
    let failures = 0

    results.forEach(
      (result, index) => {
        if (
          result.status ===
          'fulfilled'
        ) {
          successIds.push(
            prepared[index]
              .campaignCharacterId
          )
        } else {
          failures++
        }
      }
    )

    setValues(current => {
      const next = {
        ...current
      }

      successIds.forEach(id => {
        next[id] = ''
      })

      return next
    })

    if (failures === 0) {
      setMessage(
        `Ouro distribuído para ${successIds.length} personagens com sucesso.`
      )

      setSharedValue('')
    } else {
      setMessage(
        `${successIds.length} atualizados e ${failures} falharam. Os valores que falharam foram mantidos.`
      )
    }

    setBulkProcessing(false)
  }

  if (loading) {
    return (
      <section className="master-sheet card">
        <div className="master-sheet-loading">
          Carregando personagens...
        </div>
      </section>
    )
  }

  return (
    <section className="master-sheet card">
      <h2 className="master-sheet-title">
        Dar Ouro
      </h2>

      {characters.length > 0 && (
        <div className="master-resource-distribution">
          <div className="master-resource-distribution-info">
            <strong>
              Distribuição de Ouro
            </strong>

            <span>
              Informe o ouro total recebido pelo grupo.
            </span>
          </div>

          <div className="master-resource-distribution-controls">
            <div className="master-resource-shared-input">
              <span>Ouro dividido</span>

              <input
                type="text"
                inputMode="numeric"
                placeholder="Ex: 1.434"
                value={sharedValue}
                onChange={event =>
                  setSharedValue(
                    normalizeIntegerInput(
                      event.target.value
                    )
                  )
                }
              />
            </div>

            <button
              type="button"
              className="master-resource-divide-btn"
              disabled={
                parseInteger(
                  sharedValue
                ) <= 0
              }
              onClick={
                handleDivide
              }
            >
              Dividir por{' '}
              {characters.length}
            </button>

            <div className="master-resource-total">
              <span>
                Total com bônus
              </span>

              <strong>
                {preparedTotal.toLocaleString(
                  'pt-BR'
                )}
              </strong>
            </div>

            <button
              type="button"
              className="master-resource-distribute-btn"
              disabled={
                bulkProcessing ||
                preparedTotal <= 0
              }
              onClick={() =>
                void handleBulkGive()
              }
            >
              {bulkProcessing
                ? 'Distribuindo...'
                : 'Distribuir Ouro'}
            </button>
          </div>
        </div>
      )}

      {message && (
        <div className="master-resource-message">
          {message}
        </div>
      )}

      {characters.length === 0 ? (
        <div className="master-empty">
          Nenhum personagem na campanha.
        </div>
      ) : (
        <div className="master-gold-list">
          {characters.map(char => {
            const characterId =
              char.campaign_character_id

            const baseValue =
              parseInteger(
                values[characterId]
              )

            const multiplier =
              multipliers[
                characterId
              ] ?? 1

            const finalValue =
              baseValue *
              multiplier

            return (
              <div
                key={characterId}
                className="master-gold-row"
              >
                <div className="master-gold-info">
                  <strong>
                    {char.name}
                  </strong>

                  <span className="master-gold-player">
                    {char.controlled_by}
                  </span>
                </div>

                <div className="master-gold-actions master-resource-row-actions">
                  <div className="master-resource-value-box">
                    <span>Ouro base</span>

                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      value={
                        values[
                          characterId
                        ] ?? ''
                      }
                      onChange={event =>
                        handleChange(
                          characterId,
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="master-resource-multiplier">
                    <span>Bônus</span>

                    <div>
                      <span>x</span>

                      <input
                        type="number"
                        min={1}
                        step={1}
                        value={
                          multiplier
                        }
                        onChange={event =>
                          handleMultiplierChange(
                            characterId,
                            Number(
                              event.target
                                .value
                            )
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="master-resource-final">
                    <span>Final</span>

                    <strong>
                      {finalValue.toLocaleString(
                        'pt-BR'
                      )}
                    </strong>
                  </div>

                  <button
                    disabled={
                      processing ===
                        characterId ||
                      bulkProcessing
                    }
                    onClick={() =>
                      void handleGold(
                        characterId,
                        'add'
                      )
                    }
                  >
                    +
                  </button>

                  <button
                    disabled={
                      processing ===
                        characterId ||
                      bulkProcessing
                    }
                    onClick={() =>
                      void handleGold(
                        characterId,
                        'remove'
                      )
                    }
                  >
                    -
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default MasterGiveGold
