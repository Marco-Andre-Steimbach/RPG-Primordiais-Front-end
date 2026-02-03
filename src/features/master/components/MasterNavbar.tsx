type Props = {
  collapsed: boolean
  onToggle: () => void
  onSelect: (section: 'monsters' | 'elements' | 'characters' | 'items') => void
}

function MasterNavbar({ collapsed, onToggle, onSelect }: Props) {
  return (
    <aside className="master-navbar">
      <div className="master-navbar-header">
        {!collapsed && <h2 className="master-navbar-title">Mestre</h2>}

        <button
          className="master-navbar-toggle"
          onClick={onToggle}
        >
          {collapsed ? '»' : '«'}
        </button>
      </div>

      <nav className="master-navbar-menu">
        <button
          className="master-navbar-item"
          onClick={() => onSelect('characters')}
        >
          <span className="master-navbar-item-text">Personagens</span>
        </button>

        <button
          className="master-navbar-item"
          onClick={() => onSelect('monsters')}
        >
          <span className="master-navbar-item-text">Monstros</span>
        </button>

        <button
          className="master-navbar-item"
          onClick={() => onSelect('elements')}
        >
          <span className="master-navbar-item-text">Elementos</span>
        </button>

        <button
          className="master-navbar-item"
          onClick={() => onSelect('items')}
        >
          <span className="master-navbar-item-text">Itens</span>
        </button>
      </nav>
    </aside>
  )
}

export default MasterNavbar
