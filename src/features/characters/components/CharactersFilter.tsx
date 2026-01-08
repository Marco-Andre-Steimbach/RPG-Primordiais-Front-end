function CharactersFilter({
  onNameChange
}: {
  onNameChange: (v: string) => void
}) {
  return (
    <div className="characters-filter-bar">
      <input
        type="text"
        placeholder="Buscar personagem por nome"
        onChange={e => onNameChange(e.target.value)}
      />
    </div>
  )
}

export default CharactersFilter
