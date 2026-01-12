import type { Ability } from '../characters.types'

type Props = {
  ability: Ability
  isOpen: boolean
  onToggle: () => void
}

function AbilityCard({ ability, isOpen, onToggle }: Props) {
  return (
    <div className="ability-wrapper">
      <div className="ability-card-small" onClick={onToggle}>
        <span>{ability.title}</span>
      </div>

      {isOpen && (
        <div className="ability-card-expanded parchment">
          <p className="ability-description">
            {ability.description}
          </p>

          {ability.arcane_title && (
            <div className="ability-arcane">
              <strong>{ability.arcane_title}</strong>
              <p>{ability.arcane_description}</p>
            </div>
          )}

          <div className="ability-stats">
            <div>
              <span>Dano: </span>
              <strong>
                {ability.dice_formula} + {ability.base_damage}
              </strong>
            </div>

            <div>
              <span>Mana: </span>
              <strong>{ability.mana_cost}</strong>
            </div>

            {ability.arcane_mana_cost && (
              <div>
                <span>Mana Arcana: </span>
                <strong>{ability.arcane_mana_cost}</strong>
              </div>
            )}

            {ability.bonus_speed > 0 && (
              <div>
                <span>Bônus Velocidade: </span>
                <strong>+{ability.bonus_speed}</strong>
              </div>
            )}
          </div>

          {ability.element_types.length > 0 && (
            <div className="ability-elements">
              {ability.element_types.map(el => (
                <span key={el.id} className="item-element-tag">
                  {el.name}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AbilityCard
