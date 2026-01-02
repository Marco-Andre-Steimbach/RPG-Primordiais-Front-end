import type { Perk } from '../perks.types'

type Element = {
  id: number
  name: string
}

function PerkInfo({
  perk,
  elements
}: {
  perk: Perk
  elements: Element[]
}) {
  return (
    <div className="perk-info-card">
      <p className="perk-description">
        {perk.description}
      </p>

      <div className="perk-meta">
        <span>
          <strong>Tipo:</strong>{' '}
          {perk.type === 'passive' ? 'Passiva' : 'Ativa'}
        </span>

        <span>
          <strong>Nível mínimo:</strong> {perk.required_level}
        </span>

        {perk.mana_cost > 0 && (
          <span>
            <strong>Mana:</strong> {perk.mana_cost}
          </span>
        )}
      </div>

      {elements.length > 0 && (
        <div className="perk-elements-section">
          <div className="perk-elements-title">
            -Tipos elementais-
          </div>

          <div className="perk-elements-inline">
            {elements.map(el => (
              <span
                key={el.id}
                className="perk-element-tag"
              >
                {el.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PerkInfo
