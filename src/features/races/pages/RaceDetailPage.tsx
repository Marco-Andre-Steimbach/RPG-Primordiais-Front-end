import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchRaceById, fetchRacePerks } from '../races.service'
import type { Race, Perk } from '../races.types'
import RaceHeader from '../components/RaceHeader'
import RaceAttributes from '../components/RaceAttributes'
import RacePerks from '../components/RacePerks'
import '../race-detail.css'

function RaceDetailPage() {
  const { id } = useParams()
  const [race, setRace] = useState<Race | null>(null)
  const [perks, setPerks] = useState<Perk[]>([])

  useEffect(() => {
    if (!id) return
    fetchRaceById(id).then(res => setRace(res.race))
    fetchRacePerks(id).then(res => setPerks(res.perks))
  }, [id])

  if (!race) return null

  return (
    <div className="race-detail-container">
      <RaceHeader name={race.name} />

     <div className="race-info-card">
  <div
    className="race-info-image"
    style={{ backgroundImage: `url(/assets/images/races/${race.id}.jpg)` }}
  />

  <div className="race-info-content">
    <p className="race-description">{race.description}</p>
  </div>
</div>


      <RaceAttributes attributes={race.attributes} />

      <RacePerks perks={perks} />
    </div>
  )
}

export default RaceDetailPage
