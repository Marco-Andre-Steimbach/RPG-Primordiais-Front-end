type Option = {
  id: number
  name: string
  image?: string
}

type Props = {
  label: string
  options: Option[]
  value: number | null
  onChange: (id: number) => void
}

function CharacterSelect({
  label,
  options,
  value,
  onChange
}: Props) {
  return (
    <div>
      <strong>{label}</strong>

      <select
        value={value ?? ''}
        onChange={e => onChange(Number(e.target.value))}
      >
        <option value="" disabled>
          Selecione {label.toLowerCase()}
        </option>

        {options.map(opt => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default CharacterSelect
