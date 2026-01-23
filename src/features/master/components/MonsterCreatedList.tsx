type Item = {
    id: number
    label: string
  }
  
  type Props = {
    title: string
    items: Item[]
  }
  
  function MonsterCreatedList({ title, items }: Props) {
    if (items.length === 0) {
      return <div className="master-empty">Nenhum {title.toLowerCase()} criado.</div>
    }
  
    return (
      <div className="master-cards">
        {items.map(item => (
          <div key={item.id} className="master-card">
            <strong>{item.label}</strong>
          </div>
        ))}
      </div>
    )
  }
  
  export default MonsterCreatedList
  