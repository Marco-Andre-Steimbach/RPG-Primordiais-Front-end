import { useEffect, useState } from 'react'
import type { LupidaArmor, Element } from '../campaigns.types'
import { fetchElementById } from '../campaigns.service'

type Props = {
  armor: LupidaArmor
  onBuy: (armor: LupidaArmor) => void
}

const DAMAGE_TYPE_MAP: Record<number, string> = {
  1: 'Cortante',
  2: 'Perfurante',
  3: 'Concussão'
}

function LupidaArmorCard({ armor, onBuy }: Props) {
  const [open, setOpen] = useState(false)
  const [elements, setElements] = useState<Element[]>([])

  useEffect(() => {
    if (!open || armor.elements.length === 0) return

    Promise.all(armor.elements.map(id => fetchElementById(id)))
      .then(res => setElements(res.map(r => r.element)))
  }, [open, armor.elements])

  return (
    <div className="lupida-armor-card">
      <div className="lupida-armor-header" onClick={() => setOpen(v => !v)}>
        <strong>{armor.item_name}</strong>
        <span>{armor.value} ouro</span>
      </div>

      {open && (
        <div className="lupida-armor-body">
          <p>{armor.item_description}</p>

          <div className="lupida-armor-stats">
            <span>Slot: {armor.slot_name}</span>
            <span>CA +{armor.armor_class_bonus}</span>
            <span>Força mínima: {armor.min_strength_required}</span>
            <span>Penalidade: {armor.speed_penalty}</span>

            {armor.weak_damage_type_id && (
              <span>Fraqueza: {DAMAGE_TYPE_MAP[armor.weak_damage_type_id]}</span>
            )}
          </div>

          {elements.length > 0 && (
            <div className="lupida-armor-elements">
              {elements.map(el => (
                <span key={el.id} className="lupida-element-tag">{el.name}</span>
              ))}
            </div>
          )}

          {armor.abilities.length > 0 && (
            <div className="lupida-armor-abilities">
              {armor.abilities.map(ab => (
                <div key={ab.id} className="lupida-armor-ability">
                  <strong>{ab.title}</strong>
                  <p>{ab.description}</p>
                </div>
              ))}
            </div>
          )}

          <button className="lupida-buy-button" onClick={() => onBuy(armor)}>
            Comprar
          </button>
        </div>
      )}
    </div>
  )
}

export default LupidaArmorCard
