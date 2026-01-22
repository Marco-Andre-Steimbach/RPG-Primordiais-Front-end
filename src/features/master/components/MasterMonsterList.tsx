import { useEffect, useMemo, useState } from 'react'
import { fetchMonsters } from '../monsters.service'
import type { MonsterListItem } from '../monsters.types'

type Props = {
    onCreate: () => void
    selectedMonsterId: number | null
    onSelectMonster: (id: number) => void
}

function MasterMonsterList({ onCreate, selectedMonsterId, onSelectMonster }: Props) {
    const [monsters, setMonsters] = useState<MonsterListItem[]>([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchMonsters()
            .then(res => setMonsters(res.monsters))
            .finally(() => setLoading(false))
    }, [])

    const filteredMonsters = useMemo(() => {
        const term = search.toLowerCase()

        return monsters.filter(m =>
            m.name.toLowerCase().includes(term)
        )
    }, [monsters, search])

    return (
        <aside className="master-side-panel">
            <div className="master-side-header">
                <h3 className="master-side-title">Monstros</h3>

                <button className="master-create-button" onClick={onCreate}>
                    Criar Monstro
                </button>
            </div>

            <input
                className="master-search-input"
                type="text"
                placeholder="Buscar monstro..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            {loading ? (
                <div className="master-side-loading">
                    Carregando monstros...
                </div>
            ) : (
                <ul className="master-side-list">
                    {filteredMonsters.map(monster => (
                        <li
                            key={monster.id}
                            className={`master-side-item ${selectedMonsterId === monster.id ? 'active' : ''}`}
                            onClick={() => onSelectMonster(monster.id)}
                        >
                            {monster.name}
                        </li>
                    ))}
                </ul>
            )}
        </aside>
    )
}

export default MasterMonsterList
