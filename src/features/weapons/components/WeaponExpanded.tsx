import { useEffect, useState } from 'react'
import type { Weapon, Element } from '../weapons.types'
import { fetchElementById, fetchItemById } from '../weapons.service'
import WeaponAbilities from './WeaponAbilities'

type Props = {
  weapon: Weapon
  itemValue?: number
  strengthRequirement?: number
}

function WeaponExpanded({
  weapon,
  itemValue,
  strengthRequirement
}: Props) {
  const [weaponElements, setWeaponElements] = useState<Element[]>([])
  const [abilityElements, setAbilityElements] = useState<Record<number, Element[]>>({})
  const [ammoName, setAmmoName] = useState<string | null>(null)

  useEffect(() => {
    Promise.all(
      weapon.element_types.map(id =>
        fetchElementById(id).then(res => res.element)
      )
    ).then(setWeaponElements)

    weapon.abilities.forEach(ability => {
      Promise.all(
        ability.element_types.map(id =>
          fetchElementById(id).then(res => res.element)
        )
      ).then(elements => {
        setAbilityElements(prev => ({
          ...prev,
          [ability.id]: elements
        }))
      })
    })

    if (weapon.ammo_item_id) {
      fetchItemById(weapon.ammo_item_id).then(res =>
        setAmmoName(res.item.name)
      )
    }
  }, [weapon])

  return (
    <div className="item-card-expanded">
      <h3>{weapon.item_name}</h3>

      <p>{weapon.item_description}</p>

      <div className="weapon-info-grid">
        <div>
          <strong>Dano:</strong>
          <span>
            {weapon.dice_formula} + {weapon.base_damage}
          </span>
        </div>

        <div>
          <strong>Tipo:</strong>
          <span>{weapon.damage_type}</span>
        </div>

        {itemValue !== undefined && (
          <div>
            <strong>Valor:</strong>
            <span>{itemValue}</span>
          </div>
        )}

        {strengthRequirement !== undefined && (
          <div>
            <strong>Força mínima:</strong>
            <span>{strengthRequirement}</span>
          </div>
        )}

        {ammoName && (
          <div>
            <strong>Requer:</strong>
            <span>
              {ammoName} ({weapon.ammo_per_use} por ataque)
            </span>
          </div>
        )}
      </div>

      {weaponElements.length > 0 && (
        <>
          <h4>Elementos</h4>
          <div className="item-elements-list">
            {weaponElements.map(el => (
              <span key={el.id} className="item-element-tag">
                {el.name}
              </span>
            ))}
          </div>
        </>
      )}

      {weapon.abilities.length > 0 && (
        <>
          <h4>Habilidades</h4>
          {weapon.abilities.map(ability => (
            <WeaponAbilities
              key={ability.id}
              ability={ability}
              elements={abilityElements[ability.id] ?? []}
            />
          ))}
        </>
      )}
    </div>
  )
}

export default WeaponExpanded
