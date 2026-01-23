import { useEffect } from 'react'
import { useDiscoverElementRelations } from '../hooks/useDiscoverElementRelations'
import { useElementMap } from '../hooks/useElementMap'

function DiscoverElementRelations() {
  const { elementMap } = useElementMap()

  const {
    selectedElements,
    toggleElement,
    discover,
    immune,
    groups,
    loading,
    error
  } = useDiscoverElementRelations()

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
          <h3>Elementos da Criatura (Defesa)</h3>

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
          <h3>Dano Recebido por Tipo</h3>

          {selectedElements.length === 0 && (
            <span className="element-hint">
              Selecione os elementos que a criatura possui
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
                Não causam dano (x0)
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
                Recebe x{group.multiplier.toFixed(2)} de dano
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

export default DiscoverElementRelations
