import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchCampaignById, fetchMe } from '../campaigns.service'
import type {
    CampaignWithCharacters,
    User
} from '../campaigns.types'

import CampaignCharacterCard from '../components/CampaignCharacterCard'
import '../campaigns.css'

function CampaignPage() {
    const { id } = useParams()
    const [campaign, setCampaign] = useState<CampaignWithCharacters | null>(null)
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        if (!id) return

        fetchCampaignById(id).then(res => {
            setCampaign(res.campaign)
        })

        fetchMe().then(res => {
            setUser(res.user)
        })
    }, [id])

    if (!campaign || !user) {
        return <div className="campaign-page-loading">Carregando campanha...</div>
    }

    const isMaster = user.nickname === campaign.master

    return (
        <div className="campaign-page-container">
            <header className="campaign-page-header">
                <h1>{campaign.name}</h1>
                <span className="campaign-page-master">
                    Mestre: <strong>{campaign.master}</strong>
                </span>
            </header>

            <section className="campaign-page-description">
                <p>{campaign.description}</p>
            </section>

            <section className="campaign-page-characters">
                <h2>Personagens</h2>

                {campaign.characters.length === 0 && (
                    <div className="campaign-characters-placeholder">
                        Nenhum personagem nesta campanha.
                    </div>
                )}

                {campaign.characters.map(character => (
                    <CampaignCharacterCard
                        key={character.campaign_character_id}
                        campaignId={campaign.id}
                        character={character}
                        user={user}
                        isMaster={isMaster}
                    />
                ))}

            </section>
        </div>
    )
}

export default CampaignPage
