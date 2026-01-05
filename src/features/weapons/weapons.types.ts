export type WeaponAbility = {
  id: number
  weapon_id: number
  title: string
  description: string
  dice_formula: string
  base_damage: number
  bonus_damage: number
  bonus_accuracy: number
  bonus_speed: number
  element_types: number[]
}

export type Weapon = {
  id: number
  item_id: number
  item_name: string
  item_description: string

  weapon_damage_type_id: number
  damage_type: string

  dice_formula: string
  base_damage: number
  bonus_accuracy: number
  bonus_speed: number

  ammo_item_id: number | null
  ammo_per_use: number

  element_types: number[]
  abilities: WeaponAbility[]
}

export type WeaponsResponse = {
  weapons: {
    id: number
    item_name: string
  }[]
}

export type WeaponResponse = {
  weapon: Weapon
}

export type Item = {
  id: number
  name: string
  description: string
  value: number
  element_types: number[]
}

export type ItemResponse = {
  item: Item
}

export type Element = {
  id: number
  name: string
  description: string
}

export type ElementsResponse = {
  elements: Element[]
}

