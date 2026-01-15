import { useEffect, useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  fetchCampaignById,
  fetchCharacterSheetInfo,
  fetchFullCharacterSheet,
  fetchAllElements
} from '../campaigns.service'
import type {
  CampaignWithCharacters,
  CharacterSheetInfo,
  FullCharacterSheet,
  Element
} from '../campaigns.types'

import CharacterProgressionModal from '../components/CharacterProgressionModal'
import CardInfosGameplay from '../components/CardInfosGameplay'
import CardAtributos from '../components/CardAtributos'
import CardAbilidades from '../components/CardAbilidades'
import CardTiposPersonagem from '../components/CardTiposPersonagem'
import CardArmadura from '../components/CardArmadura'
import CardArmas from '../components/CardArmas'
import CardItens from '../components/CardItens'
import CardPerks from '../components/CardPerks'


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
  const [sheet, setSheet] = useState<FullCharacterSheet | null>(null)
  const [elements, setElements] = useState<Element[]>([])
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

    fetchFullCharacterSheet(campaignId, characterId).then(res => {
      setSheet(res.sheet)
    })

    fetchAllElements().then(res => {
      setElements(res.elements)
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

  const elementsMap = useMemo(() => {
    const map = new Map<number, Element>()
    elements.forEach(el => map.set(el.id, el))
    return map
  }, [elements])

  const characterElementIds = useMemo(() => {
    if (!sheet) return []

    const ids = new Set<number>()

    sheet.armors.forEach(armor => {
      armor.elements.forEach(elId => ids.add(elId))
    })

    if (ids.size === 0) {
      ids.add(1)
    }

    return Array.from(ids)
  }, [sheet])

  const characterElements = useMemo(() => {
    return characterElementIds
      .map(id => elementsMap.get(id))
      .filter(Boolean) as Element[]
  }, [characterElementIds, elementsMap])

  if (modal) {
    return (
      <CharacterProgressionModal
        title={modal.title}
        message={modal.message}
        onConfirm={() => navigate(modal.redirect)}
      />
    )
  }

  if (!sheet) {
    return (
      <div className="campaign-page-loading">
        Carregando ficha do personagem...
      </div>
    )
  }

  return (
    <div className="character-sheet-page">
      <CardInfosGameplay
        level={sheet.base.level}
        hpMax={sheet.base.hp_max}
        manaMax={sheet.base.mana_max}
        armorClass={sheet.derived.armor_class}
        sanityMax={sheet.base.sanity.max}
        speed={sheet.derived.speed}
      />

      <CardTiposPersonagem elements={characterElements} />

      <CardAtributos
        attributes={sheet.base.attributes.final}
        modifiers={sheet.base.modifiers}
      />

      <CardAbilidades
        abilities={sheet.abilities}
        elementsMap={elementsMap}
        characterElements={characterElements}
      />

      <CardPerks
        perks={sheet.perks}
        elementsMap={elementsMap}
      />

      <CardArmadura
        baseArmor={sheet.base.base_ca}
        armors={sheet.armors}
        elementsMap={elementsMap}
      />

      <CardArmas
        weapons={sheet.weapons}
        elementsMap={elementsMap}
      />

      <CardItens
        items={sheet.items}
        elementsMap={elementsMap}
      />

    </div>
  )
}

export default CharacterSheetPage
