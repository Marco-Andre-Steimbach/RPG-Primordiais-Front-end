import type { Weapon } from '../weapons.types'

type Props = {
  weapon: Weapon
  expanded: boolean
  onToggle: () => void
  onGive: () => void
  onBuy: () => void
}

function MasterGiveWeaponCard({
  weapon,
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
        <strong>{weapon.item_name}</strong>
      </div>

      {expanded && (
        <div
          className="master-item-body"
          onClick={e => e.stopPropagation()}
        >
          <p className="master-item-description">
            {weapon.item_description}
          </p>

          <div className="master-item-meta">
            <span>
              Dano: {weapon.dice_formula} + {weapon.base_damage}
            </span>
            <span>Tipo: {weapon.damage_type}</span>
            <span>Alcance: {weapon.range}</span>
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

export default MasterGiveWeaponCard
