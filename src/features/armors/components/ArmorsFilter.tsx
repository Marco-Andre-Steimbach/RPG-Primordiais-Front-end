type Props = {
    onNameChange: (v: string) => void
    onSlotChange: (v: string) => void
    slots: string[]
  }
  
  function ArmorsFilter({ onNameChange, onSlotChange, slots }: Props) {
    return (
      <div className="items-filter-bar">
        <input
          type="text"
          placeholder="Buscar armadura por nome"
          onChange={e => onNameChange(e.target.value)}
        />
  
        <select onChange={e => onSlotChange(e.target.value)}>
          <option value="">Todos os slots</option>
          {slots.map(slot => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      </div>
    )
  }
  
  export default ArmorsFilter
  