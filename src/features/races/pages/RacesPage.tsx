import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchRaces } from '../races.service'
import type { Race } from '../races.types'
import '../races.css'

function RacesPage() {
  const [races, setRaces] = useState<Race[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchRaces().then(res => setRaces(res.races))
  }, [])

  return (
    <div className="races-container">
      {races.map(race => {
        const imgPath = `/assets/images/races/${race.id}.jpg`

        return (
          <div
            key={race.id}
            className="race-card"
            onClick={() => navigate(`/races/${race.id}`)}
          >
            <div
              className="race-card-image"
              style={{ backgroundImage: `url(${imgPath})` }}
            >
              <span className="race-card-title">{race.name}</span>
              <span className="race-card-fallback">Falta imagem</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default RacesPage
