import { useEffect, useState } from 'react'
import { fetchElements, calculateElementDamage } from '../element.service'
import type { ElementType } from '../elements.types'

function ElementDamageCalculator() {
  const [elements, setElements] = useState<ElementType[]>([])
  const [attackElements, setAttackElements] = useState<number[]>([])
  const [defenseElements, setDefenseElements] = useState<number[]>([])
  const [baseDamage, setBaseDamage] = useState(100)

  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchElements().then(res => setElements(res.elements))
  }, [])

  function toggle(
    list: number[],
    setList: (v: number[]) => void,
    id: number
  ) {
    setList(
      list.includes(id)
        ? list.filter(i => i !== id)
        : [...list, id]
    )
  }

  async function handleCalculate() {
    setLoading(true)
    setResult(null)

    const res = await calculateElementDamage({
      attack_elements: attackElements,
      defense_elements: defenseElements,
      base_damage: baseDamage
    })

    setResult(res.damage)
    setLoading(false)
  }

  return (
    <div className="element-damage-layout">
      <div className="element-column">
        <h3>Elemento atacante</h3>

        {elements.map(el => (
          <button
            key={el.id}
            className={`element-btn ${attackElements.includes(el.id) ? 'active' : ''}`}
            onClick={() => toggle(attackElements, setAttackElements, el.id)}
          >
            {el.name}
          </button>
        ))}
      </div>

      <div className="element-center">
        <h3>Dano</h3>

        <input
          type="number"
          value={baseDamage}
          onChange={e => setBaseDamage(Number(e.target.value))}
        />

        <button onClick={handleCalculate} disabled={loading}>
          Calcular
        </button>

        {result && (
          <div className="damage-result">
            <p>Dano Base: {result.base_damage}</p>
            <p>Multiplicador: x{result.multiplier}</p>
            <p>Dano Final: {result.final_damage}</p>
            <p>Vantagens: {result.advantages}</p>
            <p>Desvantagens: {result.disadvantages}</p>
            <p>Imunidade: {result.immunity ? 'Sim' : 'Não'}</p>
          </div>
        )}
      </div>

      <div className="element-column">
        <h3>Elemento defensor</h3>

        {elements.map(el => (
          <button
            key={el.id}
            className={`element-btn ${defenseElements.includes(el.id) ? 'active' : ''}`}
            onClick={() => toggle(defenseElements, setDefenseElements, el.id)}
          >
            {el.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ElementDamageCalculator
