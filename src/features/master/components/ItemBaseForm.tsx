import { useState } from 'react'
import type { CreateItemPayload } from '../items.types'
import { useElementMap } from '../hooks/useElementMap'

type Props = {
  loading: boolean
  onSubmit: (
    payload: Omit<CreateItemPayload, 'item_abilities'>
  ) => Promise<void>
}

function ItemBaseForm({ loading, onSubmit }: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [value, setValue] = useState(0)
  const [elementTypes, setElementTypes] = useState<number[]>([])

  const { elementMap, loading: elementsLoading } = useElementMap()

  function toggleElement(id: number) {
    setElementTypes(prev =>
      prev.includes(id)
        ? prev.filter(e => e !== id)
        : [...prev, id]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    await onSubmit({
      name,
      description,
      value,
      element_types: elementTypes
    })

    setName('')
    setDescription('')
    setValue(0)
    setElementTypes([])
  }

  return (
    <form className="master-form" onSubmit={handleSubmit}>
      <h3 className="master-form-title">Criar item</h3>

      <input
        className="master-input"
        placeholder="Nome do item"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />

      <textarea
        className="master-textarea"
        placeholder="Descrição"
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
      />

      <div className="master-field">
        <label>Valor em ouro</label>
        <input
          className="master-input"
          type="number"
          min={0}
          placeholder="0"
          value={value}
          onChange={e => setValue(Number(e.target.value))}
          required
        />
        <small>Quanto custa o item na loja (0 = não vendável)</small>
      </div>


      <div className="master-form-section">
        <h4 className="master-form-subtitle">
          Tipos elementais
        </h4>

        <div className="master-form-grid">
          {Array.from(elementMap.values()).map(el => (
            <button
              key={el.id}
              type="button"
              className={`master-chip ${elementTypes.includes(el.id) ? 'active' : ''
                }`}
              onClick={() => toggleElement(el.id)}
              disabled={elementsLoading}
            >
              {el.name}
            </button>
          ))}
        </div>
      </div>

      <button
        className="master-wizard-btn primary"
        type="submit"
        disabled={loading || elementsLoading}
      >
        Criar item
      </button>
    </form>
  )
}

export default ItemBaseForm
