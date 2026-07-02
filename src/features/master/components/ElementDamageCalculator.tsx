import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchCampaignById } from '../campaigns.service'
import { fetchMonsters } from '../monsters.service'
import {
  fetchElements,
  calculateElementDamage,
  fetchMonsterElements,
  fetchCharacterElements
} from '../element.service'
import type { ElementType } from '../elements.types'
import type { CampaignCharacter } from '../campaigns.types'
import type { MonsterListItem } from '../monsters.types'

type DefenseFilter = 'player' | 'monster' | ''

function ElementDamageCalculator() {
  const { id } = useParams()
  const campaignId = Number(id)

  const [elements, setElements] = useState<ElementType[]>([])
  const [attackElements, setAttackElements] = useState<number[]>([])
  const [defenseElements, setDefenseElements] = useState<number[]>([])
  const [baseDamage, setBaseDamage] = useState(100)

  const [defenseFilter, setDefenseFilter] = useState<DefenseFilter>('')
  const [characters, setCharacters] = useState<CampaignCharacter[]>([])
  const [monsters, setMonsters] = useState<MonsterListItem[]>([])
  const [selectedEntityId, setSelectedEntityId] = useState('')

  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [loadingEntities, setLoadingEntities] = useState(false)

  useEffect(() => {
    fetchElements().then(res => setElements(res.elements))
  }, [])

  useEffect(() => {
    if (!defenseFilter) return

    setLoadingEntities(true)
    setSelectedEntityId('')
    setDefenseElements([])
    setResult(null)

    if (defenseFilter === 'player') {
      fetchCampaignById(campaignId)
        .then(res => setCharacters(res.campaign.characters))
        .finally(() => setLoadingEntities(false))
      return
    }

    fetchMonsters()
      .then(res => setMonsters(res.monsters))
      .finally(() => setLoadingEntities(false))
  }, [defenseFilter, campaignId])

  const selectedDefenseNames = useMemo(() => {
    return elements
      .filter(el => defenseElements.includes(el.id))
      .map(el => el.name)
      .join(', ')
  }, [elements, defenseElements])

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

  async function handleSelectEntity(value: string) {
    setSelectedEntityId(value)
    setResult(null)

    const entityId = Number(value)

    if (!entityId || !defenseFilter) {
      setDefenseElements([])
      return
    }

    if (defenseFilter === 'player') {
      const res = await fetchCharacterElements(entityId)
      setDefenseElements(res.elements.map(el => el.id))
      return
    }

    const res = await fetchMonsterElements(entityId)
    setDefenseElements(res.elements.map(el => el.id))
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
            <p>Modificador: {result.modifier}</p>
            <p>Dano Final: {result.final_damage}</p>
          </div>
        )}
      </div>

      <div className="element-column">
        <h3>Elemento defensor</h3>

        <div className="defense-selector-card">
          <label>Tipo de defensor</label>

          <select
            value={defenseFilter}
            onChange={e => setDefenseFilter(e.target.value as DefenseFilter)}
          >
            <option value="">Selecione...</option>
            <option value="player">Player</option>
            <option value="monster">Monstro</option>
          </select>

          {defenseFilter && (
            <>
              <label>
                {defenseFilter === 'player'
                  ? 'Selecionar player'
                  : 'Selecionar monstro'}
              </label>

              <select
                value={selectedEntityId}
                onChange={e => handleSelectEntity(e.target.value)}
                disabled={loadingEntities}
              >
                <option value="">
                  {loadingEntities ? 'Carregando...' : 'Selecione...'}
                </option>

                {defenseFilter === 'player' &&
                  characters.map(char => (
                    <option
                      key={char.campaign_character_id}
                      value={char.campaign_character_id}
                    >
                      {char.name}
                    </option>
                  ))}

                {defenseFilter === 'monster' &&
                  monsters.map(monster => (
                    <option key={monster.id} value={monster.id}>
                      {monster.name}
                    </option>
                  ))}
              </select>
            </>
          )}

          {defenseElements.length > 0 && (
            <p>Tipos selecionados: {selectedDefenseNames}</p>
          )}
        </div>

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
