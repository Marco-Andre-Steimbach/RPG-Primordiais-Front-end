type ItemCreated = {
    id: number
    label: string
  }
  
  type Props = {
    title: string
    items: ItemCreated[]
  }
  
  function ItemCreatedList({ title, items }: Props) {
    if (items.length === 0) {
      return (
        <div className="master-form-empty">
          Nenhuma {title.toLowerCase()} criada ainda.
        </div>
      )
    }
  
    return (
      <div className="master-created-list">
        <h4 className="master-created-title">{title}</h4>
  
        <ul className="master-created-items">
          {items.map(item => (
            <li key={item.id} className="master-created-item">
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    )
  }
  
  export default ItemCreatedList
  