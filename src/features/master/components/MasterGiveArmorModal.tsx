import { useEffect, useState } from 'react'
import type { CampaignCharacter } from '../campaigns.types'
import type { ArmorListItem } from '../armors.types'
import type { Item } from '../items.types'
import {
  fetchCampaignCharacterInfos,
  giveArmorToCharacter
} from '../campaigns.service'
import { giveCharacterGold } from '../characters.service'
import { fetchItemById } from '../items.service'

type EquippedArmor = {
  armor_id: number
  armor_slot_id: number
}

type Props = {
  open: boolean
  armor: ArmorListItem
  action: 'give' | 'buy'
  campaignId: number
  characters: CampaignCharacter[]
  onClose: () => void
}

function MasterGiveArmorModal({
  open,
  armor,
  action,
  campaignId,
  characters,
  onClose
}: Props) {
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [selectedCharacter, setSelectedCharacter] =
    useState<CampaignCharacter | null>(null)

  const [equippedArmors, setEquippedArmors] =
    useState<EquippedArmor[]>([])

  const [goldMap, setGoldMap] =
    useState<Record<number, number>>({})

  const [itemData, setItemData] =
    useState<Item | null>(null)

  if (!open) return null

  const isDiversosSlot = armor.armor_slot_id === 4

  const hasSameSlotEquipped =
    !isDiversosSlot &&
    equippedArmors.some(
      a => a.armor_slot_id === armor.armor_slot_id
    )

  /* ================= ITEM / GOLD ================= */

  useEffect(() => {
    if (!open || action !== 'buy') return

    fetchItemById(armor.item_id)
      .then(res => setItemData(res.item))
      .catch(() =>
        setError('Erro ao carregar valor da armadura.')
      )
  }, [open, action, armor.item_id])

  useEffect(() => {
    if (action !== 'buy') return

    characters.forEach(char => {
      fetchCampaignCharacterInfos(campaignId, char.character_id)
        .then(res => {
          setGoldMap(v => ({
            ...v,
            [char.character_id]: res.infos.gold
          }))
        })
    })
  }, [action, campaignId, characters])

  /* ================= SELECT CHARACTER ================= */

  async function handleSelectCharacter(char: CampaignCharacter) {
    setError(null)
    setSelectedCharacter(char)

    const res = await fetchCampaignCharacterInfos(
      campaignId,
      char.character_id
    )

    setEquippedArmors(res.infos.armors)
  }

  /* ================= CONFIRM ================= */

  async function handleConfirm() {
    if (!selectedCharacter) return

    setLoadingId(selectedCharacter.character_id)

    try {
      if (action === 'buy') {
        const gold =
          goldMap[selectedCharacter.character_id] ?? 0
        const cost = itemData?.value ?? 0

        if (gold < cost) {
          setError(
            `${selectedCharacter.name} não possui ouro suficiente (${gold}/${cost}).`
          )
          return
        }

        const res = await fetchCampaignCharacterInfos(
          campaignId,
          selectedCharacter.character_id
        )

        await giveCharacterGold({
          campaign_character_id:
            res.infos.campaign_character_id,
          amount: cost,
          operation: 'remove'
        })
      }

      await giveArmorToCharacter(
        selectedCharacter.campaign_character_id,
        {
          armor_item_id: armor.item_id,
          equip: true
        }
      )

      onClose()
    } catch {
      setError('Erro ao processar ação.')
    } finally {
      setLoadingId(null)
    }
  }

  /* ================= UI ================= */

  return (
    <div className="master-modal-backdrop">
      <div className="master-modal">
        <h3 className="master-modal-title">
          {action === 'give'
            ? 'Dar armadura'
            : 'Comprar armadura'}
        </h3>

        <p className="master-modal-sub">
          {armor.item_name}
          {itemData && (
            <> — Valor: {itemData.value} ouro</>
          )}
        </p>

        {error && (
          <div className="master-modal-error">
            {error}
          </div>
        )}

        {!selectedCharacter && (
          <div className="master-modal-list">
            {characters.map(char => {
              const gold = goldMap[char.character_id]

              return (
                <button
                  key={char.campaign_character_id}
                  className="master-modal-item"
                  onClick={() =>
                    handleSelectCharacter(char)
                  }
                >
                  <strong>{char.name}</strong>
                  <span>{char.controlled_by}</span>

                  {action === 'buy' && (
                    <span className="master-modal-gold">
                      Ouro: {gold ?? '...'}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {selectedCharacter && (
          <>
            <div className="master-modal-selected">
              Personagem:{' '}
              <strong>{selectedCharacter.name}</strong>
            </div>

            {hasSameSlotEquipped && (
              <div className="master-modal-warning">
                Este personagem já possui uma armadura
                neste slot.
                <br />
                A armadura atual será substituída.
              </div>
            )}

            <div className="master-modal-actions">
              <button
                className="master-modal-confirm"
                disabled={loadingId !== null}
                onClick={handleConfirm}
              >
                Confirmar
              </button>

              <button
                className="master-modal-close"
                onClick={onClose}
              >
                Cancelar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default MasterGiveArmorModal
