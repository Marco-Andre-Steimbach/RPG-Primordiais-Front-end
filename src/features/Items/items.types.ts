export type Item = {
  id: number
  name: string
  description: string
  value: number
  element_types: number[]
  item_abilities: number[]
}

export type ItemAbility = {
  id: number
  title: string
  description: string
  dice_formula: string | null
  base_damage: number
  bonus_damage: number
  bonus_accuracy: number
  bonus_speed: number
  is_consumable: boolean
  max_uses: number | null
  override_element_type_id: number | null
}


export type Element = {
  id: number
  name: string
  description: string
}

export type ItemsResponse = {
  items: Item[]
}

export type ItemAbilitiesResponse = {
  abilities: ItemAbility[]
}

export type ElementResponse = {
  element: Element
}
