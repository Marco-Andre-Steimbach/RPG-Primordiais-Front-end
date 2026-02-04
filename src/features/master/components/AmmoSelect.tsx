import { useState } from 'react'
import { useAmmoItems } from '../hooks/useAmmoItems'

type Props = {
  value: number | null
  onChange: (id: number | null) => void
  disabled?: boolean
}

function AmmoSelect({ value, onChange, disabled }: Props) {
  const [search, setSearch] = useState('')
  const { items, loading } = useAmmoItems(search)

  return (
    <div className="master-field">
      <label>Munição</label>

      <input
        className="master-input"
        placeholder="Pesquisar item..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        disabled={disabled}
      />

      <select
        className="master-input"
        value={value ?? ''}
        onChange={e =>
          onChange(e.target.value ? Number(e.target.value) : null)
        }
        disabled={disabled || loading}
      >
        <option value="">Selecione uma munição</option>

        {items.map(item => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default AmmoSelect
