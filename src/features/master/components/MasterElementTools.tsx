type Props = {
  activeTool: 'damage' | 'attack' | null
  onSelectTool: (tool: 'damage' | 'attack') => void
}

function MasterElementTools({
  activeTool,
  onSelectTool
}: Props) {
  return (
    <aside className="master-side-panel">
      <h3 className="master-side-title">
        Elementos
      </h3>

      <button
        className={`master-side-item ${
          activeTool === 'damage'
            ? 'active'
            : ''
        }`}
        onClick={() =>
          onSelectTool('damage')
        }
      >
        Calcular Dano
      </button>

      <button
        className={`master-side-item ${
          activeTool === 'attack'
            ? 'active'
            : ''
        }`}
        onClick={() =>
          onSelectTool('attack')
        }
      >
        Relações de Elementos
      </button>
    </aside>
  )
}

export default MasterElementTools
