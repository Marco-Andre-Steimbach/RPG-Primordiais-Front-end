import { useEffect, useMemo, useState } from 'react'
import { fetchEncounters } from '../encounters.service'
import type { EncounterListItem } from '../encounters.types'

type Props = {
  campaignId: number
  selectedEncounterId: number | null
  onSelectEncounter: (id: number) => void
}

function MasterEncounterList({
  campaignId,
  selectedEncounterId,
  onSelectEncounter
}: Props) {
  const [encounters, setEncounters] =
    useState<EncounterListItem[]>([])

  const [search, setSearch] =
    useState('')

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  const [collapsed, setCollapsed] =
    useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)
    setCollapsed(false)

    fetchEncounters(campaignId)
      .then(res => {
        setEncounters(res.encounters)
      })
      .catch(() => {
        setEncounters([])
        setError('Erro ao carregar encontros.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [campaignId])

  useEffect(() => {
    if (!selectedEncounterId) {
      setCollapsed(false)
    }
  }, [selectedEncounterId])

  const filteredEncounters = useMemo(() => {
    const term = search
      .trim()
      .toLowerCase()

    return encounters.filter(encounter =>
      encounter.name
        .toLowerCase()
        .includes(term)
    )
  }, [encounters, search])

  if (collapsed) {
    return (
      <aside className="master-side-panel master-encounter-side-panel collapsed">
        <button
          type="button"
          className="master-encounter-panel-toggle collapsed"
          title="Abrir encontros"
          aria-label="Abrir encontros"
          onClick={() => setCollapsed(false)}
        >
          ›
        </button>
      </aside>
    )
  }

  return (
    <aside className="master-side-panel master-encounter-side-panel">
      <div className="master-side-header">
        <h3 className="master-side-title">
          Encontros
        </h3>

        {selectedEncounterId !== null && (
          <button
            type="button"
            className="master-encounter-panel-toggle"
            title="Recolher encontros"
            aria-label="Recolher encontros"
            onClick={() => setCollapsed(true)}
          >
            ‹
          </button>
        )}
      </div>

      <input
        className="master-search-input"
        type="text"
        placeholder="Buscar encontro..."
        value={search}
        onChange={event =>
          setSearch(event.target.value)
        }
      />

      {loading ? (
        <div className="master-side-loading">
          Carregando encontros...
        </div>
      ) : error ? (
        <div className="master-side-loading">
          {error}
        </div>
      ) : (
        <ul className="master-side-list">
          {filteredEncounters.map(
            encounter => (
              <li
                key={encounter.id}
                className={`master-side-item ${
                  selectedEncounterId ===
                  encounter.id
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  onSelectEncounter(
                    encounter.id
                  )
                }
              >
                {encounter.name}
              </li>
            )
          )}

          {filteredEncounters.length === 0 && (
            <li className="master-side-loading">
              Nenhum encontro encontrado.
            </li>
          )}
        </ul>
      )}
    </aside>
  )
}

export default MasterEncounterList
