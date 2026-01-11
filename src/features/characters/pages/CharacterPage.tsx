import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import {
  fetchCharacterById,
  fetchRaceById,
  fetchOrderById
} from '../characters.service'

import { fetchMe } from '../users.service'

import type { CharacterFull } from '../characters.types'
import type { User } from '../users.types'

import AbilityCard from '../components/AbilityCard'
import '../characters.css'

function CharacterPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [character, setCharacter] = useState<CharacterFull | null>(null)
  const [raceName, setRaceName] = useState<string | null>(null)
  const [orderName, setOrderName] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [openAbilityId, setOpenAbilityId] = useState<number | null>(null)

  useEffect(() => {
    if (!id) return

    fetchCharacterById(Number(id)).then(res => {
      const data = res.character
      setCharacter(data)

      if (data.character.race_id) {
        fetchRaceById(data.character.race_id)
          .then(r => setRaceName(r.race.name))
      }

      if (data.character.order_id) {
        fetchOrderById(data.character.order_id)
          .then(o => setOrderName(o.order.name))
      }
    })

    fetchMe().then(res => setUser(res.user))
  }, [id])

  if (!character) return null

  const isOwner =
    user && user.id === character.character.created_by

  return (
    <div className="character-page-container">
      {/* BLOCO PRINCIPAL */}
      <div className="character-header-card parchment">
        <div className="character-header-title">
          <h2>{character.character.name}</h2>
          <span>Criado por {character.owner}</span>
        </div>

        <p className="character-description">
          {character.character.description}
        </p>
      </div>

      {/* META */}
      <div className="character-meta-grid">
        <div className="character-meta-card parchment">
          <img
            src={`/assets/images/races/${character.character.race_id}.jpg`}
            alt={raceName ?? ''}
          />
          <span>Raça</span>
          <strong>{raceName ?? '—'}</strong>
        </div>

        <div className="character-meta-card parchment">
          <img
            src={`/assets/images/orders/${character.character.order_id}.jpg`}
            alt={orderName ?? ''}
          />
          <span>Ordem</span>
          <strong>{orderName ?? '—'}</strong>
        </div>
      </div>


      {/* MODIFICADOR */}
      <div className="character-mana-card parchment">
        <span>Modificador de mana</span>
        <strong>{character.character.mana_modifier.toUpperCase()}</strong>
      </div>


      {/* HABILIDADES */}
      <div className="character-abilities">
        <h3>Habilidades</h3>

        {character.abilities.length === 0 && (
          <span className="empty-text">
            Nenhuma habilidade registrada
          </span>
        )}

        {character.abilities.map(ability => (
          <AbilityCard
            key={ability.id}
            ability={ability}
            isOpen={openAbilityId === ability.id}
            onToggle={() =>
              setOpenAbilityId(
                openAbilityId === ability.id ? null : ability.id
              )
            }
          />
        ))}
      </div>

      {/* AÇÃO DO DONO */}
      {isOwner && (
        <button
          className="character-owner-action"
          onClick={() => navigate(`/character/${id}/ability`)}
        >
          Adicionar Habilidade
        </button>
      )}
    </div>
  )
}

export default CharacterPage
