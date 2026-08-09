type Props = {
  onBack?: () => void
}

function MasterCombatNavbar({
  onBack
}: Props) {
  return (
    <nav className="master-combat-navbar">
      <div className="master-combat-navbar-options">
        <button
          type="button"
          className="master-combat-navbar-item active"
        >
          Ficha
        </button>

        <button
          type="button"
          className="master-combat-navbar-item"
        >
          Players caídos
        </button>

        <button
          type="button"
          className="master-combat-navbar-item"
        >
          Monstros caídos
        </button>
      </div>

      {onBack && (
        <button
          type="button"
          className="master-combat-navbar-back"
          onClick={onBack}
        >
          Voltar
        </button>
      )}
    </nav>
  )
}

export default MasterCombatNavbar
