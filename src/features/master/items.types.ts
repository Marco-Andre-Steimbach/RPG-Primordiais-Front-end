export type Item = {
  id: number
  name: string
  description: string
  value: number
  element_types: number[]
  item_abilities: number[]
}

export type ItemWithTimestamps = Item & {
  created_at: string
  updated_at: string
}

export type FetchItemsResponse = {
  items: Item[]
}

export type CreateItemPayload = {
  name: string
  description: string
  value: number
  element_types: number[]
  item_abilities: number[]
}

export type CreateItemResponse = {
  message: string
  item: ItemWithTimestamps
}

export type CreateItemAbilityPayload = {
  title: string
  description: string
  dice_formula: string | null
  base_damage: number
  bonus_damage: number
  bonus_accuracy: number
  bonus_speed: number
  range: number
  is_consumable: 0 | 1
  max_uses: number | null
  override_element_type_id: number | null
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
  range: number
  is_consumable: boolean
  max_uses: number | null
  override_element_type_id: number | null
  created_at: string
  updated_at: string
}

export type CreateItemAbilityResponse = {
  message: string
  ability: ItemAbility
}
