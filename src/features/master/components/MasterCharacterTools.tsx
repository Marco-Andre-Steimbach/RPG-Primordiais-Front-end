type Props = {
  activeTool: 'sheet' | 'gold' | 'xp' | 'item' | 'weapon' | 'armor' | null
  onSelectTool: (tool: 'sheet' | 'gold' | 'xp' | 'item' | 'weapon' | 'armor') => void
}

function MasterCharacterTools({ activeTool, onSelectTool }: Props) {
  return (
    <aside className="master-side-panel">
      <h3 className="master-side-title">Personagens</h3>

      <button
        className={`master-side-item ${activeTool === 'sheet' ? 'active' : ''}`}
        onClick={() => onSelectTool('sheet')}
      >
        Ver ficha
      </button>

      <button
        className={`master-side-item ${activeTool === 'gold' ? 'active' : ''}`}
        onClick={() => onSelectTool('gold')}
      >
        Dar ouro
      </button>

      <button
        className={`master-side-item ${activeTool === 'xp' ? 'active' : ''}`}
        onClick={() => onSelectTool('xp')}
      >
        Dar XP
      </button>

      <button
        className={`master-side-item ${activeTool === 'item' ? 'active' : ''}`}
        onClick={() => onSelectTool('item')}
      >
        Dar item
      </button>

      <button
        className={`master-side-item ${activeTool === 'weapon' ? 'active' : ''}`}
        onClick={() => onSelectTool('weapon')}
      >
        Dar arma
      </button>

      <button
        className={`master-side-item ${activeTool === 'armor' ? 'active' : ''}`}
        onClick={() => onSelectTool('armor')}
      >
        Dar armadura
      </button>

    </aside>
  )
}

export default MasterCharacterTools
