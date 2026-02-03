type ItemTool = 'item' | 'weapon' | 'armor' | null

type Props = {
  activeTool: ItemTool
  onSelectTool: (tool: ItemTool) => void
}

function MasterItemTools({ activeTool, onSelectTool }: Props) {
  return (
    <aside className="master-side-panel">
      <h3 className="master-side-title">Itens</h3>

      <button
        className={`master-side-item ${
          activeTool === 'item' ? 'active' : ''
        }`}
        onClick={() => onSelectTool('item')}
      >
        Criar item
      </button>

      <button
        className={`master-side-item ${
          activeTool === 'weapon' ? 'active' : ''
        }`}
        onClick={() => onSelectTool('weapon')}
      >
        Criar arma
      </button>

      <button
        className={`master-side-item ${
          activeTool === 'armor' ? 'active' : ''
        }`}
        onClick={() => onSelectTool('armor')}
      >
        Criar armadura
      </button>
    </aside>
  )
}

export default MasterItemTools
