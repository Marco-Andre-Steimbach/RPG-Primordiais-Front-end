import { useState } from 'react'
import type { LupidaItem } from '../campaigns.types'

type Props = {
  item: LupidaItem
  onCancel: () => void
  onConfirm: (quantity: number) => void
}

function ConfirmItemQuantityModal({
  item,
  onCancel,
  onConfirm
}: Props) {
  const [quantity, setQuantity] = useState(1)

  const max = item.quantity
  const totalCost = item.value * quantity

  return (
    <div className="confirm-modal-backdrop">
      <div className="confirm-modal">
        <h3>{item.item_name}</h3>
        <p>{item.item_description}</p>

        <div className="item-quantity-control">
          <button
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
          >
            -
          </button>

          <span>{quantity}</span>

          <button
            onClick={() => setQuantity(q => Math.min(max, q + 1))}
          >
            +
          </button>
        </div>

        <div className="item-quantity-info">
          <span>Disponível: {max}</span>
          <strong>Total: {totalCost} ouro</strong>
        </div>

        <div className="confirm-actions">
          <button className="confirm-cancel" onClick={onCancel}>
            Cancelar
          </button>

          <button
            className="confirm-buy"
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
