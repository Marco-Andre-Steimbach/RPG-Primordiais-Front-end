import { useNavigate } from 'react-router-dom'
import './home.css'

function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="home-container">
      <div
        className="home-card card-info"
        style={{ backgroundImage: 'url(/assets/images/menu/info.jpg)' }}
        onClick={() => navigate('/info')}
      >
        <div className="home-card-title">Informações</div>
      </div>

      <div
        className="home-card card-characters"
        style={{ backgroundImage: 'url(/assets/images/menu/characters.jpg)' }}
        onClick={() => navigate('/characters')}
      >
        <div className="home-card-title">Personagens</div>
      </div>

      <div
        className="home-card card-campaigns"
        style={{ backgroundImage: 'url(/assets/images/menu/campaigns.jpg)' }}
        onClick={() => navigate('/campaigns')}
      >
        <div className="home-card-title">Campanhas</div>
      </div>
    </div>
  )
}

export default HomePage
