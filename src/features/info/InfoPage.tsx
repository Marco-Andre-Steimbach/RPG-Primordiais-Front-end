import { useNavigate } from 'react-router-dom'
import './info.css'

function InfoPage() {
  const navigate = useNavigate()

  return (
    <div className="info-container">
      <div
        className="info-card"
        style={{ backgroundImage: 'url(/assets/images/menu/orders.jpg)' }}
        onClick={() => navigate('/orders')}
      >
        <div className="info-card-title">Ordens</div>
      </div>

      <div
        className="info-card"
        style={{ backgroundImage: 'url(/assets/images/menu/races.jpg)' }}
        onClick={() => navigate('/races')}
      >
        <div className="info-card-title">Raças</div>
      </div>

      <div
        className="info-card info-card-top"
        style={{ backgroundImage: 'url(/assets/images/menu/items.jpg)' }}
        onClick={() => navigate('/items')}
      >
        <div className="info-card-title">Itens</div>
      </div>
    </div>
  )
}

export default InfoPage
