export interface PerkAttribute {
    attribute_name: string
    attribute_value: number
  }
  
  export interface Perk {
    id: number
    name: string
    description: string
    type: 'active' | 'passive'
    mana_cost: number
    race_id: number | null
    order_id: number | null
    required_level: number
    element_types: number[]
    flags: string[]
    attributes: PerkAttribute[]
    ability: Ability | {}
  }
  
  export type Ability = {
    name: string
    description: string
    dice_formula?: string | null
    base_damage: number
    bonus_accuracy: number
    bonus_damage: number
    bonus_speed: number
  }
  