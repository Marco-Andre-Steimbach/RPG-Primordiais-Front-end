import { useEffect } from 'react'
import { useDiscoverElementAttackRelations } from '../hooks/useDiscoverElementAttackRelations'
import { useElementMap } from '../hooks/useElementMap'

function DiscoverElementAttackRelations() {
  const { elementMap } = useElementMap()

  const {
    selectedElements,
    toggleElement,
    discover,
    immune,
    groups,
    loading,
    error
  } = useDiscoverElementAttackRelations()

  useEffect(() => {
    if (selectedElements.length > 0) {
      discover()
    }
  }, [selectedElements])

  return (
    <div className="master-sheet card">
      <div className="element-weakness-layout">
        {/* ===== COLUNA ESQUERDA ===== */}
        <div className="element-column">
          <h3>Elementos da Criatura (Ataque)</h3>

          {Array.from(elementMap.values()).map(el => (
            <button
              key={el.id}
              className={`element-btn ${
                selectedElements.includes(el.id) ? 'active' : ''
              }`}
              onClick={() => toggleElement(el.id)}
            >
              {el.name}
            </button>
          ))}
        </div>

        {/* ===== RESULTADO ===== */}
        <div className="element-result-panel">
          <h3>Dano Causado por Tipo</h3>

          {selectedElements.length === 0 && (
            <span className="element-hint">
              Selecione os elementos de ataque da criatura
            </span>
          )}

          {loading && (
            <span className="element-hint">Calculando…</span>
          )}

          {error && (
            <span className="element-error">{error}</span>
          )}

          {immune.length > 0 && (
            <div className="weakness-group immune">
              <div className="weakness-multiplier">
                Não afeta (x0)
              </div>

              <div className="weakness-elements">
                {immune.map(el => (
                  <span key={el.id}>{el.name}</span>
                ))}
              </div>
            </div>
          )}

          {groups.map(group => (
            <div
              key={group.multiplier}
              className="weakness-group"
            >
              <div className="weakness-multiplier">
                Causa x{group.multiplier.toFixed(2)} de dano
              </div>

              <div className="weakness-elements">
                {group.elements.map(el => (
                  <span key={el.id}>{el.name}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DiscoverElementAttackRelations
