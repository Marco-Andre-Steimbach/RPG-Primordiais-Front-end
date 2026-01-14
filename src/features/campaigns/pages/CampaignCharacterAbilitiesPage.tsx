import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  fetchCharacterAbilities,
  fetchCharacterSheetInfo,
  fetchCharacterSheet,
  addAbilityToCampaignCharacter
} from '../campaigns.service'

import type {
  Ability,
  CharacterSheetInfo
} from '../campaigns.types'

import CharacterProgressionModal from '../components/CharacterProgressionModal'
import CampaignCharacterAbilityCard from '../components/CampaignCharacterAbilityCard'
import '../campaigns.css'

function calculateExpectedAbilities(level: number) {
  if (level <= 4) return level
  return 4 + Math.floor((level - 4) / 3)
}

function CampaignCharacterAbilitiesPage() {
  const { campaignId, characterId } = useParams()
  const navigate = useNavigate()

  const [abilities, setAbilities] = useState<Ability[]>([])
  const [infos, setInfos] = useState<CharacterSheetInfo | null>(null)
  const [ownedAbilityIds, setOwnedAbilityIds] = useState<number[]>([])

  const [modalComplete, setModalComplete] = useState(false)
  const [modalAdded, setModalAdded] = useState(false)

  useEffect(() => {
    if (!campaignId || !characterId) return

    fetchCharacterSheetInfo(campaignId, characterId)
      .then(res => setInfos(res.infos))

    fetchCharacterSheet(campaignId, characterId)
      .then(res =>
        setOwnedAbilityIds(
          res.sheet.abilities.map(a => a.ability.id)
        )
      )

    fetchCharacterAbilities(characterId)
      .then(res => setAbilities(res.abilities))
  }, [campaignId, characterId])

  useEffect(() => {
    if (!infos) return

    const expected = calculateExpectedAbilities(infos.level)

    if (infos.abilities >= expected) {
      setModalComplete(true)
    }
  }, [infos])

  if (!infos) {
    return (
      <div className="campaign-page-loading">
        Carregando habilidades...
      </div>
    )
  }

  const expectedAbilities = calculateExpectedAbilities(infos.level)
  const missing = expectedAbilities - infos.abilities

  const availableAbilities = abilities.filter(
    ability => !ownedAbilityIds.includes(ability.id)
  )

  const handleAddAbility = (abilityId: number) => {
    addAbilityToCampaignCharacter(infos.campaign_character_id, {
      ability_id: abilityId
    }).then(() => {
      fetchCharacterSheetInfo(campaignId!, characterId!)
        .then(r => setInfos(r.infos))

      fetchCharacterSheet(campaignId!, characterId!)
        .then(r =>
          setOwnedAbilityIds(
            r.sheet.abilities.map(a => a.ability.id)
          )
        )

      fetchCharacterAbilities(characterId!)
        .then(r => setAbilities(r.abilities))

      setModalAdded(true)
    })
  }

  return (
    <div className="campaign-abilities-page">
      <header className="campaign-perks-header">
        <h1>Habilidades disponíveis</h1>
        <p>Faltam {missing} habilidade(s)</p>
      </header>

      {availableAbilities.map(ability => (
        <CampaignCharacterAbilityCard
          key={ability.id}
          ability={ability}
          canAdd={missing > 0}
          onAdd={handleAddAbility}
        />
      ))}

      {modalComplete && (
        <CharacterProgressionModal
          title="Habilidades completas"
          message="Você já escolheu todas as habilidades disponíveis. Agora pode voltar para a ficha do personagem."
          onConfirm={() =>
            navigate(`/campaign/${campaignId}/characters/${characterId}/sheet`)
          }
        />
      )}

      {modalAdded && (
        <CharacterProgressionModal
          title="Habilidade adicionada"
          message="A habilidade foi adicionada com sucesso ao personagem."
          onConfirm={() => setModalAdded(false)}
        />
      )}
    </div>
  )
}

export default CampaignCharacterAbilitiesPage
