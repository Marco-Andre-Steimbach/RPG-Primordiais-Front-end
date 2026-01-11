export type Race = {
  id: number
  name: string
  image?: string
}

export type Order = {
  id: number
  name: string
  image?: string
}

export type ManaModifier = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha'

export type CreateCharacterPayload = {
  name: string
  description: string
  race_id: number
  order_id: number | null
  mana_modifier: ManaModifier
}

export type Character = {
  id: number
  name: string
  race_id: number | null
  order_id: number | null
}

export type CharactersMeResponse = {
  characters: Character[]
}

export type CharacterBase = {
  id: number
  name: string
  description: string
  race_id: number | null
  order_id: number | null
  mana_modifier: ManaModifier
  created_by: number
  created_at: string
  updated_at: string
}

export type ElementType = {
  id: number
  name: string
}

export type Ability = {
  id: number
  title: string
  description: string
  arcane_title: string | null
  arcane_description: string | null
  mana_cost: number
  arcane_mana_cost: number | null
  dice_formula: string
  base_damage: number
  bonus_speed: number
  required_race_id: number | null
  required_order_id: number | null
  element_types: ElementType[]
}

export type CharacterFull = {
  character: CharacterBase
  owner: string
  abilities: Ability[]
}

export type CharacterByIdResponse = {
  character: CharacterFull
}

export type RaceResponse = {
  race: Race
}

export type OrderResponse = {
  order: Order
}

export type CreateAbilityPayload = {
  title: string
  description: string
  arcane_title: string | null
  arcane_description: string | null
  mana_cost: number
  arcane_mana_cost: number | null
  dice_formula: string
  base_damage: number
  bonus_speed: number
  element_types: number[]
  required_race_id: number | null
  required_order_id: number | null
}

export type RacesResponse = {
  races: Race[]
}

export type OrdersResponse = {
  orders: Order[]
}
