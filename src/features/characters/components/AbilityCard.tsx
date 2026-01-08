import type { Ability } from '../characters.types'

type Props = {
  ability: Ability
  isOpen: boolean
  onToggle: () => void
}

function AbilityCard({ ability, isOpen, onToggle }: Props) {
  return (
    <>
      <div className="ability-card-small" onClick={onToggle}>
        <span>{ability.title}</span>
      </div>

      {isOpen && (
        <div className="ability-card-expanded">
          <p>{ability.description}</p>

          <div className="ability-meta">
            <div>
              <span>Dano</span>
              <strong>
                {ability.dice_formula} + {ability.base_damage}
              </strong>
            </div>

            <div>
              <span>Custo de mana</span>
              <strong>{ability.mana_cost}</strong>
            </div>
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
    </>
  )
}

export default AbilityCard
