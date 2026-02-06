import { useState } from 'react'
import type { LupidaItem } from '../campaigns.types'
import ConfirmItemQuantityModal from './ConfirmItemQuantityModal'

type Props = {
  item: LupidaItem
  gold: number
  onBuy: (item: LupidaItem, quantity: number) => void
  canBuy: boolean
}

function LupidaItemCard({ item, gold, onBuy, canBuy }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className={`lupida-item-card ${!canBuy ? 'disabled' : ''}`}>
        <div className="lupida-item-info">
          <h4>{item.item_name}</h4>
          <p>{item.item_description}</p>

          <div className="lupida-item-meta">
            <span>Disponível: {item.quantity}</span>
            <span>Preço base: {item.value} ouro</span>
          </div>
        </div>

        <button
          className="lupida-buy-button"
          disabled={!canBuy}
          onClick={() => setOpen(true)}
        >
          Comprar
        </button>
      </div>

      {open && (
        <ConfirmItemQuantityModal
          item={item}
          gold={gold}
          onCancel={() => setOpen(false)}
          onConfirm={q => {
            onBuy(item, q)
            setOpen(false)
          }}
        />
      )}
    </>
  )
}

export default LupidaItemCard
