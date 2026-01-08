type Props = {
  value: string
  onChange: (v: string) => void
}

function CharacterBasicInfo({ value, onChange }: Props) {
  return (
    <input
      type="text"
      placeholder="Nome do personagem"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  )
}

export default CharacterBasicInfo
