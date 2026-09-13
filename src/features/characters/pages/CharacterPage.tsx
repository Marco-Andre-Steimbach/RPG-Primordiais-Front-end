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
  fetchRaceById,
  fetchOrderById
} from '../characters.service'

import { fetchMe } from '../users.service'

import {
  fetchAllElements
} from '../../campaigns/campaigns.service'

import type {
  CharacterFull
} from '../characters.types'

import type {
  Element
} from '../../campaigns/campaigns.types'

import type {
  User
} from '../users.types'

import AbilityCardSheet from '../../campaigns/components/AbilityCardSheet'

import '../characters.css'
import '../../campaigns/campaigns.css'

function CharacterPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [
    character,
    setCharacter
  ] =
    useState<CharacterFull | null>(
      null
    )

  const [
    raceName,
    setRaceName
  ] =
    useState<string | null>(
      null
    )

  const [
    orderName,
    setOrderName
  ] =
    useState<string | null>(
      null
    )

  const [
    user,
    setUser
  ] =
    useState<User | null>(
      null
    )

  const [
    elements,
    setElements
  ] =
    useState<Element[]>([])

  const [
    openAbilityKey,
    setOpenAbilityKey
  ] =
    useState<string | null>(
      null
    )

  useEffect(() => {
    if (!id) {
      return
    }

    fetchCharacterById(
      Number(id)
    ).then(response => {
      const data =
        response.character

      setCharacter(data)

      if (
        data.character.race_id
      ) {
        fetchRaceById(
          data.character.race_id
        ).then(response =>
          setRaceName(
            response.race.name
          )
        )
      }

      if (
        data.character.order_id
      ) {
        fetchOrderById(
          data.character.order_id
        ).then(response =>
          setOrderName(
            response.order.name
          )
        )
      }
    })

    fetchMe()
      .then(response =>
        setUser(
          response.user
        )
      )

    fetchAllElements()
      .then(response =>
        setElements(
          response.elements
        )
      )
  }, [id])

  const elementsMap =
    useMemo(() => {
      const map =
        new Map<
          number,
          Element
        >()

      elements.forEach(
        element => {
          map.set(
            element.id,
            element
          )
        }
      )

      return map
    }, [elements])

  if (!character) {
    return null
  }

  const isOwner =
    user !== null &&
    user.id ===
      character
        .character
        .created_by

  return (
    <div className="character-page-container">
      <div className="character-header-card parchment">
        <div className="character-header-title">
          <h2>
            {
              character
                .character
                .name
            }
          </h2>

          <span>
            Criado por{' '}
            {character.owner}
          </span>
        </div>

        <p className="character-description">
          {
            character
              .character
              .description
          }
        </p>
      </div>

      <div className="character-meta-grid">
        <div className="character-meta-card parchment">
          {character.character.race_id && (
            <img
              src={
                `/assets/images/races/${
                  character
                    .character
                    .race_id
                }.jpg`
              }
              alt={
                raceName ?? ''
              }
            />
          )}

          <span>
            Raça
          </span>

          <strong>
            {raceName ?? '—'}
          </strong>
        </div>

        <div className="character-meta-card parchment">
          {character.character.order_id && (
            <img
              src={
                `/assets/images/orders/${
                  character
                    .character
                    .order_id
                }.jpg`
              }
              alt={
                orderName ?? ''
              }
            />
          )}

          <span>
            Ordem
          </span>

          <strong>
            {orderName ?? '—'}
          </strong>
        </div>
      </div>

      <div className="character-mana-card parchment">
        <span>
          Modificador de mana
        </span>

        <strong>
          {
            character
              .character
              .mana_modifier
              .toUpperCase()
          }
        </strong>
      </div>

      <div className="character-abilities">
        <h3>
          Habilidades
        </h3>

        {character.abilities.length ===
          0 && (
          <span className="empty-text">
            Nenhuma habilidade registrada
          </span>
        )}

        <div className="sheet-abilities-list">
          {character.abilities.map(
            entry => {
              const abilityKey =
                `${entry.schema}:${entry.ability.id}`

              const resolvedElements =
                entry.elements
                  .map(elementId =>
                    elementsMap.get(
                      elementId
                    )
                  )
                  .filter(
                    (
                      element
                    ): element is Element =>
                      element !==
                      undefined
                  )

              return (
                <AbilityCardSheet
                  key={
                    abilityKey
                  }
                  entry={
                    entry
                  }
                  elements={
                    resolvedElements
                  }
                  elementsMap={
                    elementsMap
                  }
                  isOpen={
                    openAbilityKey ===
                    abilityKey
                  }
                  onToggle={() =>
                    setOpenAbilityKey(
                      openAbilityKey ===
                        abilityKey
                        ? null
                        : abilityKey
                    )
                  }
                />
              )
            }
          )}
        </div>
      </div>

      {isOwner && (
        <button
          className="character-owner-action"
          onClick={() =>
            navigate(
              `/character/${id}/ability`
            )
          }
        >
          Adicionar Habilidade
        </button>
      )}
    </div>
  )
}

export default CharacterPage
