import type { Element } from '../weapons.types'

type Props = {
  elements: Element[]
}

function WeaponElements({ elements }: Props) {
  if (elements.length === 0) return null

  return (
    <div className="weapon-elements">
      <h4 className="weapon-section-title">Elementos</h4>

      <div className="item-elements-list">
        {elements.map(el => (
          <span key={el.id} className="item-element-tag">
            {el.name}
          </span>
        ))}
      </div>
    </div>
  )
}

export default WeaponElements
