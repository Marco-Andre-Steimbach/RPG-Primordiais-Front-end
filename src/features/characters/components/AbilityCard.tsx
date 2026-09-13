import type {
  Ability,
  ElementType
} from '../characters.types'

type Props = {
  ability: Ability
  isOpen: boolean
  onToggle: () => void
  elements?: ElementType[]
}

function AbilityCard({
  ability,
  isOpen,
  onToggle,
  elements = []
}: Props) {
  const normalElements =
    elements.filter(element =>
      ability.normal_element_types.includes(
        element.id
      )
    )

  const arcaneElements =
    elements.filter(element =>
      ability.arcane_element_types.includes(
        element.id
      )
    )

  return (
    <div className="ability-wrapper">
      <div
        className="ability-card-small"
        onClick={onToggle}
      >
        <span>
          {ability.title}
        </span>

        {ability.status === 'draft' && (
          <span className="ability-card-draft-label">
            Não ajustada
          </span>
        )}
      </div>

      {isOpen && (
        <div className="ability-card-expanded parchment">
          <p className="ability-description">
            {ability.description}
          </p>

          <div className="ability-stats">
            <div>
              <span>
                Mana:
              </span>

              <strong>
                {ability.mana_cost}
              </strong>
            </div>

            {ability.arcane_mana_cost !== null && (
              <div>
                <span>
                  Mana Arcana:
                </span>

                <strong>
                  {ability.arcane_mana_cost}
                </strong>
              </div>
            )}
          </div>

          {normalElements.length > 0 && (
            <div className="ability-elements">
              {normalElements.map(element => (
                <span
                  key={element.id}
                  className="item-element-tag"
                >
                  {element.name}
                </span>
              ))}
            </div>
          )}

          {ability.arcane_title && (
            <div className="ability-arcane">
              <strong>
                {ability.arcane_title}
              </strong>

              {ability.arcane_description && (
                <p>
                  {ability.arcane_description}
                </p>
              )}

              {arcaneElements.length > 0 && (
                <div className="ability-elements">
                  {arcaneElements.map(element => (
                    <span
                      key={element.id}
                      className="item-element-tag"
                    >
                      {element.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AbilityCard
