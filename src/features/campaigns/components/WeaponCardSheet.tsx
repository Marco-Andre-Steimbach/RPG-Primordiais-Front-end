import { useEffect, useState } from 'react'
import type { Element, Item, SheetWeapon } from '../campaigns.types'
import { fetchItemById } from '../campaigns.service'

type Props = {
  weapon: SheetWeapon
  elementsMap: Map<number, Element>
  isOpen: boolean
  onToggle: () => void
}

function WeaponCardSheet({
  weapon,
  elementsMap,
  isOpen,
  onToggle
}: Props) {
  const [item, setItem] = useState<Item | null>(null)

  useEffect(() => {
    if (!isOpen || item) return
    fetchItemById(weapon.item_id).then(res => setItem(res.item))
  }, [isOpen])

  const resolvedElements = weapon.element_types
    .map(id => elementsMap.get(id))
    .filter(Boolean) as Element[]

  return (
    <div className="ability-wrapper">
      <div className="campaign-ability-card" onClick={onToggle}>
        <span className="campaign-ability-name">
          {item?.name ?? weapon.item_name}
        </span>
        <span className="campaign-ability-cost">
          {weapon.dice_formula}
        </span>
      </div>

      {isOpen && (
        <div className="weapon-card-expanded">
          {item?.description && (
            <p className="weapon-description">
              {item.description}
            </p>
          )}

          <div className="weapon-divider" />

          <div className="weapon-stats">
            <div>
              <span>Dano</span>
              <strong>
                {weapon.dice_formula}
                {weapon.base_damage > 0 &&
                  ` + ${weapon.base_damage}`}
              </strong>
            </div>

            <div>
              <span>Tipo</span>
              <strong>{weapon.damage_type}</strong>
            </div>

            {weapon.range > 0 && (
              <div>
                <span>Alcance</span>
                <strong>{weapon.range} casas</strong>
              </div>
            )}
          </div>

          {resolvedElements.length > 0 && (
            <>
              <div className="weapon-divider" />
              <div className="weapon-elements">
                {resolvedElements.map(el => (
                  <span
                    key={el.id}
                    className="item-element-tag"
                  >
                    {el.name}
                  </span>
                ))}
              </div>
            </>
          )}

          {weapon.abilities.length > 0 && (
            <>
              <div className="weapon-divider" />
              <h4 className="weapon-section-title">
                Habilidades
              </h4>

              <div className="weapon-abilities">
                {weapon.abilities.map(ab => (
                  <div
                    key={ab.id}
                    className="weapon-ability-card"
                  >
                    <div className="weapon-ability-header">
                      <strong>{ab.title}</strong>
                      {ab.range > 0 && (
                        <span>
                          Alcance {ab.range}
                        </span>
                      )}
                    </div>

                    {(ab.dice_formula ||
                      ab.base_damage > 0) && (
                      <div className="weapon-ability-damage">
                        Dano {ab.dice_formula}
                        {ab.base_damage > 0 &&
                          ` + ${ab.base_damage}`}
                      </div>
                    )}

                    <p>{ab.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default WeaponCardSheet
