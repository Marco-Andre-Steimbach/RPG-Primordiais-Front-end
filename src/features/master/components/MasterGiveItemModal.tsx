import { useEffect, useState } from 'react'
import type { Item } from '../items.types'
import type { CampaignCharacter } from '../campaigns.types'
import { fetchCampaignCharacterInfos } from '../campaigns.service'
import { giveCharacterGold } from '../characters.service'
import { giveItemToCharacter } from '../campaigns.service'

type Props = {
  open: boolean
  item: Item
  action: 'give' | 'buy'
  campaignId: number
  characters: CampaignCharacter[]
  onClose: () => void
}

function MasterGiveItemModal({
  open,
  item,
  action,
  campaignId,
  characters,
  onClose
}: Props) {
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  const [goldMap, setGoldMap] = useState<Record<number, number>>({})

  if (!open) return null

  const totalCost = item.value * quantity

  useEffect(() => {
    if (action !== 'buy') return

    characters.forEach(char => {
      fetchCampaignCharacterInfos(campaignId, char.character_id)
        .then(res => {
          setGoldMap(v => ({
            ...v,
            [char.character_id]: res.infos.gold
          }))
        })
    })
  }, [action, campaignId, characters])

  async function handleSelect(char: CampaignCharacter) {
    if (quantity <= 0) {
      setError('Quantidade inválida.')
      return
    }

    setError(null)
    setLoadingId(char.character_id)

    try {
      if (action === 'buy') {
        const gold = goldMap[char.character_id] ?? 0

        if (gold < totalCost) {
          setError(
            `${char.name} não possui ouro suficiente (${gold}/${totalCost}).`
          )
          return
        }

        const res = await fetchCampaignCharacterInfos(
          campaignId,
          char.character_id
        )

        await giveCharacterGold({
          campaign_character_id: res.infos.campaign_character_id,
          amount: totalCost,
          operation: 'remove'
        })
      }

      await giveItemToCharacter(
        char.campaign_character_id,
        {
          item_id: item.id,
          quantity
        }
      )

      onClose()
      setQuantity(1)
    } catch {
      setError('Erro ao processar ação.')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="master-modal-backdrop">
      <div className="master-modal">
        <h3 className="master-modal-title">
          {action === 'give' ? 'Dar item' : 'Comprar item'}
        </h3>

        <p className="master-modal-sub">
          {item.name} — Valor unitário: {item.value}
        </p>

        {/* ===== QUANTIDADE ===== */}
        <div className="master-modal-quantity">
          <label>Quantidade</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={e => setQuantity(Number(e.target.value))}
          />

          {action === 'buy' && (
            <span>Total: {totalCost} de ouro</span>
          )}
        </div>

        {error && <div className="master-modal-error">{error}</div>}

        <div className="master-modal-list">
          {characters.map(char => {
            const gold = goldMap[char.character_id]
            const canBuy = gold === undefined || gold >= totalCost

            return (
              <button
                key={char.campaign_character_id}
                className="master-modal-item"
                disabled={
                  loadingId === char.character_id ||
                  (action === 'buy' && !canBuy)
                }
                onClick={() => handleSelect(char)}
              >
                <strong>{char.name}</strong>
                <span>{char.controlled_by}</span>

                {action === 'buy' && (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      opacity: canBuy ? 0.7 : 1,
                      color: canBuy ? 'inherit' : '#e74c3c'
                    }}
                  >
                    Ouro: {gold ?? '...'}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <button
          className="master-modal-close"
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

export default MasterGiveItemModal
