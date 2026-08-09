import { useEffect, useMemo, useState } from 'react'
import {
  fetchFullCharacterSheet,
  fetchAllElements
} from '../../campaigns/campaigns.service'
import type {
  FullCharacterSheet,
  Element
} from '../../campaigns/campaigns.types'

import CardInfosGameplay from '../../campaigns/components/CardInfosGameplay'
import CardAtributos from '../../campaigns/components/CardAtributos'
import CardAbilidades from '../../campaigns/components/CardAbilidades'
import CardTiposPersonagem from '../../campaigns/components/CardTiposPersonagem'
import CardFraquezasDefensivas from '../../campaigns/components/CardFraquezasDefensivas'
import CardArmadura from '../../campaigns/components/CardArmadura'
import CardArmas from '../../campaigns/components/CardArmas'
import CardItens from '../../campaigns/components/CardItens'
import CardPerks from '../../campaigns/components/CardPerks'
import CollapsibleSection from '../../campaigns/components/CollapsibleSection'

type Props = {
  campaignId: number
  characterId: number
}

const DAMAGE_TYPE_MAP: Record<number, string> = {
  1: 'Cortante',
  2: 'Perfurante',
  3: 'Concussão'
}

function getCharacterWeakDamageTypes(armors: any[]) {
  const chestArmor = armors.find(
    armor =>
      armor.is_equipped &&
      armor.armor.armor_slot_id === 2
  )

  if (!chestArmor) {
    return [1, 2, 3]
  }

  const weakType =
    chestArmor.armor.weak_damage_type_id

  if (!weakType) {
    return []
  }

  return [weakType]
}

function MasterCombatPlayerSheet({
  campaignId,
  characterId
}: Props) {
  const [sheet, setSheet] =
    useState<FullCharacterSheet | null>(null)

  const [elements, setElements] =
    useState<Element[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    Promise.all([
      fetchFullCharacterSheet(
        String(campaignId),
        String(characterId)
      ),
      fetchAllElements()
    ])
      .then(([sheetResponse, elementsResponse]) => {
        setSheet(sheetResponse.sheet)
        setElements(elementsResponse.elements)
      })
      .catch(() => {
        setError(
          'Erro ao carregar ficha do personagem.'
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }, [campaignId, characterId])

  const elementsMap = useMemo(() => {
    const map = new Map<number, Element>()

    elements.forEach(element => {
      map.set(element.id, element)
    })

    return map
  }, [elements])

  const characterElementIds = useMemo(() => {
    if (!sheet) {
      return []
    }

    const ids = new Set<number>()

    sheet.armors.forEach(armor => {
      armor.elements.forEach(elementId => {
        ids.add(elementId)
      })
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

  const weakDamageTypes = useMemo(() => {
    if (!sheet) {
      return []
    }

    return getCharacterWeakDamageTypes(
      sheet.armors
    ).map(id => ({
      id,
      name: DAMAGE_TYPE_MAP[id]
    }))
  }, [sheet])

  const attributePerks = useMemo(() => {
    if (!sheet) {
      return []
    }

    return sheet.perks.filter(
      perk =>
        perk.has_attributes &&
        !perk.has_ability
    )
  }, [sheet])

  const combatPerks = useMemo(() => {
    if (!sheet) {
      return []
    }

    return sheet.perks.filter(
      perk =>
        perk.has_ability ||
        !perk.has_attributes
    )
  }, [sheet])

  if (loading) {
    return (
      <div className="master-combat-empty">
        Carregando ficha do personagem...
      </div>
    )
  }

  if (error || !sheet) {
    return (
      <div className="master-combat-empty">
        {error ?? 'Ficha não encontrada.'}
      </div>
    )
  }

  return (
    <div className="master-combat-player-sheet">
      <CardInfosGameplay
        level={sheet.base.level}
        hpMax={sheet.base.hp_max}
        manaMax={sheet.base.mana_max}
        armorClass={sheet.derived.armor_class}
        sanityMax={sheet.base.sanity.max}
        speed={sheet.derived.speed}
      />

      <CardTiposPersonagem
        elements={characterElements}
      />

      <CardFraquezasDefensivas
        damageTypes={weakDamageTypes}
      />

      <CardAtributos
        attributes={sheet.base.attributes.final}
        modifiers={sheet.base.modifiers}
      />

      <CollapsibleSection title="Habilidades">
        <CardAbilidades
          abilities={sheet.abilities}
          elementsMap={elementsMap}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Perks">
        <CardPerks
          perks={combatPerks}
          elementsMap={elementsMap}
        />
      </CollapsibleSection>

      {attributePerks.length > 0 && (
        <CollapsibleSection title="Perks de Atributo">
          <CardPerks
            perks={attributePerks}
            elementsMap={elementsMap}
          />
        </CollapsibleSection>
      )}

      <CollapsibleSection title="Armadura">
        <CardArmadura
          baseArmor={sheet.base.base_ca}
          armors={sheet.armors}
          elementsMap={elementsMap}
          campaignCharacterId={
            sheet.base.campaign_character_id
          }
        />
      </CollapsibleSection>

      <CollapsibleSection title="Armas">
        <CardArmas
          weapons={sheet.weapons}
          elementsMap={elementsMap}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Itens">
        <CardItens
          items={sheet.items}
          elementsMap={elementsMap}
          campaignCharacterId={
            sheet.base.campaign_character_id
          }
        />
      </CollapsibleSection>
    </div>
  )
}

export default MasterCombatPlayerSheet
