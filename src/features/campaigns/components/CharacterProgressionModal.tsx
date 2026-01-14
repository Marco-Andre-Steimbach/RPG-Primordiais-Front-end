function CharacterProgressionModal({
    title,
    message,
    onConfirm
  }: {
    title: string
    message: string
    onConfirm: () => void
  }) {
    return (
      <div className="progression-modal-backdrop">
        <div className="progression-modal">
          <h3>{title}</h3>
          <p>{message}</p>
          <button onClick={onConfirm}>OK</button>
        </div>
      </div>
    )
  }
  
  export default CharacterProgressionModal
  