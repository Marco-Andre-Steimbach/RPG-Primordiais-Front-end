import type { ArmorAbility, Element } from '../armors.types'

type Props = {
  ability: ArmorAbility
  elements?: Element[]
}

function ArmorAbilities({ ability, elements = [] }: Props) {
  return (
    <div className="item-ability-card">
      <h5 className="item-ability-title">{ability.title}</h5>

      <p className="item-ability-description">{ability.description}</p>

      {elements.length > 0 && (
        <>
          <div className="item-ability-divider" />

          <div className="item-elements-list">
            {elements.map(el => (
              <span key={el.id} className="weapon-element-tag">
                {el.name}
              </span>
            ))}
          </div>
        </>
      )}

      <div className="item-ability-divider" />

      <div className="item-ability-meta">
        {ability.dice_formula && (
          <div>
            <span>Dados</span>
            <strong>{ability.dice_formula}</strong>
          </div>
        )}

        {ability.armor_class_bonus !== 0 && (
          <div>
            <span>Bônus de CA</span>
            <strong>{ability.armor_class_bonus}</strong>
          </div>
        )}

        {ability.bonus_speed !== 0 && (
          <div>
            <span>Velocidade</span>
            <strong>{ability.bonus_speed}</strong>
          </div>
        )}
      </div>
    </div>
  )
}

export default ArmorAbilities
