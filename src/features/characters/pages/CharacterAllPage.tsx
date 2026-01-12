import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchAllCharacters } from '../characters.service'
import type { Character } from '../characters.types'

import CharactersFilter from '../components/CharactersFilter'
import '../characters.css'

function CharacterAllPage() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [nameFilter, setNameFilter] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchAllCharacters().then(res => setCharacters(res.characters))
  }, [])

  const filteredCharacters = useMemo(() => {
    return characters.filter(c =>
      nameFilter.length === 0 ||
      c.name.toLowerCase().includes(nameFilter.toLowerCase())
    )
  }, [characters, nameFilter])

  return (
    <div className="characters-container">
      <CharactersFilter onNameChange={setNameFilter} />

      <div className="characters-all-container">
        {filteredCharacters.map(character => (
          <div
            key={character.id}
            className="character-card-small"
            onClick={() => navigate(`/characters/${character.id}`)}
          >
            <span>{character.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CharacterAllPage
