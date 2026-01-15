import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { fetchMyCharacters } from '../campaigns.service'
import type { MyCharacter } from '../campaigns.types'

import CampaignCharacterAddCard from '../components/CampaignCharacterAddCard'
import CampaignCharacterAddModal from '../components/CampaignCharacterAddModal'

import '../campaigns.css'

function CampaignCharacterAddPage() {
    const navigate = useNavigate()

    const [characters, setCharacters] = useState<MyCharacter[]>([])
    const [selectedCharacter, setSelectedCharacter] =
        useState<MyCharacter | null>(null)

    useEffect(() => {
        fetchMyCharacters()
            .then(res => setCharacters(res.characters))
    }, [])

    return (
        <div className="campaign-add-character-page">
            <header className="campaign-perks-header">
                <h1>Adicionar personagem</h1>
                <p>Escolha um personagem para entrar na campanha</p>
            </header>

            {characters.length === 0 && (
                <div className="campaign-characters-placeholder">
                    Você ainda não possui personagens disponíveis.
                </div>
            )}

            {characters.map(character => (
                <CampaignCharacterAddCard
                    key={character.id}
                    character={character}
                    onAdd={() => setSelectedCharacter(character)}
                    onView={() =>
                        navigate(`/characters/${character.id}`)
                    }
                />
            ))}

            {selectedCharacter && (
                <CampaignCharacterAddModal
                    character={selectedCharacter}
                    onClose={() => setSelectedCharacter(null)}
                />
            )}
        </div>
    )
}

export default CampaignCharacterAddPage
