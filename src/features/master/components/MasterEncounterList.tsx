import { useEffect, useMemo, useState } from 'react'
import { fetchEncounters } from '../encounters.service'
import type { EncounterListItem } from '../encounters.types'

type Props = {
  selectedEncounterId: number | null
  onSelectEncounter: (id: number) => void
}

function MasterEncounterList({
  selectedEncounterId,
  onSelectEncounter
}: Props) {
  const [encounters, setEncounters] = useState<EncounterListItem[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEncounters()
      .then(res => setEncounters(res.encounters))
      .finally(() => setLoading(false))
  }, [])

  const filteredEncounters = useMemo(() => {
    const term = search.toLowerCase()

    return encounters.filter(encounter =>
      encounter.name.toLowerCase().includes(term)
    )
  }, [encounters, search])

  return (
    <aside className="master-side-panel">
      <div className="master-side-header">
        <h3 className="master-side-title">Encontros</h3>
      </div>

      <input
        className="master-search-input"
        type="text"
        placeholder="Buscar encontro..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {loading ? (
        <div className="master-side-loading">
          Carregando encontros...
        </div>
      ) : (
        <ul className="master-side-list">
          {filteredEncounters.map(encounter => (
            <li
              key={encounter.id}
              className={`master-side-item ${selectedEncounterId === encounter.id ? 'active' : ''}`}
              onClick={() => onSelectEncounter(encounter.id)}
            >
              {encounter.name}
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}

export default MasterEncounterList
