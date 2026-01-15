import { useState } from 'react'
import type {
    CampaignCharacter,
    LevelUpAttribute
} from '../campaigns.types'
import { levelUpCampaignCharacter } from '../campaigns.service'

type Props = {
    character: CampaignCharacter
    onClose: () => void
}

const ATTRIBUTES: {
    key: LevelUpAttribute
    label: string
}[] = [
    { key: 'str', label: 'Força' },
    { key: 'dex', label: 'Destreza' },
    { key: 'con', label: 'Constituição' },
    { key: 'intt', label: 'Inteligência' },
    { key: 'wis', label: 'Sabedoria' },
    { key: 'cha', label: 'Carisma' }
]

function CampaignCharacterLevelUpModal({
    character,
    onClose
}: Props) {
    const [selected, setSelected] =
        useState<LevelUpAttribute | null>(null)

    const [loading, setLoading] = useState(false)

    async function handleConfirm() {
        if (!selected || loading) return

        try {
            setLoading(true)

            await levelUpCampaignCharacter({
                campaign_character_id: character.campaign_character_id,
                attribute: selected
            })

            onClose()
        } catch (err) {
            console.error('Erro ao dar level-up', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="progression-modal-backdrop">
            <div className="progression-modal">
                <h3>Level-up</h3>

                <p className="modal-hint">
                    Escolha um atributo para receber +1
                </p>

                <div className="levelup-options">
                    {ATTRIBUTES.map(attr => (
                        <button
                            key={attr.key}
                            className={`levelup-option ${
                                selected === attr.key ? 'selected' : ''
                            }`}
                            onClick={() => setSelected(attr.key)}
                        >
                            {attr.label}
                        </button>
                    ))}
                </div>

                <button
                    className="campaign-character-button primary"
                    disabled={!selected || loading}
                    onClick={handleConfirm}
                >
                    {loading ? 'Aplicando...' : 'Confirmar level-up'}
                </button>

                <button
                    className="campaign-character-button"
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancelar
                </button>
            </div>
        </div>
    )
}

export default CampaignCharacterLevelUpModal
