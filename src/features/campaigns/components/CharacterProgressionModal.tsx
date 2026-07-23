type Props = {
  title: string
  message: string
  onConfirm: () => void
  onClose?: () => void
}

function CharacterProgressionModal({
  title,
  message,
  onConfirm,
  onClose
}: Props) {
  return (
    <div className="progression-modal-backdrop">
      <div className="progression-modal">
        <h3>{title}</h3>

        <p>{message}</p>

        <div className="progression-modal-actions">
          {onClose && (
            <button
              type="button"
              className="secondary"
              onClick={onClose}
            >
              Acessar ficha mesmo assim
            </button>
          )}

          <button
            type="button"
            className="primary"
            onClick={onConfirm}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}

export default CharacterProgressionModal
