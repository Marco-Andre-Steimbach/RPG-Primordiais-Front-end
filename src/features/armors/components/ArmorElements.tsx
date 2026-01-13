import type { Element } from '../armors.types'

type Props = {
  elements: Element[]
}

function ArmorElements({ elements }: Props) {
  if (elements.length === 0) return null

  return (
    <div className="armor-elements">
      <h4 className="armor-section-title">Elemento</h4>

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

export default ArmorElements
