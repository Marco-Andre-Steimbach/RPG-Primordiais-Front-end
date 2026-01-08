type Props = {
  onSubmit: () => void
}

function CharacterSubmit({ onSubmit }: Props) {
  return <button onClick={onSubmit}>Criar personagem</button>
}

export default CharacterSubmit
