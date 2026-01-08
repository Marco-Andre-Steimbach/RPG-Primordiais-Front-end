import type { ManaModifier } from '../characters.types'

type Props = {
  value: ManaModifier | ''
  onChange: (v: ManaModifier) => void
}

const options: { label: string; value: ManaModifier }[] = [
  { label: 'Força', value: 'str' },
  { label: 'Destreza', value: 'dex' },
  { label: 'Constituição', value: 'con' },
  { label: 'Inteligência', value: 'int' },
  { label: 'Sabedoria', value: 'wis' },
  { label: 'Carisma', value: 'cha' }
]

function ManaModifierSelect({ value, onChange }: Props) {
  return (
    <div>
      <strong>Seu modificador de mana</strong>

      <select
        value={value}
        onChange={e => onChange(e.target.value as ManaModifier)}
      >
        <option value="">Selecione</option>

        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ManaModifierSelect
