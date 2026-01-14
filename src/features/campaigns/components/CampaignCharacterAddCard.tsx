import { useState } from 'react'
import type { MyCharacter } from '../characterMe.types'

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
                onClick={() => setOpen(!open)}
            >
                <span className="campaign-character-name">
                    {character.name}
                </span>

            </div>

            {open && (
                <div className="campaign-character-expanded">
                    <button
                        className="campaign-character-button"
                        onClick={onView}
                    >
                        Visualizar personagem
                    </button>

                    <button
                        className="campaign-character-button primary"
                        onClick={onAdd}
                    >
                        Adicionar à campanha
                    </button>
                </div>
            )}
        </>
    )
}

export default CampaignCharacterAddCard
