import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  fetchCampaignById,
  fetchCharacterSheetInfo
} from '../campaigns.service'
import type {
  CampaignWithCharacters,
  CharacterSheetInfo
} from '../campaigns.types'

import CharacterProgressionModal from '../components/CharacterProgressionModal'
import '../campaigns.css'

function calculateExpectedAbilities(level: number) {
  if (level <= 4) return level
  return 4 + Math.floor((level - 4) / 3)
}

function CharacterSheetPage() {
  const { campaignId, characterId } = useParams()
  const navigate = useNavigate()

  const [campaign, setCampaign] = useState<CampaignWithCharacters | null>(null)
  const [infos, setInfos] = useState<CharacterSheetInfo | null>(null)
  const [modal, setModal] = useState<null | {
    title: string
    message: string
    redirect: string
  }>(null)

  useEffect(() => {
    if (!campaignId || !characterId) return

    fetchCampaignById(campaignId).then(res => {
      setCampaign(res.campaign)
    })

    fetchCharacterSheetInfo(campaignId, characterId).then(res => {
      setInfos(res.infos)
    })
  }, [campaignId, characterId])

  useEffect(() => {
    if (!campaign || !infos) return

    const character = campaign.characters.find(
      c => c.character_id === Number(characterId)
    )

    if (!character) return

    const level = character.level

    const expectedPerks = level
    const expectedAbilities = calculateExpectedAbilities(level)

    if (infos.perks < expectedPerks) {
      setModal({
        title: 'Perks pendentes',
        message: `Este personagem possui ${infos.perks} perks, mas deveria possuir ${expectedPerks}. Você precisa distribuir ${expectedPerks - infos.perks} perk(s) antes de continuar.`,
        redirect: `/campaign/${campaignId}/characters/${characterId}/perks`
      })
      return
    }

    if (infos.abilities < expectedAbilities) {
      setModal({
        title: 'Habilidades pendentes',
        message: `Este personagem possui ${infos.abilities} habilidades, mas deveria possuir ${expectedAbilities}. Você precisa escolher ${expectedAbilities - infos.abilities} habilidade(s) antes de continuar.`,
        redirect: `/campaign/${campaignId}/characters/${characterId}/abilities`
      })
    }
  }, [campaign, infos, campaignId, characterId])

  if (modal) {
    return (
      <CharacterProgressionModal
        title={modal.title}
        message={modal.message}
        onConfirm={() => navigate(modal.redirect)}
      />
    )
  }

  return (
    <div className="campaign-page-loading">
      Verificando progressão do personagem...
    </div>
  )
}

export default CharacterSheetPage
