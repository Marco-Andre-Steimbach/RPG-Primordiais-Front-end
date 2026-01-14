import type { Campaign } from '../campaigns.types'
import CampaignExpanded from './CampaignExpanded'

function CampaignCard({
  campaign,
  isOpen,
  onToggle
}: {
  campaign: Campaign
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <>
      <div className="campaign-card-small" onClick={onToggle}>
        <span className="campaign-name">{campaign.name}</span>
        <span className="campaign-players">
          {campaign.characters_count} jogadores
        </span>
      </div>

      {isOpen && <CampaignExpanded campaign={campaign} />}
    </>
  )
}

export default CampaignCard
