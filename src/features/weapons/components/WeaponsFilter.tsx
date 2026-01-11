type Props = {
  onNameChange: (v: string) => void
}

function WeaponsFilter({ onNameChange }: Props) {
  return (
    <div className="items-filter-bar">
      <input
        type="text"
        placeholder="Buscar arma por nome"
        onChange={e => onNameChange(e.target.value)}
      />
    </div>
  )
}

export default WeaponsFilter
