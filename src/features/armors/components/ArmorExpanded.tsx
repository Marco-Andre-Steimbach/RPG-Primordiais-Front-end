import { useEffect, useState } from 'react'
import type { Armor, Element, Item } from '../armors.types'
import { fetchElementById, fetchItemById } from '../armors.service'
import { ARMOR_SLOT_MAP } from '../armors.constants'
import ArmorAbilities from './ArmorAbilities'

type Props = {
  armor: Armor
}

function ArmorExpanded({ armor }: Props) {
  const [armorElements, setArmorElements] = useState<Element[]>([])
  const [item, setItem] = useState<Item | null>(null)

  useEffect(() => {
    fetchItemById(armor.item_id).then(res => {
      setItem(res.item)
    })

    Promise.all(
      armor.element_types.map(id =>
        fetchElementById(id).then(res => res.element)
      )
    ).then(setArmorElements)
  }, [armor.item_id, armor.element_types])

  if (!item) return null

  return (
    <div className="item-card-expanded">
      <h3>{item.name}</h3>

      <p>{item.description}</p>
        <br></br>
      <div className="weapon-info-grid">
        <div>
          <strong>Slot: </strong>
          <span>{ARMOR_SLOT_MAP[armor.armor_slot_id]}</span>
        </div>

        <div>
          <strong>Bônus de CA: </strong>
          <span>{armor.armor_class_bonus}</span>
        </div>

        <div>
          <strong>Força mínima: </strong>
          <span>{armor.min_strength_required}</span>
        </div>

        <div>
          <strong>Penalidade de movimento: </strong>
          <span>{armor.speed_penalty}</span>
        </div>

        <div>
          <strong>Valor: </strong>
          <span>{item.value}</span>
        </div>
      </div>

      {armorElements.length > 0 && (
        <>
        <br></br>
          <h4>Elementos</h4>
          <div className="item-elements-list">
            {armorElements.map(el => (
              <span key={el.id} className="item-element-tag">
                {el.name}
              </span>
            ))}
          </div>
        </>
      )}

      {armor.armor_abilities.length > 0 && (
        <>
          <h4>Habilidades</h4>
          {armor.armor_abilities.map(ability => (
            <ArmorAbilities
              key={ability.id}
              ability={ability}
            />
          ))}
        </>
      )}
    </div>
  )
}

export default ArmorExpanded
