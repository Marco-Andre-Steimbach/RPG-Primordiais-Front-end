function PerkSearch({
  onSearch,
  onLevel
}: {
  onSearch: (v: string) => void
  onLevel: (v: number | null) => void
}) {
  return (
    <div className="perk-search">
      <input
        placeholder="Buscar perk"
        onChange={e => onSearch(e.target.value)}
      />

      <select onChange={e => onLevel(e.target.value ? Number(e.target.value) : null)}>
        <option value="">Todos os níveis</option>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
          <option key={n} value={n}>Nível {n}</option>
        ))}
      </select>
    </div>
  )
}

export default PerkSearch
