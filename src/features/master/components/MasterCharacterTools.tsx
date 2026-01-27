type Props = {
    activeTool: 'sheet' | 'gold' | 'xp' | 'item' | null
    onSelectTool: (tool: 'sheet' | 'gold' | 'xp' | 'item') => void
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
      </aside>
    )
  }
  
  export default MasterCharacterTools
  