import { useEffect, useState } from 'react'
import { fetchAllElements } from '../weapons.service'
import type { Element } from '../weapons.types'

type Props = {
  onNameChange: (v: string) => void
  onDamageTypeChange: (v: string) => void
  onElementsChange: (ids: number[]) => void
}

function WeaponsFilter({
  onNameChange,
  onDamageTypeChange,
  onElementsChange
}: Props) {
  const [elements, setElements] = useState<Element[]>([])
  const [selectedElements, setSelectedElements] = useState<number[]>([])

  useEffect(() => {
    fetchAllElements().then(res => setElements(res.elements))
  }, [])

  function toggleElement(id: number) {
    const updated = selectedElements.includes(id)
      ? selectedElements.filter(e => e !== id)
      : [...selectedElements, id]

    setSelectedElements(updated)
    onElementsChange(updated)
  }

  return (
    <div className="items-filter-bar">
      <input
        type="text"
        placeholder="Buscar arma por nome"
        onChange={e => onNameChange(e.target.value)}
      />

      <select onChange={e => onDamageTypeChange(e.target.value)}>
        <option value="">Tipo de dano</option>
        <option value="Cortante">Cortante</option>
        <option value="Perfurante">Perfurante</option>
        <option value="Concussão">Concussão</option>
      </select>

      {elements.length > 0 && (
        <div className="weapon-elements-filter">
          <strong>Elementos</strong>

          <div className="item-elements-list">
            {elements.map(el => (
              <span
                key={el.id}
                className={`item-element-tag ${
                  selectedElements.includes(el.id) ? 'active' : ''
                }`}
                onClick={() => toggleElement(el.id)}
              >
                {el.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default WeaponsFilter
