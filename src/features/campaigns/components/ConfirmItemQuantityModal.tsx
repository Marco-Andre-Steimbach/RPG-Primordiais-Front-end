// ConfirmItemQuantityModal.tsx
import { useState } from 'react'
import type { LupidaItem } from '../campaigns.types'

type Props = {
  item: LupidaItem
  gold: number
  onCancel: () => void
  onConfirm: (quantity: number) => void
}

function ConfirmItemQuantityModal({
  item,
  gold,
  onCancel,
  onConfirm
}: Props) {
  const maxByStock = item.quantity
  const maxByGold = Math.floor(gold / item.value)
  const max = Math.max(0, Math.min(maxByStock, maxByGold))

  const [quantity, setQuantity] = useState(max > 0 ? 1 : 0)

  const totalCost = item.value * quantity
  const canBuy = quantity > 0 && totalCost <= gold

  return (
    <div className="confirm-modal-backdrop">
      <div className="confirm-modal">
        <h3>{item.item_name}</h3>
        <p>{item.item_description}</p>

        <div className="item-quantity-control">
          <button
            disabled={quantity <= 1}
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
          >
            -
          </button>

          <span>{quantity}</span>

          <button
            disabled={quantity >= max}
            onClick={() => setQuantity(q => Math.min(max, q + 1))}
          >
            +
          </button>
        </div>

        <div className="item-quantity-info">
          <span>Disponível: {maxByStock}</span>
          <strong>Total: {totalCost} ouro</strong>
        </div>

        {!canBuy && (
          <div className="item-quantity-warning">
            Ouro insuficiente
          </div>
        )}

        <div className="confirm-actions">
          <button
            className="confirm-cancel"
            onClick={onCancel}
          >
            Cancelar
          </button>

          <button
            className="confirm-buy"
            disabled={!canBuy}
            onClick={() => onConfirm(quantity)}
          >
            Comprar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmItemQuantityModal
