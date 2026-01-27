import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchCampaignById } from '../campaigns.service'
import { giveCharacterXP } from '../characters.service'
import type { CampaignCharacter } from '../campaigns.types'

function MasterGiveXP() {
  const { id } = useParams()
  const campaignId = Number(id)

  const [characters, setCharacters] = useState<CampaignCharacter[]>([])
  const [loading, setLoading] = useState(true)

  const [values, setValues] = useState<Record<number, number>>({})
  const [processing, setProcessing] = useState<number | null>(null)

  const [baseXP, setBaseXP] = useState(0)
  const [allyPercent, setAllyPercent] = useState(0)
  const [bonusPercent, setBonusPercent] = useState(0)

  const sharedXP = Math.floor(baseXP * (allyPercent / 100))
  const bonusXP = Math.floor(baseXP + baseXP * (bonusPercent / 100))

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

  function handleXP(
    campaignCharacterId: number,
    operation: 'add' | 'remove'
  ) {
    const amount = values[campaignCharacterId]

    if (!amount || amount <= 0) return

    setProcessing(campaignCharacterId)

    giveCharacterXP({
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
      <h2 className="master-sheet-title">Dar XP</h2>

      {/* ===== CALCULADORAS ===== */}
      <div className="master-gold-row" style={{ marginBottom: 16 }}>
        <div className="master-gold-info">
          <strong>Calculadora de XP</strong>
        </div>

        <div className="master-gold-actions">
          <input
            type="number"
            placeholder="XP base"
            value={baseXP || ''}
            onChange={e => setBaseXP(Number(e.target.value))}
          />

          <input
            type="number"
            placeholder="% aliados"
            value={allyPercent || ''}
            onChange={e => setAllyPercent(Number(e.target.value))}
          />

          <span style={{ opacity: 0.7 }}>
            Aliados: {sharedXP}
          </span>

          <input
            type="number"
            placeholder="% bônus"
            value={bonusPercent || ''}
            onChange={e => setBonusPercent(Number(e.target.value))}
          />

          <span style={{ opacity: 0.7 }}>
            Final: {bonusXP}
          </span>
        </div>
      </div>

      {/* ===== LISTA DE PERSONAGENS ===== */}
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
                    handleXP(char.campaign_character_id, 'add')
                  }
                >
                  +
                </button>

                <button
                  disabled={processing === char.campaign_character_id}
                  onClick={() =>
                    handleXP(char.campaign_character_id, 'remove')
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

export default MasterGiveXP
