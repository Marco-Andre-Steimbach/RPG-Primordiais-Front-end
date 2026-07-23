type Props = {
  encounterId: number
  onBack?: () => void
}

function MasterEncounterCombat({
  encounterId,
  onBack
}: Props) {
  return (
    <section className="master-sheet card">
      <div className="master-sheet-header">
        <h2>Combate</h2>
      </div>

      <p>Tela em desenvolvimento.</p>

      {onBack && (
        <button
          type="button"
          className="master-wizard-btn ghost"
          onClick={onBack}
        >
          Voltar
        </button>
      )}
    </section>
  )
}

export default MasterEncounterCombat
