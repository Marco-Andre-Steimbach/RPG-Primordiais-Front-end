import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchPerkById, fetchElementById } from '../perks.service'
import type { Perk, Ability } from '../perks.types'

import PerkHeader from '../components/PerkHeader'
import PerkInfo from '../components/PerkInfo'
import PerkAttributes from '../components/PerkAttributes'
import PerkAbility from '../components/PerkAbility'

import '../perk-detail.css'

type Element = {
  id: number
  name: string
}

function PerkDetailPage() {
  const { id } = useParams()
  const [perk, setPerk] = useState<Perk | null>(null)
  const [elements, setElements] = useState<Element[]>([])

  useEffect(() => {
    if (!id) return

    fetchPerkById(id).then(res => {
      const perkData = res.perk
      setPerk(perkData)

      if (perkData.element_types.length === 0) {
        setElements([])
        return
      }

      Promise.all(
        perkData.element_types.map(el => fetchElementById(el))
      ).then(r => {
        setElements(r.map(e => e.element))
      })
    })
  }, [id])

  if (!perk) return null

  const ability: Ability | null =
    Array.isArray(perk.ability) && perk.ability.length > 0
      ? perk.ability[0]
      : null

  return (
    <div className="perk-detail-container">
      <PerkHeader name={perk.name} />

      <PerkInfo perk={perk} elements={elements} />

      {perk.attributes.length > 0 && (
        <PerkAttributes attributes={perk.attributes} />
      )}

      {ability && <PerkAbility ability={ability} />}
    </div>
  )
}

export default PerkDetailPage
