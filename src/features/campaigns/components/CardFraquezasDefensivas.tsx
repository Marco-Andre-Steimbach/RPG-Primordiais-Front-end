type Props = {
    damageTypes: { id: number; name: string }[]
  }
  
  function CardFraquezasDefensivas({ damageTypes }: Props) {
    return (
      <div className="sheet-card">
        <h3 className="sheet-card-title">Fraquezas Defensivas</h3>
  
        {damageTypes.length === 0 ? (
          <p className="sheet-card-empty">
            Nenhuma fraqueza física ativa
          </p>
        ) : (
          <div className="sheet-elements-list">
            {damageTypes.map(dt => (
              <span
                key={dt.id}
                className="item-element-tag danger"
              >
                {dt.name}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }
  
  export default CardFraquezasDefensivas
  