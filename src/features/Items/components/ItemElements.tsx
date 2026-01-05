function ItemElements({ elements }: { elements: any[] }) {
  return (
    <div className="item-elements">
      <strong>Elementos</strong>
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

export default ItemElements
