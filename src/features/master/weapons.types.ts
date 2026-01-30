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
    range: number
    element_types: number[]
    created_at: string
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
    range: number
    bonus_speed: number
    ammo_item_id: number | null
    ammo_per_use: number
    created_at: string
    element_types: number[]
  }
  
  export type WeaponWithAbilities = Weapon & {
    abilities: WeaponAbility[]
  }
  
  export type FetchWeaponsResponse = {
    weapons: Weapon[]
  }
  
  export type FetchWeaponByIdResponse = {
    weapon: WeaponWithAbilities
  }
  