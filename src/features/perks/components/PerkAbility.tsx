import type { Ability } from '../perks.types'

function PerkAbility({ ability }: { ability: Ability }) {
  const hasDamage =
    ability.base_damage > 0 ||
    ability.bonus_damage > 0 ||
    (ability.dice_formula && ability.dice_formula !== '')

  return (
    <div className="perk-card perk-ability">
      <h3 className="perk-title">{ability.name}</h3>

      <p className="perk-description">{ability.description}</p>

      <div className="perk-ability-stats">
        {ability.bonus_accuracy > 0 && (
          <div className="perk-stat">
            <span>Bônus para acerto:</span>
            <strong>+{ability.bonus_accuracy}</strong>
          </div>
        )}

        {hasDamage && (
          <div className="perk-stat">
            <span>Dano:</span>
            <strong>
              {ability.dice_formula ?? ''}
              {ability.base_damage > 0 ? ` + ${ability.base_damage}` : ''}
              {ability.bonus_damage > 0 ? ` + ${ability.bonus_damage}` : ''}
            </strong>
          </div>
        )}

        {ability.bonus_speed > 0 && (
          <div className="perk-stat">
            <span>Bônus de velocidade:</span>
            <strong>+{ability.bonus_speed}</strong>
          </div>
        )}
      </div>
    </div>
  )
}

export default PerkAbility
