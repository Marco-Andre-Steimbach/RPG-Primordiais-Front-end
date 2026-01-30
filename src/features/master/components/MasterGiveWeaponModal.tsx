import { useEffect, useState } from 'react'
import type { CampaignCharacter } from '../campaigns.types'
import type { Weapon } from '../weapons.types'
import type { Item } from '../items.types'
import {
  fetchCampaignCharacterInfos,
  giveWeaponToCharacter
} from '../campaigns.service'
import { giveCharacterGold } from '../characters.service'
import { fetchItemById } from '../items.service'
import { fetchWeaponById } from '../weapons.service'

type EquippedWeapon = {
  campaign_weapon_id: number
  name: string
}

type Props = {
  open: boolean
  weapon: Weapon
  action: 'give' | 'buy'
  campaignId: number
  characters: CampaignCharacter[]
  onClose: () => void
}

function MasterGiveWeaponModal({
  open,
  weapon,
  action,
  campaignId,
  characters,
  onClose
}: Props) {
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [selectedCharacter, setSelectedCharacter] =
    useState<CampaignCharacter | null>(null)

  const [equippedWeapons, setEquippedWeapons] =
    useState<EquippedWeapon[]>([])

  const [weaponToDeactivate, setWeaponToDeactivate] =
    useState<number | null>(null)

  const [goldMap, setGoldMap] =
    useState<Record<number, number>>({})

  const [weaponItem, setWeaponItem] =
    useState<Item | null>(null)

  if (!open) return null

  const needsDeactivate = equippedWeapons.length >= 2

  useEffect(() => {
    if (!open) return

    fetchItemById(weapon.item_id)
      .then(res => setWeaponItem(res.item))
      .catch(() => setError('Erro ao carregar valor da arma.'))
  }, [open, weapon.item_id])

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

  async function handleSelectCharacter(char: CampaignCharacter) {
    setError(null)
    setSelectedCharacter(char)
    setWeaponToDeactivate(null)

    const res = await fetchCampaignCharacterInfos(
      campaignId,
      char.character_id
    )

    const weapons = await Promise.all(
      res.infos.weapons.map(async w => {
        const weaponRes = await fetchWeaponById(w.weapon_id)
        return {
          campaign_weapon_id: w.id,
          name: weaponRes.weapon.item_name
        }
      })
    )

    setEquippedWeapons(weapons)
  }

  async function handleConfirm() {
    if (!selectedCharacter) return

    if (needsDeactivate && !weaponToDeactivate) {
      setError('Escolha uma arma para desequipar.')
      return
    }

    setLoadingId(selectedCharacter.character_id)

    try {
      if (action === 'buy') {
        const gold = goldMap[selectedCharacter.character_id] ?? 0
        const cost = weaponItem?.value ?? 0

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
          campaign_character_id: res.infos.campaign_character_id,
          amount: cost,
          operation: 'remove'
        })
      }

      const payload = {
        weapon_id: weapon.item_id,
        deactivate_weapon_id: needsDeactivate
          ? weaponToDeactivate
          : null,
        equip: true
      }

      console.log('[DEBUG GIVE WEAPON]', {
        campaign_character_id: selectedCharacter.campaign_character_id,
        payload
      })

      await giveWeaponToCharacter(
        selectedCharacter.campaign_character_id,
        payload
      )

      onClose()
    } catch {
      setError('Erro ao processar ação.')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="master-modal-backdrop">
      <div className="master-modal">
        <h3 className="master-modal-title">
          {action === 'give' ? 'Dar arma' : 'Comprar arma'}
        </h3>

        <p className="master-modal-sub">
          {weapon.item_name}
          {weaponItem && <> — Valor: {weaponItem.value} ouro</>}
        </p>

        {error && (
          <div className="master-modal-error">{error}</div>
        )}

        {!selectedCharacter && (
          <div className="master-modal-list">
            {characters.map(char => {
              const gold = goldMap[char.character_id]

              return (
                <button
                  key={char.campaign_character_id}
                  className="master-modal-item"
                  onClick={() => handleSelectCharacter(char)}
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
              Personagem: <strong>{selectedCharacter.name}</strong>
            </div>

            {needsDeactivate && (
              <div className="master-modal-deactivate">
                <p>Escolha uma arma para desequipar:</p>

                {equippedWeapons.map(w => (
                  <button
                    key={w.campaign_weapon_id}
                    className={`deactivate-btn ${
                      weaponToDeactivate === w.campaign_weapon_id
                        ? 'active'
                        : ''
                    }`}
                    onClick={() =>
                      setWeaponToDeactivate(w.campaign_weapon_id)
                    }
                  >
                    {w.name}
                  </button>
                ))}
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

export default MasterGiveWeaponModal
