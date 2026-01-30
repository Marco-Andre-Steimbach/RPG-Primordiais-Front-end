import type { ArmorListItem } from '../armors.types'

type Props = {
  armor: ArmorListItem
  expanded: boolean
  onToggle: () => void
  onGive: () => void
  onBuy: () => void
}

function MasterGiveArmorCard({
  armor,
  expanded,
  onToggle,
  onGive,
  onBuy
}: Props) {
  return (
    <div className="master-item-card">
      <div
        className="master-item-header"
        onClick={onToggle}
        role="button"
        tabIndex={0}
      >
        <strong>{armor.item_name}</strong>
        <span className="master-item-slot">{armor.slot_name}</span>
      </div>

      {expanded && (
        <div
          className="master-item-body"
          onClick={e => e.stopPropagation()}
        >
          <p className="master-item-description">
            {armor.item_description}
          </p>

          <div className="master-item-meta">
            <span>Classe de Armadura: +{armor.armor_class_bonus}</span>
            <span>Força mínima: {armor.min_strength_required}</span>
            <span>Penalidade de velocidade: -{armor.speed_penalty}</span>
          </div>

          <div className="master-item-footer">
            <div className="master-item-actions">
              <button
                className="master-item-btn give"
                onClick={onGive}
              >
                Dar
              </button>

              <button
                className="master-item-btn buy"
                onClick={onBuy}
              >
                Comprar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MasterGiveArmorCard
