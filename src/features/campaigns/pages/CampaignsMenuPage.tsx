import { useNavigate } from 'react-router-dom'
import '../campaigns.css'

function CampaignsMenuPage() {
  const navigate = useNavigate()

  return (
    <div className="campaigns-container">
      <div
        className="campaigns-card"
        style={{ backgroundImage: 'url(/assets/images/menu/campaigns.jpg)' }}
        onClick={() => navigate('/campaigns/all')}
      >
        <div className="campaigns-card-title">Campanhas</div>
      </div>

      <div
        className="campaigns-card"
        style={{ backgroundImage: 'url(/assets/images/menu/my-campaigns.jpg)' }}
        onClick={() => navigate('/campaigns/my')}
      >
        <div className="campaigns-card-title">Minhas Campanhas</div>
      </div>

      <div
        className="campaigns-card campaigns-card-disabled"
        style={{ backgroundImage: 'url(/assets/images/menu/create-campaign.jpg)' }}
      >
        <div className="campaigns-card-title">Criar Campanha</div>
        <div className="campaigns-card-soon">Em breve</div>
      </div>
    </div>
  )
}

export default CampaignsMenuPage
