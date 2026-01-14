import { useNavigate } from 'react-router-dom'
import type { Campaign } from '../campaigns.types'

function CampaignExpanded({ campaign }: { campaign: Campaign }) {
  const navigate = useNavigate()
  const createdAt = new Date(campaign.created_at).toLocaleDateString('pt-BR')

  return (
    <div className="campaign-card-expanded">
      <h3>{campaign.name}</h3>

      <p className="campaign-description">
        {campaign.description}
      </p>

      <div className="campaign-meta">
        <div>
          <span>Mestre</span>
          <strong>{campaign.master}</strong>
        </div>

        <div>
          <span>Criada em</span>
          <strong>{createdAt}</strong>
        </div>

        <div>
          <span>Jogadores</span>
          <strong>{campaign.characters_count}</strong>
        </div>
      </div>

      <div className="campaign-actions">
        <button
          className="campaign-open-button"
          onClick={() => navigate(`/campaigns/${campaign.id}`)}
        >
          Abrir campanha
        </button>
      </div>
    </div>
  )
}

export default CampaignExpanded
