import { useState } from 'react'
import type { MyCharacter } from '../campaigns.types'

type Props = {
    character: MyCharacter
    onAdd: () => void
    onView: () => void
}

function CampaignCharacterAddCard({
    character,
    onAdd,
    onView
}: Props) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <div
                className="campaign-character-card"
                onClick={() => setOpen(prev => !prev)}
            >
                <span className="campaign-character-name">
                    {character.name}
                </span>
            </div>

            {open && (
                <div className="campaign-character-expanded">
                    <button
                        className="campaign-character-button"
                        onClick={e => {
                            e.stopPropagation()
                            onView()
                        }}
                    >
                        Visualizar personagem
                    </button>

                    <button
                        className="campaign-character-button primary"
                        onClick={e => {
                            e.stopPropagation()
                            onAdd()
                        }}
                    >
                        Adicionar à campanha
                    </button>
                </div>
            )}
        </>
    )
}

export default CampaignCharacterAddCard
