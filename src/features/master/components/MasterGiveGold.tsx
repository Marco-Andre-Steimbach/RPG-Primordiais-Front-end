import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchCampaignById } from '../campaigns.service'
import { giveCharacterGold } from '../characters.service'
import type { CampaignCharacter } from '../campaigns.types'

function MasterGiveGold() {
  const { id } = useParams()
  const campaignId = Number(id)

  const [characters, setCharacters] = useState<CampaignCharacter[]>([])
  const [loading, setLoading] = useState(true)

  const [values, setValues] = useState<Record<number, number>>({})
  const [processing, setProcessing] = useState<number | null>(null)

  useEffect(() => {
    setLoading(true)

    fetchCampaignById(campaignId)
      .then(res => {
        setCharacters(res.campaign.characters)
      })
      .finally(() => setLoading(false))
  }, [campaignId])

  function handleChange(
    campaignCharacterId: number,
    value: number
  ) {
    setValues(v => ({
      ...v,
      [campaignCharacterId]: value
    }))
  }

  function handleGold(
    campaignCharacterId: number,
    operation: 'add' | 'remove'
  ) {
    const amount = values[campaignCharacterId]

    if (!amount || amount <= 0) return

    setProcessing(campaignCharacterId)

    giveCharacterGold({
      campaign_character_id: campaignCharacterId,
      amount,
      operation
    }).finally(() => {
      setProcessing(null)
      handleChange(campaignCharacterId, 0)
    })
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
      <h2 className="master-sheet-title">Dar Ouro</h2>

      {characters.length === 0 ? (
        <div className="master-empty">
          Nenhum personagem na campanha.
        </div>
      ) : (
        <div className="master-gold-list">
          {characters.map(char => (
            <div
              key={char.campaign_character_id}
              className="master-gold-row"
            >
              <div className="master-gold-info">
                <strong>{char.name}</strong>
                <span className="master-gold-player">
                  {char.controlled_by}
                </span>
              </div>

              <div className="master-gold-actions">
                <input
                  type="number"
                  min={0}
                  value={values[char.campaign_character_id] ?? ''}
                  onChange={e =>
                    handleChange(
                      char.campaign_character_id,
                      Number(e.target.value)
                    )
                  }
                />

                <button
                  disabled={processing === char.campaign_character_id}
                  onClick={() =>
                    handleGold(char.campaign_character_id, 'add')
                  }
                >
                  +
                </button>

                <button
                  disabled={processing === char.campaign_character_id}
                  onClick={() =>
                    handleGold(char.campaign_character_id, 'remove')
                  }
                >
                  -
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default MasterGiveGold
