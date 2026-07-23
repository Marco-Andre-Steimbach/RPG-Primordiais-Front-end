type Props = {
  activeTool: 'search' | 'create' | null
  onSelectTool: (tool: 'search' | 'create') => void
}

function MasterEncounterTools({ activeTool, onSelectTool }: Props) {
  return (
    <aside className="master-side-panel">
      <h3 className="master-side-title">Encontros</h3>

      <button
        className={`master-side-item ${activeTool === 'search' ? 'active' : ''}`}
        onClick={() => onSelectTool('search')}
      >
        Buscar encontros
      </button>

      <button
        className={`master-side-item ${activeTool === 'create' ? 'active' : ''}`}
        onClick={() => onSelectTool('create')}
      >
        Criar encontro
      </button>
    </aside>
  )
}

export default MasterEncounterTools
