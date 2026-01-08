type ValueFilterType = '=' | '<' | '>' | ''

function ItemsFilter({
  onNameChange,
  onValueChange,
  onValueTypeChange
}: {
  onNameChange: (v: string) => void
  onValueChange: (v: number | null) => void
  onValueTypeChange: (v: ValueFilterType) => void
}) {
  return (
    <div className="items-filter-bar">
      <input
        type="text"
        placeholder="Buscar por nome"
        onChange={e => onNameChange(e.target.value)}
      />

      <div className="items-filter-value">
        <select onChange={e => onValueTypeChange(e.target.value as ValueFilterType)}>
          <option value="">Valor</option>
          <option value="=">Igual a</option>
          <option value="<">Menor que</option>
          <option value=">">Maior que</option>
        </select>

        <input
          type="number"
          placeholder="Valor"
          onChange={e =>
            onValueChange(e.target.value ? Number(e.target.value) : null)
          }
        />
      </div>
    </div>
  )
}

export default ItemsFilter
