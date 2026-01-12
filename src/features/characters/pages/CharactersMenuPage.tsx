import { useNavigate } from 'react-router-dom'
import '../characters.css'

function CharactersMenuPage() {
  const navigate = useNavigate()

  return (
    <div className="info-container">
      <div
        className="info-card"
        style={{ backgroundImage: 'url(/assets/images/menu/my-characters.jpg)' }}
        onClick={() => navigate('/characters/my')}
      >
        <div className="info-card-title">Meus personagens</div>
      </div>

      <div
        className="info-card"
        style={{ backgroundImage: 'url(/assets/images/menu/characters.jpg)' }}
        onClick={() => navigate('/character/all')}
      >
        <div className="info-card-title">Personagens</div>
      </div>

      <div
        className="info-card info-card-top"
        style={{ backgroundImage: 'url(/assets/images/menu/create-character.jpg)' }}
        onClick={() => navigate('/characters/create')}
      >
        <div className="info-card-title">Criar personagem</div>
      </div>
    </div>
  )
}

export default CharactersMenuPage
