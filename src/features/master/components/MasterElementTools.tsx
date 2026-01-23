type Props = {
    activeTool: 'damage' | 'weakness' | 'attack' | null
    onSelectTool: (tool: 'damage' | 'weakness' | 'attack') => void
  }
  
  function MasterElementTools({ activeTool, onSelectTool }: Props) {
    return (
      <aside className="master-side-panel">
        <h3 className="master-side-title">Elementos</h3>
  
        <button
          className={`master-side-item ${
            activeTool === 'damage' ? 'active' : ''
          }`}
          onClick={() => onSelectTool('damage')}
        >
          Calcular Dano
        </button>
  
        <button
          className={`master-side-item ${
            activeTool === 'weakness' ? 'active' : ''
          }`}
          onClick={() => onSelectTool('weakness')}
        >
          Fraquezas (Defesa)
        </button>
  
        <button
          className={`master-side-item ${
            activeTool === 'attack' ? 'active' : ''
          }`}
          onClick={() => onSelectTool('attack')}
        >
          Ofensiva (Ataque)
        </button>
      </aside>
    )
  }
  
  export default MasterElementTools
  