import type { WeaponAbility, Element } from '../weapons.types'

type Props = {
  ability: WeaponAbility
  elements?: Element[]
}

function WeaponAbilities({ ability, elements = [] }: Props) {
  return (
    <div className="item-ability-card">
      <h5 className="item-ability-title">{ability.title}</h5>

      <p className="item-ability-description">{ability.description}</p>

      {elements.length > 0 && (
        <>
          <div className="item-ability-divider" />

          <div className="item-elements-list">
            {elements.map(el => (
              <span key={el.id} className="item-element-tag">
                {el.name}
              </span>
            ))}
          </div>
        </>
      )}

      <div className="item-ability-divider" />

      <div className="item-ability-meta">
        <div>
          <span>Dados</span>
          <strong>{ability.dice_formula}</strong>
        </div>

        <div>
          <span>Dano Base</span>
          <strong>{ability.base_damage}</strong>
        </div>

        <div>
          <span>Bônus Dano</span>
          <strong>{ability.bonus_damage}</strong>
        </div>

        <div>
          <span>Precisão</span>
          <strong>{ability.bonus_accuracy}</strong>
        </div>

        <div>
          <span>Velocidade</span>
          <strong>{ability.bonus_speed}</strong>
        </div>
      </div>
    </div>
  )
}

export default WeaponAbilities
