import { useEffect, useState } from 'react'
import { fetchAllCampaigns } from '../campaigns.service'
import type { Campaign } from '../campaigns.types'

import CampaignCard from '../components/CampaignCard'

import '../campaigns.css'

function CampaignsAllPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [openCampaignId, setOpenCampaignId] = useState<number | null>(null)
  const [nameFilter, setNameFilter] = useState('')

  useEffect(() => {
    fetchAllCampaigns().then(res => setCampaigns(res.campaigns))
  }, [])

  const filteredCampaigns = campaigns.filter(campaign =>
    nameFilter.length === 0 ||
    campaign.name.toLowerCase().includes(nameFilter.toLowerCase())
  )

  return (
    <div className="campaigns-all-container">
      <div className="campaigns-filter-bar">
        <input
          type="text"
          placeholder="Buscar campanha..."
          value={nameFilter}
          onChange={e => setNameFilter(e.target.value)}
        />
      </div>

      {filteredCampaigns.map(campaign => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
          isOpen={openCampaignId === campaign.id}
          onToggle={() =>
            setOpenCampaignId(
              openCampaignId === campaign.id ? null : campaign.id
            )
          }
        />
      ))}
    </div>
  )
}

export default CampaignsAllPage
