import { useState } from 'react'
import type { LupidaItem } from '../campaigns.types'
import ConfirmItemQuantityModal from './ConfirmItemQuantityModal'

type Props = {
  item: LupidaItem
  onBuy: (item: LupidaItem, quantity: number) => void
}

function LupidaItemCard({ item, onBuy }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="lupida-item-card">
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
          onClick={() => setOpen(true)}
        >
          Comprar
        </button>
      </div>

      {open && (
        <ConfirmItemQuantityModal
          item={item}
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
