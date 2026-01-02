export interface RaceAttributes {
  cha: number
  con: number
  dex: number
  free: number
  int: number
  str: number
  wis: number
}

export interface Race {
  id: number
  name: string
  description: string
  attributes: RaceAttributes
  created_at?: string
  updated_at?: string
}

export interface PerkAttribute {
  attribute_name: stringcha
  attribute_value: number
}

export interface Perk {
  id: number
  name: string
  description: string
  type: string
  mana_cost: number
  race_id: number | null
  order_id: number | null
  required_level: number
  flags: string[]
  attributes: PerkAttribute[]
  ability: any[]
  created_at: string
  updated_at: string
}

export interface RacesResponse {
  races: Race[]
}

export interface RaceResponse {
  race: Race
}

export interface RacePerksResponse {
  perks: Perk[]
}
