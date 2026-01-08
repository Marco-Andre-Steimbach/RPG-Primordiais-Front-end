type Props = {
  value: string
  onChange: (v: string) => void
}

function CharacterLore({ value, onChange }: Props) {
  return (
    <textarea
      placeholder="História do personagem"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  )
}

export default CharacterLore
