import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  fetchCharacterById,
  fetchRaceById,
  fetchOrderById
} from '../characters.service'
import { fetchMe } from '../users.service'
import type {
  CharacterFull,
  Ability,
  User
} from '../characters.types'

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
      <div className="character-main-card">
        <div className="character-header">
          <div>
            <h2>{character.character.name}</h2>
            <span className="character-owner">
              Criado por {character.owner}
            </span>
          </div>
        </div>

        <div className="character-description">
          {character.character.description}
        </div>
      </div>

      {/* META */}
      <div className="character-meta-card">
        <div>
          <span>Raça</span>
          <strong>{raceName ?? '—'}</strong>
        </div>

        <div>
          <span>Ordem</span>
          <strong>{orderName ?? '—'}</strong>
        </div>

        <div>
          <span>Modificador de mana</span>
          <strong>{character.character.mana_modifier.toUpperCase()}</strong>
        </div>
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
          onClick={() => navigate(`/character/${id}/edit`)}
        >
          Editar personagem
        </button>
      )}
    </div>
  )
}

export default CharacterPage
