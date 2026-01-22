export type MonsterStats = {
    hp: number
    ac: number
    speed: number
    actions_per_turn: number
    str: number
    dex: number
    con: number
    wis: number
    int: number
  }
  
  export type MonsterAttack = {
    id: number
    name: string
    description: string
    dice_formula: string
    base_damage: number
    bonus_accuracy: number
    attack_range: number
    weapon_damage_type_id: number | null
    created_at: string
    element_types: number[]
  }
  
  export type MonsterAbility = {
    id: number
    title: string
    description: string
    dice_formula: string
    base_damage: number
    bonus_damage: number
    bonus_speed: number
    ability_range: number
    created_at: string
    element_types: number[]
  }
  
  export type MonsterFull = {
    id: number
    name: string
    description: string
    xp_reward: number
    stats: MonsterStats
    element_types: number[]
    attacks: MonsterAttack[]
    abilities: MonsterAbility[]
  }
  
  export type MonsterByIdResponse = {
    monster: MonsterFull
  }
  
  export type MonsterListItem = {
    id: number
    name: string
    description: string
  }
  
  export type MonstersResponse = {
    monsters: MonsterListItem[]
  }
  
  export type CreateMonsterPayload = {
    name: string
    description: string
  }
  