import type { ItemAbility } from '../items.types'

function ItemAbilities({ ability }: { ability: ItemAbility }) {
  return (
    <div className="item-ability-card">
      <h4 className="item-ability-title">{ability.title}</h4>

      <p className="item-ability-description">
        {ability.description}
      </p>

      <div className="item-ability-divider" />

      <div className="item-ability-meta">
        {ability.dice_formula && (
          <div>
            <span>Dados</span>
            <strong>{ability.dice_formula}</strong>
          </div>
        )}

        <div>
          <span>Dano base</span>
          <strong>{ability.base_damage}</strong>
        </div>

        <div>
          <span>Consumível</span>
          <strong>{ability.is_consumable ? 'Sim' : 'Não'}</strong>
        </div>

        {ability.max_uses !== null && (
          <div>
            <span>Usos máximos</span>
            <strong>{ability.max_uses}</strong>
          </div>
        )}
      </div>
    </div>
  )
}

export default ItemAbilities
