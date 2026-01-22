import { useEffect, useState } from 'react'
import { fetchMonsterById } from '../monsters.service'
import type { MonsterFull } from '../monsters.types'
import { useElementMap } from '../hooks/useElementMap'


type Props = {
    monsterId: number
}

function MasterMonsterSheet({ monsterId }: Props) {
    const { elementMap, loading: elementsLoading } = useElementMap()

    const [monster, setMonster] = useState<MonsterFull | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        setMonster(null)

        fetchMonsterById(monsterId)
            .then(res => setMonster(res.monster))
            .finally(() => setLoading(false))
    }, [monsterId])

    if (loading) {
        return (
            <section className="master-sheet card">
                <div className="master-sheet-loading">Carregando ficha...</div>
            </section>
        )
    }

    if (!monster) {
        return (
            <section className="master-sheet card">
                <div className="master-sheet-loading">Monstro não encontrado.</div>
            </section>
        )
    }

    return (
        <section className="master-sheet card">
            <div className="master-sheet-header">
                <div className="master-sheet-titlebox">
                    <h2 className="master-sheet-title">{monster.name}</h2>
                    <div className="master-sheet-sub">
                        <span className="master-sheet-xp">XP: {monster.xp_reward}</span>
                    </div>
                </div>

                <div className="master-sheet-elements">
                    {monster.element_types.map(id => {
                        const element = elementMap.get(id)

                        return (
                            <span key={id} className="master-element-tag">
                                {element ? element.name : `#${id}`}
                            </span>
                        )
                    })}
                </div>

            </div>

            <p className="master-sheet-description">{monster.description}</p>

            <div className="master-sheet-block">
                <h3 className="master-sheet-section-title">Status</h3>

                <div className="master-status-columns">
                    {/* BLOCO COMBATE */}
                    <div className="master-status-group">
                        <h4 className="master-status-title">Combate</h4>

                        <div className="master-stats-grid">
                            <div className="master-stat">
                                <span>HP</span>
                                <strong>{monster.stats.hp}</strong>
                            </div>

                            <div className="master-stat">
                                <span>AC</span>
                                <strong>{monster.stats.ac}</strong>
                            </div>

                            <div className="master-stat">
                                <span>Velocidade</span>
                                <strong>{monster.stats.speed}</strong>
                            </div>

                            <div className="master-stat">
                                <span>Ações/Turno</span>
                                <strong>{monster.stats.actions_per_turn}</strong>
                            </div>
                        </div>
                    </div>

                    {/* BLOCO ATRIBUTOS */}
                    <div className="master-status-group">
                        <h4 className="master-status-title">Atributos</h4>

                        <div className="master-stats-grid">
                            <div className="master-stat">
                                <span>STR</span>
                                <strong>{monster.stats.str}</strong>
                            </div>

                            <div className="master-stat">
                                <span>DEX</span>
                                <strong>{monster.stats.dex}</strong>
                            </div>

                            <div className="master-stat">
                                <span>CON</span>
                                <strong>{monster.stats.con}</strong>
                            </div>

                            <div className="master-stat">
                                <span>WIS</span>
                                <strong>{monster.stats.wis}</strong>
                            </div>

                            <div className="master-stat">
                                <span>INT</span>
                                <strong>{monster.stats.int}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="master-sheet-columns">
                <div className="master-sheet-block">
                    <h3 className="master-sheet-section-title">Ataques</h3>

                    {monster.attacks.length === 0 ? (
                        <div className="master-empty">Nenhum ataque cadastrado.</div>
                    ) : (
                        <div className="master-cards">
                            {monster.attacks.map(a => (
                                <div key={a.id} className="master-card">
                                    <div className="master-card-head">
                                        <h4 className="master-card-title">{a.name}</h4>
                                        <div className="master-card-meta">
                                            <span>{a.dice_formula}</span>
                                            <span>Base {a.base_damage}</span>
                                            <span>Acc {a.bonus_accuracy}</span>
                                            <span>Range {a.attack_range}</span>
                                        </div>
                                    </div>

                                    <p className="master-card-desc">{a.description}</p>

                                    <div className="master-card-tags">
                                        {a.element_types.map(id => {
                                            const element = elementMap.get(id)

                                            return (
                                                <span key={id} className="master-element-tag small">
                                                    {element ? element.name : `#${id}`}
                                                </span>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="master-sheet-block">
                    <h3 className="master-sheet-section-title">Habilidades</h3>

                    {monster.abilities.length === 0 ? (
                        <div className="master-empty">Nenhuma habilidade cadastrada.</div>
                    ) : (
                        <div className="master-cards">
                            {monster.abilities.map(ab => (
                                <div key={ab.id} className="master-card">
                                    <div className="master-card-head">
                                        <h4 className="master-card-title">{ab.title}</h4>
                                        <div className="master-card-meta">
                                            <span>{ab.dice_formula}</span>
                                            <span>Base {ab.base_damage}</span>
                                            <span>Bônus {ab.bonus_damage}</span>
                                            <span>Speed {ab.bonus_speed}</span>
                                            <span>Range {ab.ability_range}</span>
                                        </div>
                                    </div>

                                    <p className="master-card-desc">{ab.description}</p>

                                    <div className="master-card-tags">
                                        {ab.element_types.map(id => {
                                            const element = elementMap.get(id)

                                            return (
                                                <span key={id} className="master-element-tag small">
                                                    {element ? element.name : `#${id}`}
                                                </span>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default MasterMonsterSheet
